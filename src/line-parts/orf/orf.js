import React from 'react';
import OrfShapeContainer from './orf-shape-container';
import {getOrfLayer} from '../../rendering/annotations';

const calculateOrfYPosition = (index, orfHeight, arr) => {
  const layersCount = getOrfLayer(arr, index);
  return layersCount * orfHeight;
};

/*
* brickType: 1 - brick with length 2
*            2 - brick with length 1
*            0 - brick with length 3
* */
const splitSequenceIntoChunks = (sequence, startIndex, endIndex, firstBrickType, lastBrickType) => {
  const translationEndIndex = lastBrickType === 1 ? endIndex + 1 : lastBrickType === 2 ? endIndex - 1 : endIndex;
  const translationStartIndex =
    firstBrickType === 2 ? startIndex + 1 : firstBrickType === 1 ? startIndex - 1 : startIndex;
  let seq = sequence.substring(translationStartIndex, translationEndIndex + 1);
  const chunks = [];
  while (seq) {
    const chunk = seq.substr(0, 3);
    chunks.push(chunk);
    seq = seq.substr(3);
  }

  return chunks;
};

const getBricksData = (orfs, charsPerRow, letterWidth, endIndex, orfLineHeight, sequence) =>
  orfs.map((orf, index, arr) => {
    const firstBrickType = getFirstBrickType(orf.orfStartIndex, orf.orfLineStart);
    const nextBrickIndex = firstBrickType + orf.orfLineStart;
    const restOfBricks = orf.orfLineEnd - nextBrickIndex;
    const fullBricks = Math.floor(restOfBricks / 3);
    const lastBrickType = 3 - ((orf.orfLineEnd + 1 - orf.orfStartIndex) % 3 || 3);
    const start = (orf.orfLineStart % charsPerRow) * letterWidth;
    const textChunks = splitSequenceIntoChunks(
      sequence,
      orf.orfLineStart,
      orf.orfLineEnd,
      firstBrickType,
      lastBrickType
    );
    return {
      ...orf,
      start,
      firstBrickType,
      lastBrickType,
      fullBricks,
      textChunks,
      y: calculateOrfYPosition(index, orfLineHeight, arr)
    };
  });

const getFirstBrickType = (orfStartIndex, lineOrfStartIndex) => {
  if (lineOrfStartIndex === orfStartIndex) {
    return 0;
  }
  return (lineOrfStartIndex - orfStartIndex) % 3;
};

const Orf = ({orfs, config, minusStrand, charsPerRow, letterWidth, endIndex, sequence}) => {
  const orfsBricksData = getBricksData(orfs, charsPerRow, letterWidth, endIndex, config.ORF_LINE_HEIGHT, sequence);
  const accumulatedHeight = config.BP_INDEX_HEIGHT + config.LETTER_HEIGHT_SEQUENCE * (minusStrand ? 2 : 1);
  return orfsBricksData.map(orfBrickData => (
    <svg y={accumulatedHeight}>
      <OrfShapeContainer {...orfBrickData} />
    </svg>
  ));
};

export default Orf;
