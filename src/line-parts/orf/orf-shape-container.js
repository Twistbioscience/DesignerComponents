import React from "react";
/*
import {getOrfLayer} from "src/rendering/annotations";
*/

const FORWARD = 'forward';
const REVERSE = 'reverse';
const SHAPE_WIDTH = 33;


const strandToPathMap = {
    [FORWARD]: {
        full: 'M 33,14 0,14 5,7  0,0  33,0  38,7 Z',
        start: {
            '_2': 'M 0 0 0 2.8 2.4 2.8 2.4 5.6 0 5.6 0 8.4 2.4 8.4 2.4 11.2 0 11.2 2.4 11.2 0 11.2 0 14 11 14 16 7 11 0 Z',
            '_1': 'M 0 0 0 2.8 2.4 2.8 2.4 5.6 0 5.6 0 8.4 2.4 8.4 2.4 11.2 0 11.2 2.4 11.2 0 11.2 0 14 22 14 27 7 22 0 Z'
        },
        end: {
            '_2': 'M 0 0 16 0 16 2.8 13.6 2.8 13.6 5.6 16 5.6 16 8.4 13.6 8.4 13.6 11.2 16 11.2 16 14 0 14 5 7 Z',
            '_1': 'M 0 0 27 0 27 2.8 24.6 2.8 24.6 5.6 27 5.6 27 8.4 24.6 8.4 24.6 11.2 27 11.2 27 14 0 14 5 7 Z'
        }
    },
    [REVERSE]: {
        full: 'M 5,14 38,14 33,7 38,0 5,0 0,7 Z',
        start: {
            '_2': 'M 0 0 0 2.8 2.4 2.8 2.4 5.6 0 5.6 0 8.4 2.4 8.4 2.4 11.2 0 11.2 2.4 11.2 0 11.2 0 14 16 14 11 7 16 0 Z',
            '_1': 'M 0 0 0 2.8 2.4 2.8 2.4 5.6 0 5.6 0 8.4 2.4 8.4 2.4 11.2 0 11.2 2.4 11.2 0 11.2 0 14 27 14 22 7 27 0 Z'
        },
        end: {
            '_2': 'M 0 7 5 0 16 0 16 2.8 13.6 2.8 13.6 5.6 16 5.6 16 8.4 13.6 8.4 13.6 11.2 16 11.2 16 14 5 14 0 7 5 0 Z',
            '_1': 'M 0 7 5 0 26.9 0 26.9 2.8 24.6 2.8 24.6 5.6 26.9 5.6 26.9 8.4 24.6 8.4 24.6 11.2 26.9 11.2 26.9 14 5 14 0 7 5 0 Z',
        }
    }
};


const orfTypeWidthMap = {
    2: 11,
    1: 22,
    0: 33
};

/*
*     const layersCount = getOrfLayer(arr, index);
    return {
        ...orfChunk,
        y: layersCount * orfHeight
    };
*
* */
const OrfShapeItem = ({x, y, color, d}) => {
    return (
        <path fill={color}
              stroke="#bfbfbf"
              fillOpacity="0.1"
              d={d}
              transform={`translate(${x}, ${y})`}
        />)
};

const OrfShapeContainer = ({start, end, firstBrickType, lastBrickType, fullBricks, strand, color, orfIndex}) => {
    const orfHeight = 20;
    const firstBrick = {
        type: firstBrickType || null,
        position: 'start'
    };
    const lastBrick = {
        type: lastBrickType,
        position: 'end'
    };
    const fullBricksWithType = [...Array(fullBricks).keys()].map(() => ({
        type: 0
    }));

    const allBricks = [
        firstBrick,
        ...fullBricksWithType,
        lastBrick
    ];
    return allBricks.filter(brick => brick.type !== null)
        .reduce((acc, brick, index) => {
            const prevBrick = index > 0 ? acc[index - 1] : null;
            const x = prevBrick ? prevBrick.x + orfTypeWidthMap[prevBrick.type] : 0;
            return [
                ...acc,
                {...brick, x}
            ]
        }, [])
        .map((brick) => {
            // const layersCount = getOrfLayer(arr, index);
            return  <OrfShapeItem x={brick.x + start}
                                  y={orfHeight * orfIndex}
                                  d={(brick.position && brick.type) ? strandToPathMap[strand][brick.position][`_${brick.type}`] || 'no_d' : strandToPathMap[strand]['full']}
                                  color={color} />;
        });
};

export default OrfShapeContainer