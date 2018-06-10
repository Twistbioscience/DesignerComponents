import React from "react";
import OrfShapeContainer from "./orf-shape-container";


const colorsMap = {
    forward: 'red',
    reverse: 'blue'
}

const calculateLines = (orfChunks, y, orfHeight) => {
    return orfChunks.map(chunk => ({
        start: chunk.start,
        end: chunk.end,
        y: y * orfHeight,
        color: chunk.color,
        starters: chunk.starters,
        strand: chunk.strand
    }));
};

const OrfLineChunks = ({chunks}) =>
    chunks.map(chunk =>
        <g>
            <OrfShapeContainer start={chunk.start} end={chunk.end} y={chunk.y} strand={chunk.strand} color={chunk.color} />
{/*            <line x1={chunk.start} y1={chunk.y} x2={chunk.end} y2={chunk.y} stroke={chunk.color}/>
            {
                chunk.starters.map(starter => <rect x={starter} y={chunk.y - 10} fill="blue" width="10" height="10"/>)
            }*/}
        </g>
    );

const Orf = ({orfs, config, minusStrand}) => {

    const orfsPositions = Object.values(orfs).map((orf, index) => calculateLines(orf, index + 1, config.ORF_LINE_HEIGHT));
    return orfsPositions.map(orfPosition => (
        <svg y={config.BP_INDEX_HEIGHT + config.LETTER_HEIGHT_SEQUENCE * (minusStrand ? 2 : 1)}>
            <OrfLineChunks chunks={orfPosition}/>
        </svg>)
    )
};


export default Orf;