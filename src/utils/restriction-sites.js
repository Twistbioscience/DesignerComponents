import reSiteDefinitions from '../re-site-definitions.json';
import {getComplementSequence} from './sequence';
import {getNamedColor} from './colors';
import {charMap} from '../constants';

const restrictionSiteDefinitions = reSiteDefinitions.reSitesDefList;
const popularReSiteDefinitions = restrictionSiteDefinitions.filter(site => site.subLists.includes('POPULAR'));

var wildcardsRegex = /[NURKMSWBDHVnurykmswbdhv]/;

let siteCountMap, siteDescriptorsMap;

export const detectRestrictionSites = (sequence, reSiteDefinitions) => {
  siteCountMap = {};
  siteDescriptorsMap = {};

  let results = [];
  let includeWildcards;

  let sequenceOffset = 30; // number of letters taken from end of the sequence and added to it's start to let detection of split sites

  if (sequence.length >= 30) {
    sequence = sequence.substring(sequence.length - 30) + sequence;
  } else {
    sequence += sequence;
    sequenceOffset = sequence.length;
  }

  const restrictionSitesList = reSiteDefinitions || popularReSiteDefinitions;
  const complementarySequence = getComplementSequence(sequence);

  // loop only the included list and find matches
  restrictionSitesList.forEach(siteDescriptor => {
    includeWildcards = isWildcardsIncluded(siteDescriptor.recognitionSequence);

    if (includeWildcards) {
      results = results.concat(
        findMatchesRegExp(sequence, siteDescriptor.recognitionSequence, siteDescriptor, sequenceOffset)
      );
    } else {
      results = results.concat(
        findMatches(sequence, complementarySequence, siteDescriptor.recognitionSequence, siteDescriptor, sequenceOffset)
      );
    }

    siteCountMap[siteDescriptor.name].sort(compareNumbers);
    siteDescriptorsMap[siteDescriptor.name] = siteDescriptor;
  });

  results.sort(sortSites);

  return results;
};

const isWildcardsIncluded = pattern => {
  var str = pattern.toUpperCase();
  return wildcardsRegex.test(str);
};

const clearWildcards = pattern => {
  return pattern.toUpperCase().replace(/[NURYKMSWBDHV]/g, '');
};

const replaceWildcards = pattern => {
  var str = pattern.toUpperCase();

  str = str
    .replace(/[N]/g, '[ATGC]')
    .replace(/[R]/g, '[AG]')
    .replace(/[Y]/g, '[CT]')
    .replace(/[K]/g, '[GT]')
    .replace(/[M]/g, '[AC]')
    .replace(/[S]/g, '[CG]')
    .replace(/[W]/g, '[AT]')
    .replace(/[B]/g, '[CGT]')
    .replace(/[D]/g, '[AGT]')
    .replace(/[H]/g, '[ACT]')
    .replace(/[V]/g, '[ACG]');

  return str;
};

const isPalindrome = recSite => {
  let tmp = getComplementSequence(recSite);
  tmp = tmp
    .split('')
    .reverse()
    .join('');
  return tmp === recSite;
};

const compareNumbers = (a, b) => {
  return a - b;
};

const sortSites = (a, b) => {
  if (a.startIndex - b.startIndex) {
    return a.startIndex - b.startIndex;
  } else if (a.name < b.name) {
    return -1;
  } else if (a.name > b.name) {
    return 1;
  }
  return 0;
};

const findMatchesRegExp = (sequence, pattern, siteDescriptor, sequenceOffset) => {
  siteCountMap[siteDescriptor.name] = siteCountMap[siteDescriptor.name] || [];

  const palindrome = isPalindrome(clearWildcards(pattern));

  let params = {
    pattern: pattern,
    sequence: sequence,
    siteDescriptor: siteDescriptor,
    offset: sequenceOffset,
    direction: 1,
    siteCountMap: siteCountMap[siteDescriptor.name]
  };

  let retVal = [];
  retVal = retVal.concat(findMatchesRegExpHelper(params));

  if (!palindrome) {
    // recognition pattern is non palindromic, so new search is conducted
    params.pattern = getReverseCompReSiteWithWildcards(pattern);
    params.direction = -1;
    retVal = retVal.concat(findMatchesRegExpHelper(params));
  }

  return retVal;
};

const getReverseCompReSiteWithWildcards = site => {
  var tempSequenceArr = [],
    char;
  for (var i = 0; i < site.length; i++) {
    char = site.charAt(i);
    if ('NURKMSWBDHVnurykmswbdhv'.indexOf(char) === -1) {
      tempSequenceArr.push(getComplementSequenceOneLetter(char));
    } else {
      tempSequenceArr.push(char);
    }
  }
  return tempSequenceArr.reverse().join('');
};

const getComplementSequenceOneLetter = char => {
  return charMap[char] || char;
};

const prepareRegExp = pattern => {
  const str = replaceWildcards(pattern);
  return new RegExp(str, 'gi'); // 'g' for finding all the matches (otherwise return only the first)
};

const getCorrectedIndex = (totalLength, index, correctionValue) => {
  const actualLength = totalLength - correctionValue;
  if (index - correctionValue < 0) {
    return actualLength - correctionValue + index;
  }
  if (index - correctionValue > actualLength) {
    return index - actualLength;
  }
  return index - correctionValue;
};

const createSiteLocationObject = (startIndex, seqLength, name, cutIndex3_5, overhang, direction) => {
  return {
    name: name,
    startIndex: startIndex,
    endIndex: startIndex + seqLength - 1,
    cutIndex3_5: parseInt(cutIndex3_5),
    overhang: parseInt(overhang),
    direction: direction,
    color: getNamedColor(name)
  };
};

const findMatches = (sequence, complementarySequence, pattern, siteDescriptor, sequenceOffset) => {
  const retVal = [];
  let index;
  const tmpDetectedSitesMap = {};

  siteCountMap[siteDescriptor.name] = siteCountMap[siteDescriptor.name] || [];

  let indexFound = sequence.indexOf(pattern); // first index
  while (indexFound > -1) {
    index = getCorrectedIndex(sequence.length, indexFound, sequenceOffset);
    if (!tmpDetectedSitesMap['' + index + pattern.length]) {
      retVal.push(
        createSiteLocationObject(
          index,
          pattern.length,
          siteDescriptor.name,
          siteDescriptor.cutIndex3_5,
          siteDescriptor.overhang,
          1
        )
      );
      siteCountMap[siteDescriptor.name].push(index);
      tmpDetectedSitesMap['' + index + pattern.length] = true;
    }
    indexFound = sequence.indexOf(pattern, indexFound + 1);
  }

  if (!isPalindrome(pattern)) {
    // recognition pattern is non palindromic, so new search is conducted
    const complementaryPattern = pattern
      .split('')
      .reverse()
      .join('');
    indexFound = complementarySequence.indexOf(complementaryPattern);
    while (indexFound > -1) {
      index = getCorrectedIndex(sequence.length, indexFound, sequenceOffset);
      if (!tmpDetectedSitesMap['' + index + pattern.length]) {
        retVal.push(
          createSiteLocationObject(
            index,
            pattern.length,
            siteDescriptor.name,
            siteDescriptor.cutIndex3_5,
            siteDescriptor.overhang,
            -1
          )
        );
        siteCountMap[siteDescriptor.name].push(index);
        tmpDetectedSitesMap['' + index + pattern.length] = true;
      }
      indexFound = complementarySequence.indexOf(complementaryPattern, indexFound + 1);
    }
  }

  return retVal;
};

const findMatchesRegExpHelper = params => {
  const retVal = [];
  let index;
  const tmpDetectedSitesMap = {};
  const regExp = prepareRegExp(params.pattern);
  let regExpResult = regExp.exec(params.sequence);
  while (regExpResult !== null) {
    index = getCorrectedIndex(params.sequence.length, regExpResult.index, params.offset);
    if (!tmpDetectedSitesMap['' + index + params.pattern.length]) {
      retVal.push(
        createSiteLocationObject(
          index,
          params.pattern.length,
          params.siteDescriptor.name,
          params.siteDescriptor.cutIndex3_5,
          params.siteDescriptor.overhang,
          params.direction
        )
      );
      params.siteCountMap.push(index);
      tmpDetectedSitesMap['' + index + params.pattern.length] = true;
    }
    regExpResult = regExp.exec(params.sequence);
  }
  return retVal;
};
