import React from "react";

const FORWARD = 'forward';
const REVERSE = 'reverse';
const SHAPE_WIDTH = 33;

const strandToPathMap = {
    [FORWARD]:{
        full: 'M 33,14 0,14 5,7  0,0  33,0  38,7 Z',
        start: {
            1: 'M 0 0 0 2.8 2.4 2.8 2.4 5.6 0 5.6 0 8.4 2.4 8.4 2.4 11.2 0 11.2 2.4 11.2 0 11.2 0 14 11 14 16 7 11 0 Z',
            2: 'M 0 0 0 2.8 2.4 2.8 2.4 5.6 0 5.6 0 8.4 2.4 8.4 2.4 11.2 0 11.2 2.4 11.2 0 11.2 0 14 22 14 27 7 22 0 Z'
        },
        end: {
            1: 'M 0 0 16 0 16 2.8 13.6 2.8 13.6 5.6 16 5.6 16 8.4 13.6 8.4 13.6 11.2 16 11.2 16 14 0 14 5 7 Z',
            2: 'M 0 0 27 0 27 2.8 24.6 2.8 24.6 5.6 27 5.6 27 8.4 24.6 8.4 24.6 11.2 27 11.2 27 14 0 14 5 7 Z'
        }
    },
    [REVERSE]: {
        full: 'M 5,14 38,14 33,7 38,0 5,0 0,7 Z',
        start: {
            1: 'M 0 0 0 2.8 2.4 2.8 2.4 5.6 0 5.6 0 8.4 2.4 8.4 2.4 11.2 0 11.2 2.4 11.2 0 11.2 0 14 16 14 11 7 16 0 Z',
            2: 'M 0 0 0 2.8 2.4 2.8 2.4 5.6 0 5.6 0 8.4 2.4 8.4 2.4 11.2 0 11.2 2.4 11.2 0 11.2 0 14 27 14 22 7 27 0 Z'
        },
        end: {
            1: 'M 0 7 5 0 16 0 16 2.8 13.6 2.8 13.6 5.6 16 5.6 16 8.4 13.6 8.4 13.6 11.2 16 11.2 16 14 5 14 0 7 5 0 Z',
            2: 'M 0 7 5 0 26.9 0 26.9 2.8 24.6 2.8 24.6 5.6 26.9 5.6 26.9 8.4 24.6 8.4 24.6 11.2 26.9 11.2 26.9 14 5 14 0 7 5 0 Z',
        }
    }
};


const OrfShapeItem = ({x, y, color}) => (d) => {
    return (
            <path fill={color}
                  stroke="#bfbfbf"
                  fillOpacity="0.1"
                  d={d}
                  transform={`translate(${x}, ${y})`}
            />)
};

const OrfShapeContainer = ({start, y, strand, color, numberOfFullShapesToDraw, incompleteShapeType, prevLineModulo}) => {

    const completeShapes = [...Array(numberOfFullShapesToDraw).keys()].map(index => {
        const orfShapeItem = OrfShapeItem({x: (index * SHAPE_WIDTH) + start, y, color});
        return orfShapeItem(strandToPathMap[strand]['full']);
    });
    const x = (completeShapes.length * SHAPE_WIDTH) + start;
    const incompleteShape = OrfShapeItem({x, y, color})(strandToPathMap[strand]['end'][incompleteShapeType || 3]);

    return [...completeShapes, incompleteShape]
};

export default OrfShapeContainer