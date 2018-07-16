// This approach is used for restriction site detection:
// https://medium.com/@keithwhor/nbeam-how-i-wrote-an-ultra-fast-dna-sequence-alignment-algorithm-in-javascript-c199e936da
import reSiteDefinitions from '../re-site-definitions.json';
import {getComplementSequence} from './sequence';
import {getNamedColor} from './colors';

const restrictionSiteDefinitions = Object.entries(reSiteDefinitions).map(entry => entry[1])[0];
const popularReSiteDefinitions = restrictionSiteDefinitions.filter(site => site.subLists.includes('POPULAR'));

// Each base is 4 bits
// A : 1000
// T : 0100
// G : 0010
// C : 0001
// Mixed bases are constructed using bitwise OR
// M = A | C = 1000 | 0001 = 1001

const baseToBinary = {
  A: 0b1000, // 1000
  T: 0b100, // 0100
  G: 0b10, // 0010
  C: 0b1, // 0001
  W: 0b1100, // 1100  = A | T
  S: 0b11, // 0011    = G | C
  M: 0b1001, // 1001  = A | C
  K: 0b110, // 0110   = T | G
  R: 0b1010, // 1010  = A | G
  Y: 0b101, // 0101   = T | C
  B: 0b111, // 0111   = not A
  D: 0b1110, // 1110  = not C
  H: 0b1101, // 1101  = not G
  V: 0b1011, // 1011  = not T
  N: 0b1111 // 1111   = any
};

export const getRestrictionSites = (sequenceString, reSiteDefinitions) => {
  console.log('function fired');
  const sequenceLength = sequenceString.length;
  const complementString = getComplementSequence(sequenceString.toUpperCase());
  const reversedComplementString = complementString
    .split('')
    .reverse()
    .join('');
  const sequenceComplementBinary = convertSequenceToBinary(reversedComplementString);
  const sequenceBinary = convertSequenceToBinary(sequenceString.toUpperCase());

  var reSites = [];

  popularReSiteDefinitions.map(site => {
    const siteLength = site.recognitionSequence.length;
    const forwardMatches = matchSequences(site.recognitionSequence, sequenceBinary);
    const reverseMatches = matchSequences(site.recognitionSequence, sequenceComplementBinary);

    forwardMatches.map(index => {
      reSites.push({
        name: site.name,
        startIndex: index,
        endIndex: index + siteLength - 1,
        overhang: Number(site.overhang),
        cutIndex3_5: Number(site.cutIndex3_5),
        direction: 1,
        color: getNamedColor(site.name)
      });
    });
    reverseMatches.map(index => {
      reSites.push({
        name: site.name,
        startIndex: sequenceLength - index - siteLength,
        endIndex: sequenceLength - index - 1,
        overhang: Number(site.overhang),
        cutIndex3_5: Number(site.cutIndex3_5),
        direction: -1,
        color: getNamedColor(site.name)
      });
    });
  });

  console.log(sequenceString);
  console.log(reSites);
  const uniqueReSites = uniqueRestrictionSites(reSites);
  const sortedReSites = sortRestrictionSites(uniqueReSites);

  console.log(sequenceLength);
  console.log(sequenceBinary.byteLength);
  return sortedReSites;
};

var bitCountLookup = [];
for (var i = 0; i < 256; i++) {
  var count = 0;
  var n = i;
  while (n !== 0) {
    count++;
    n &= n - 1;
  }
  bitCountLookup.push(count);
}

const sortRestrictionSites = sites => {
  const sorted = sites.sort((a, b) => {
    if (a.startIndex < b.startIndex) {
      return -1;
    } else if (b.startIndex < a.startIndex) {
      return 1;
    } else {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      }
    }

    return 0;
  });

  return sorted;
};

const uniqueRestrictionSites = sites => {
  return sites.filter(
    (site, index, arr) => index === arr.findIndex(s => s.name === site.name && s.startIndex === site.startIndex)
  );
};

/**
 * Converts string representation of a sequence to a binary representation of the sequence
 * @param sequenceString - sequence represented as a string
 * @return {Uint32Array} binary buffer representing sequence
 */
const convertSequenceToBinary = sequenceString => {
  var sequenceBuffer, view, i, len, bases;

  // two nucleotide bases per byte
  // we need a multiple of 4 bytes for a uint32array
  const length = sequenceString.length;
  const byteLength = Math.ceil(length / 2);
  const endPadding = (4 - (byteLength % 4)) % 4;
  sequenceBuffer = new ArrayBuffer(byteLength + endPadding);
  view = new DataView(sequenceBuffer);

  // for "AC", the following would yield
  // uint8view[i] = 0000 0000 (starting array)
  // uint8view[i] = 0000 1000 ('A')
  // uint8view[i] = 1000 0000 (<< 4)
  //                     0100 ('T')
  // uint8view[i] = 1000 0100 (|=)

  for (i = 0, len = sequenceBuffer.byteLength; i < len; i++) {
    bases = baseToBinary[sequenceString[i * 2]] << 4;
    bases |= baseToBinary[sequenceString[i * 2 + 1]];
    view.setUint8(i, bases);
  }

  return view;
};

const printDataView = dv => {
  const len = dv.byteLength / 4;
  var str = '';
  for (var i = 0; i < len; i++) {
    str += dv.getUint32(i << 2).toString(2) + ' ';
  }
  console.log(str);
};

const print32Bit = b => {
  var str = '';
  for (var i = 0; i < 4; i++) {
    str = (b & 0b11111111).toString(2) + ' ' + str;
    b = b >>> 8;
  }
  console.log(str);
};

// for a 32bit strand that is the OR of two 32bit DNA strands
const matchCount = T => {
  var matches = T;
  var numMatches = 0;
  matches |= matches >>> 1;
  matches |= matches >>> 2;
  matches &= 0x11111111;
  matches |= matches >>> 3;
  matches |= matches >>> 6;
  numMatches += bitCountLookup[((matches >>> 12) & 0xf0) | (matches & 0xf)];
  return numMatches;
};

/**
 * Returns all starting indices of the sequence where the pattern matches
 * @param pattern - dna pattern (binary representation) we are trying to find in our sequence
 * @param sequence - dna sequence (binary representation) we are searching
 * @return {Array<int>} of indixes in sequence where pattern matches
 */
const matchSequences = (patternString, sequenceBinary) => {
  var mapBuffer, mapArray, A, A1, A2, B, T, cur, pos, i, k, adjustNeg, adjustPos;

  const patternBinary = convertSequenceToBinary(patternString.toUpperCase());
  const patternStringLength = patternString.length;

  // We want to process the DNA in chunks of 8 bases (32 bits)
  const patternByteLength = patternBinary.byteLength;
  const patternLength = patternByteLength >> 2;
  const sequenceByteLength = sequenceBinary.byteLength;
  const sequenceLength = sequenceByteLength >> 2;

  const matchLen = sequenceByteLength << 3;
  var matchBuffer = new ArrayBuffer(matchLen);
  var matchView = new DataView(matchBuffer);

  for (k = 0; k < patternLength; k++) {
    A = patternBinary.getUint32(k << 2);

    for (i = k; i < sequenceLength; i++) {
      B = sequenceBinary.getUint32(i << 2);

      // if match without shifting is non-zero, count matches

      const pos = (i - k) << 5;

      (T = A & B) && matchView.setUint32(pos, matchView.getUint32(pos) + matchCount(T));
    }

    A1 = A >>> 4;
    A2 = A << 4;

    adjustPos = (k << 3) + 1;
    adjustNeg = (k << 3) - 1;

    // break loop if A1 and A2 have been shifted far enough
    // to zero them both out
    while (A1 || A2) {
      for (i = 0; i < sequenceLength; i++) {
        B = sequenceBinary.getUint32(i << 2);
        pos = (i - k) << 3;

        // if match without shifting is non-zero, count matches
        const pos1 = (pos + adjustPos) << 2;
        const pos2 = (pos + adjustNeg) << 2;

        if (pos1 < matchLen) {
          (T = A1 & B) && matchView.setUint32(pos1, matchView.getUint32(pos1) + matchCount(T));
        }
        if (pos2 > -1) {
          (T = A2 & B) && matchView.setUint32(pos2, matchView.getUint32(pos2) + matchCount(T));
        }
      }

      // keep "walking" / shifting current integer to each offset

      A1 >>>= 4;
      A2 <<= 4;

      ++adjustPos;
      --adjustNeg;
    }
  }

  var matchIndices = [];
  for (k = 0; k < matchLen; k += 4) {
    if (matchView.getUint32(k) === patternStringLength) {
      matchIndices.push(k >> 2);
    }
  }

  return matchIndices;
};
