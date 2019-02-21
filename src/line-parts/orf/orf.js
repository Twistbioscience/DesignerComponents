import React from 'react';
import {getLayers} from '../../rendering/annotations';
import OrfShapeContainer from './orf-shape-container';

const calculateOrfYPosition = (level, orfHeight) => {
  return level * orfHeight;
};

/*
 * brickType: 1 - brick with length 2
 *            2 - brick with length 1
 *            0 - brick with length 3
 * */
const splitSequenceIntoChunks = (sequence, startIndex, endIndex, firstBrickType, lastBrickType) => {
  const translationEndIndex = lastBrickType === 1 ? endIndex - 1 : lastBrickType === 2 ? endIndex + 1 : endIndex;
  const translationStartIndex = firstBrickType === 1 ? startIndex + 1 : startIndex;
  let seq = sequence.substring(translationStartIndex, translationEndIndex + 1);
  const chunks = [];
  while (seq) {
    const chunk = seq.substr(0, 3);
    chunks.push(chunk);
    seq = seq.substr(3);
  }

  return chunks;
};

const getBricksData = (orfs, charsPerRow, letterWidth, endIndex, orfLineHeight, sequence) => {
  const transformedArray = orfs.map(orf => ({
    startIndex: orf.orfLineStart,
    endIndex: orf.orfLineEnd,
    ...orf
  }));
  const orfsLayers = getLayers(transformedArray);

  return orfsLayers
    .map((orfsLayer, level) => {
      return orfsLayer.map(orf => {
        const firstBrickType = getFirstBrickType(orf);
        const restBricksIndex = firstBrickType + orf.orfLineStart;
        const totalFullBricks = Math.floor((orf.orfLineEnd - restBricksIndex) / 3);
        const lastBrickType = getLastBrickType(orf.orfLineEnd, orf.orfLineStart, totalFullBricks, firstBrickType);
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
          totalFullBricks,
          textChunks,
          y: calculateOrfYPosition(level, orfLineHeight)
        };
      });
    })
    .reduce((a, b) => [...a, ...b]);
};
const getFirstBrickType = ({orfStartIndex, orfLineStart, orfLineEnd, strand}) =>
  ((strand === 'reverse' && orfLineStart !== orfStartIndex ? orfLineEnd : orfLineStart) - orfStartIndex) % 3;

const getLastBrickType = (lineEnd, lineStart, totalFullBricks, firstBrickType) =>
  // last brick can't be 0 (will render another full brick), return null
  lineEnd - (lineStart + firstBrickType + totalFullBricks * 3) || null;

const Orf = ({orfs, config, minusStrand, charsPerRow, letterWidth, endIndex, sequence, annotationsTopHeight}) => {
  const orfsBricksData = getBricksData(orfs, charsPerRow, letterWidth, endIndex, config.ORF_LINE_HEIGHT, sequence);
  const accumulatedHeight =
    annotationsTopHeight + config.BP_INDEX_HEIGHT + config.LETTER_HEIGHT_SEQUENCE * (minusStrand ? 2 : 1);
  return orfsBricksData.map(orfBrickData => (
    <svg y={accumulatedHeight} key={`${orfBrickData.startIndex}_${orfBrickData.endIndex}_${orfBrickData.orfStartIndex}`}>
      <OrfShapeContainer {...orfBrickData} />
    </svg>
  ));
};

export default Orf;
