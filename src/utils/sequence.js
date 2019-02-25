import {MIN_ORF_SIZE, charMap} from '../constants';

const chars = 'AGTC';
const getChar = () => chars[Math.floor(Math.random() * (3 + 1)) + 0];
export const isValidDna = seq => !new RegExp(`[^${chars}]`, 'ig').test(seq);

const randInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateSequence = (min = 1000, max = 100000) => {
  const len = randInRange(min, max);
  let sequence = '';
  for (let i = 0; i < len; i++) {
    sequence += getChar();
  }
  return sequence;
};

export const flipSequence = (map, sequence) => {
  let res = '';
  for (let i = 0; i < sequence.length; i++) {
    res += map[sequence[i]] || sequence[i];
  }
  return res;
};

export const getComplementSequence = sequence => {
  return flipSequence(charMap, sequence);
};

export const toTriplets = sequence => sequence.match(/.{1,3}/g);
export const findMatches = (base, pattern, tripletSearch) => {
  const result = [];

  let indexFound = base.indexOf(pattern);
  while (indexFound > -1) {
    result.push(indexFound);
    indexFound = tripletSearch ? indexFound + 3 : indexFound + 1;
    indexFound = base.indexOf(pattern, indexFound);
  }

  return result;
};
export const getReverseComplement = seq =>
  flipSequence(
    charMap,
    seq
      .split('')
      .reverse()
      .join('')
  );
export const aminoAcidTranslationTable = {
  TTT: 'F',
  TTC: 'F',
  TTA: 'L',
  TTG: 'L',
  CTT: 'L',
  CTC: 'L',
  CTA: 'L',
  CTG: 'L',
  ATT: 'I',
  ATC: 'I',
  ATA: 'I',
  ATG: 'M',
  GTT: 'V',
  GTC: 'V',
  GTA: 'V',
  GTG: 'V',
  TCT: 'S',
  TCC: 'S',
  TCA: 'S',
  TCG: 'S',
  AGT: 'S',
  AGC: 'S',
  CCT: 'P',
  CCC: 'P',
  CCA: 'P',
  CCG: 'P',
  ACT: 'T',
  ACC: 'T',
  ACA: 'T',
  ACG: 'T',
  GCT: 'A',
  GCC: 'A',
  GCA: 'A',
  GCG: 'A',
  TAT: 'Y',
  TAC: 'Y',
  TAA: '*',
  TAG: '*',
  TGA: '*',
  CAT: 'H',
  CAC: 'H',
  CAA: 'Q',
  CAG: 'Q',
  AAT: 'N',
  AAC: 'N',
  AAA: 'K',
  AAG: 'K',
  GAT: 'D',
  GAC: 'D',
  GAA: 'E',
  GAG: 'E',
  TGT: 'C',
  TGC: 'C',
  TGG: 'W',
  CGT: 'R',
  CGC: 'R',
  CGA: 'R',
  CGG: 'R',
  AGA: 'R',
  AGG: 'R',
  GGT: 'G',
  GGC: 'G',
  GGA: 'G',
  GGG: 'G'
};

export const detectOrfs = ({sequence = '', startCodons = ['ATG'], minAALength = MIN_ORF_SIZE}) => {
  const complementSequence = flipSequence(charMap, sequence);
  const STOP_CODON = ['TAG'];
  const {starters, complementStarters} = startCodons.reduce(
    (acc, startCodon) => ({
      starters: acc.starters.concat(findMatches(sequence, startCodon, false)),
      complementStarters: acc.complementStarters.concat(findMatches(complementSequence, startCodon, false))
    }),
    {starters: [], complementStarters: []}
  );

  const {stoppers, complementStoppers} = STOP_CODON.reduce(
    (acc, stopCodon) => ({
      stoppers: acc.stoppers.concat(findMatches(sequence, stopCodon, false)),
      complementStoppers: acc.complementStoppers.concat(findMatches(complementSequence, stopCodon, false))
    }),
    {stoppers: [], complementStoppers: []}
  );

  starters.sort();
  complementStarters.sort();
  stoppers.sort();
  complementStoppers.sort();

  var pairs = {},
    firstRelevantStopper = {index: 0};
  let orfs = [];
  // Foreach starter get his stopper
  starters.forEach(function(starter) {
    orfs = orfs.concat(
      detectOrfsInDnaSequence(
        starter,
        stoppers,
        sequence,
        minAALength,
        pairs,
        startCodons,
        firstRelevantStopper,
        'forward'
      )
    );
  });
  pairs = {};
  firstRelevantStopper = {index: 0};
  complementStarters.forEach(function(starter) {
    orfs = orfs.concat(
      detectOrfsInDnaSequence(
        starter,
        complementStoppers,
        sequence,
        minAALength,
        pairs,
        startCodons,
        firstRelevantStopper,
        'reverse'
      )
    );
  });

  orfs.sort((a, b) => {
    if (a.startIndex === b.startIndex) {
      return 0;
    }
    if (a.startIndex < b.startIndex) {
      return -1;
    }
    return 1;
  });

  return orfs;
};

/**
 * Given specific start position and list of stop positions in the sequence matches start index to stop indexes.
 * @param {int} startIndex
 * @param {Array} stoppers
 * @param {String} dnaSequence
 * @param {int} minAALength
 * @param {Object} pairs
 * @param {Array} startCodons
 * @param firstRelevantStopper
 * @param {String} strand
 * @return {Array}
 */
function detectOrfsInDnaSequence(
  startIndex,
  stoppers,
  dnaSequence,
  minAALength,
  pairs,
  startCodons,
  firstRelevantStopper,
  strand
) {
  const singleAALength = 3;
  var orfs = [],
    stopIndex,
    diff;

  for (var i = firstRelevantStopper.index; i < stoppers.length; i++) {
    stopIndex = stoppers[i];
    diff = stopIndex - startIndex - singleAALength;

    if (diff < minAALength * singleAALength) {
      if (diff < 0) {
        firstRelevantStopper.index = i;
      }
      // If it on the same frame
      else if (diff % singleAALength == 0 && diff >= 0) {
        return orfs;
      }
    } else if (diff % singleAALength === 0) {
      var start = strand == 'reverse' ? dnaSequence.length - 1 - startIndex : startIndex;
      var end = strand == 'reverse' ? dnaSequence.length - 1 - (stopIndex + 2) : stopIndex + 2;
      var frame;

      if (strand === 'reverse') {
        frame = -((dnaSequence.length - start) % 3 === 0 ? 3 : (dnaSequence.length - start) % 3);
      } else {
        frame = (start + 1) % 3 === 0 ? 3 : (start + 1) % 3;
      }

      if (!pairs[stopIndex]) {
        var location = {start: start > end ? end : start, end: end > start ? end : start};
        var orf = {
          location: [location],
          startCodons: startCodons,
          starters: [start],
          strand: strand,
          frame: frame,
          //TODO: color should not be set on model (should be a rendering property only)
          color: '#ff0000'
        };
        orfs.push(orf);
        pairs[stopIndex] = orf;
      } else {
        pairs[stopIndex].starters.push(start);
      }
      return orfs;
    }
  }
  return orfs;
}
