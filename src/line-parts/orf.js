import React from "react";


const colorsMap = {
    forward: 'red',
    reverse: 'blue'
}

const calculateLines = (orfChunks, y) => {
    return orfChunks.map(chunk => ({
        start: chunk.start,
        end: chunk.end,
        y: y * 10,
        color: colorsMap[chunk.strand],
        starters: chunk.starters
    }));
};

const OrfLineChunks = ({chunks}) =>
    chunks.map(chunk =>
        <g>
            <line x1={chunk.start} y1={chunk.y} x2={chunk.end} y2={chunk.y} stroke={chunk.color}/>
            {
                chunk.starters.map(starter => <rect x={starter} y={chunk.y - 10} fill="blue" width="10" height="10"/>)
            }
        </g>
    );

const Orf = ({orfs, config, minusStrand}) => {
    const orfsPositions = Object.values(orfs).map((orf, index) => calculateLines(orf, index + 1));
    return orfsPositions.map(orfPosition => (
        <svg y={config.BP_INDEX_HEIGHT + config.LETTER_HEIGHT_SEQUENCE * (minusStrand ? 2 : 1)}>
            <OrfLineChunks chunks={orfPosition}/>
        </svg>)
    )
};


export default Orf;