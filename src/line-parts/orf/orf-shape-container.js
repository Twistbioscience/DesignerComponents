import React from 'react';

const FORWARD = 'forward';
const REVERSE = 'reverse';

const START = 'start';
const END = 'end';
const FULL = 'full';

const strandToPathMap = {
  [FORWARD]: {
    [FULL]: 'M 33,14 0,14 5,7  0,0  33,0  38,7 Z',
    [START]: {
      2: 'M 0 0 0 2.8 2.4 2.8 2.4 5.6 0 5.6 0 8.4 2.4 8.4 2.4 11.2 0 11.2 2.4 11.2 0 11.2 0 14 11 14 16 7 11 0 Z',
      1: 'M 0 0 0 2.8 2.4 2.8 2.4 5.6 0 5.6 0 8.4 2.4 8.4 2.4 11.2 0 11.2 2.4 11.2 0 11.2 0 14 22 14 27 7 22 0 Z'
    },
    [END]: {
      2: 'M 0 0 16 0 16 2.8 13.6 2.8 13.6 5.6 16 5.6 16 8.4 13.6 8.4 13.6 11.2 16 11.2 16 14 0 14 5 7 Z',
      1: 'M 0 0 27 0 27 2.8 24.6 2.8 24.6 5.6 27 5.6 27 8.4 24.6 8.4 24.6 11.2 27 11.2 27 14 0 14 5 7 Z'
    }
  },
  [REVERSE]: {
    [FULL]: 'M 5,14 38,14 33,7 38,0 5,0 0,7 Z',
    [START]: {
      2: 'M 0 0 0 2.8 2.4 2.8 2.4 5.6 0 5.6 0 8.4 2.4 8.4 2.4 11.2 0 11.2 2.4 11.2 0 11.2 0 14 16 14 11 7 16 0 Z',
      1: 'M 0 0 0 2.8 2.4 2.8 2.4 5.6 0 5.6 0 8.4 2.4 8.4 2.4 11.2 0 11.2 2.4 11.2 0 11.2 0 14 27 14 22 7 27 0 Z'
    },
    [END]: {
      2: 'M 0 7 5 0 16 0 16 2.8 13.6 2.8 13.6 5.6 16 5.6 16 8.4 13.6 8.4 13.6 11.2 16 11.2 16 14 5 14 0 7 5 0 Z',
      1: 'M 0 7 5 0 26.9 0 26.9 2.8 24.6 2.8 24.6 5.6 26.9 5.6 26.9 8.4 24.6 8.4 24.6 11.2 26.9 11.2 26.9 14 5 14 0 7 5 0 Z'
    }
  }
};

const orfTypeWidthMap = {
  2: 11,
  1: 22,
  0: 33
};
const OrfShapeItem = ({x, y, color, d}) => {
  return <path fill={color} stroke="#bfbfbf" fillOpacity="0.1" d={d} transform={`translate(${x}, ${y})`} />;
};

const translationTable = {
  AAG: 'K',
  ATG: 'K'
};

const aaLetterStartPosition = {
  2: '26px',
  1: '9px'
};
const AALetters = ({textChunks, x, y, firstBrickType, lastBrickType}) => {
  return (
    <text x={x} y={y + 12} fontFamily="Inconsolata" fontSize="16px">
      {textChunks.map((chunk, index) => (
        <tspan dx={index > 0 ? '25px' : aaLetterStartPosition[firstBrickType] || '16px'}>
          {translationTable[chunk] || 'K'}
        </tspan>
      ))}
    </text>
  );
};

const getBrickWithXPosition = (acc, brick, index) => {
  const prevBrick = index > 0 ? acc[index - 1] : null;
  const x = prevBrick ? prevBrick.x + orfTypeWidthMap[prevBrick.type] : 0;
  return [...acc, {...brick, x}];
};

const OrfShapeContainer = ({start, firstBrickType, lastBrickType, fullBricks, strand, color, y, textChunks}) => {
  const firstBrick = {
    type: firstBrickType || null,
    position: START
  };
  const lastBrick = {
    type: lastBrickType,
    position: END
  };
  const fullBricksWithType = [...Array(fullBricks).keys()].map(() => ({
    type: 0
  }));

  const allBricks = [firstBrick, ...fullBricksWithType, lastBrick];
  const bricks = allBricks
    .filter(brick => brick.type !== null)
    .reduce(getBrickWithXPosition, [])
    .map(brick => (
      <OrfShapeItem
        x={brick.x + start}
        y={y}
        d={
          brick.position && brick.type
            ? strandToPathMap[strand][brick.position][brick.type] || 'no_d'
            : strandToPathMap[strand][FULL]
        }
        color={color}
      />
    ));
  return (
    <g>
      {bricks}
      <AALetters
        textChunks={textChunks}
        x={start}
        y={y}
        firstBrickType={firstBrickType}
        lastBrickType={lastBrickType}
      />
    </g>
  );
};

export default OrfShapeContainer;
