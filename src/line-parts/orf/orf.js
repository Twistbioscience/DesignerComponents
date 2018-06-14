import React from "react";
import OrfShapeContainer from "./orf-shape-container";
import {getOrfLayer} from '../../rendering/annotations';


const strandToColorMap = {
    forward: 'red',
    reverse: 'blue'
};


const calculateLines = (orfChunk, index, orfHeight, arr) => {
    const layersCount = getOrfLayer(arr, index);
    return {
        ...orfChunk,
        y: layersCount * orfHeight
    };
};

const OrfLineChunks = ({chunk}) =>
    <g>
        <OrfShapeContainer {...chunk} />
        {/*
            <line x1={chunk.start} y1={chunk.y} x2={chunk.end} y2={chunk.y} stroke={chunk.color}/>
*/}
        {/*
            {
                chunk.starters.map(starter => <rect x={starter} y={chunk.y - 10} fill="blue" width="10" height="10"/>)
            }*/}
    </g>;


const Orf = ({orfs, config, minusStrand, charsPerRow, letterWidth}) => {
    const orfsBricksData = getBricksData(orfs, charsPerRow, letterWidth);
    const accumulatedHeight = config.BP_INDEX_HEIGHT + config.LETTER_HEIGHT_SEQUENCE * (minusStrand ? 2 : 1);

    return orfsBricksData.map((orfBrickData, index) => (
            <svg y={accumulatedHeight}>
                <OrfShapeContainer {...orfBrickData} orfIndex={index}/>
            </svg>
        )
    )
};

/*    const orfsPositions = orfs.map((orf, index, arr) => calculateLines(orf, index, config.ORF_LINE_HEIGHT, arr));
    const accumulatedHeight = config.BP_INDEX_HEIGHT + config.LETTER_HEIGHT_SEQUENCE * (minusStrand ? 2 : 1);
    return orfsPositions.map(orfPosition => (
        <svg y={accumulatedHeight}>
            <OrfLineChunks chunk={orfPosition}/>
        </svg>)
)*/


const getBricksData = (orfs, charsPerRow, letterWidth) => orfs.map(orf => {
    const firstBrickType = getFirstBrickType(orf.orfStartIndex, orf.orfLineStart);
    const nextBrickIndex = (firstBrickType + orf.orfLineStart);
    const restOfBricks = orf.orfLineEnd - nextBrickIndex;
    const fullBricks = Math.floor(restOfBricks / 3);
    const lastBrickType = firstBrickType === 0 ? 3 - (restOfBricks % 3) : ((orf.orfLineEnd - 1) - (firstBrickType + 3 * restOfBricks)) % 3;
    const start = (orf.orfLineStart % charsPerRow) * letterWidth;
    const end = ((orf.orfLineEnd - 1) % charsPerRow) * letterWidth;
    console.log({start});
    return {
        ...orf,
        start,
        end,
        firstBrickType,
        lastBrickType,
        fullBricks
    }
});

const getFirstBrickType = (orfStartIndex, lineOrfStartIndex) => {
    if (lineOrfStartIndex === orfStartIndex) {
        return 0;
    }
    return ((lineOrfStartIndex - orfStartIndex) % 3);
};


export default Orf;
// (orf.orfLineEnd - 1) - (2 + (167 * 3))