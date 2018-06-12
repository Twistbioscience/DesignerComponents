import React from "react";

const FORWARD = 'forward';
const REVERSE = 'reverse';

const strandToPathMap = {
    [FORWARD]: 'M 33,14 0,14 5,7  0,0  33,0  38,7 Z',
    [REVERSE]: 'M 0,7   5,0  38,0 33,7 38,14 5,14 Z'
};

const OrfShapeItem = ({x, y, color}) => (d) => <path fill={color}
                                              stroke="#bfbfbf"
                                              fillOpacity="0.1"
                                              d={d}
                                              transform={`translate(${x}, ${y})`}
                                        />;

const OrfShapeContainer = ({start, end, y, strand, color}) => {
    const numberOfShapesToDraw = Math.ceil((end - start) / 33);
    return [...Array(numberOfShapesToDraw).keys()].map(index => {
        const orfShapeItem = OrfShapeItem({x: (index * 33) + start, y, color});
        return orfShapeItem(strandToPathMap[strand]);
    })
};

export default OrfShapeContainer