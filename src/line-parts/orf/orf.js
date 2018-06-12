import React from "react";
import OrfShapeContainer from "./orf-shape-container";
import {getOrfLayer} from "../../utils/rendering";


const colorsMap = {
    forward: 'red',
    reverse: 'blue'
}

const calculateLines = (orfChunk, index, orfHeight, arr) => {
    const layersCount = getOrfLayer(arr, index);
    return {
        start: orfChunk.start,
        end: orfChunk.end,
        y: layersCount * orfHeight,
        color: orfChunk.color,
        starters: orfChunk.starters,
        strand: orfChunk.strand
    };
};

const OrfLineChunks = ({chunk}) =>
        <g>
            <OrfShapeContainer start={chunk.start} end={chunk.end} y={chunk.y} strand={chunk.strand} color={chunk.color} />
{/*
            <line x1={chunk.start} y1={chunk.y} x2={chunk.end} y2={chunk.y} stroke={chunk.color}/>
*/}
{/*
            {
                chunk.starters.map(starter => <rect x={starter} y={chunk.y - 10} fill="blue" width="10" height="10"/>)
            }*/}
        </g>

const Orf = ({orfs, config, minusStrand}) => {
    const orfsPositions = orfs.map((orf, index, arr) => calculateLines(orf, index, config.ORF_LINE_HEIGHT, arr));
    return orfsPositions.map(orfPosition => (
        <svg y={config.BP_INDEX_HEIGHT + config.LETTER_HEIGHT_SEQUENCE * (minusStrand ? 2 : 1)}>
            <OrfLineChunks chunk={orfPosition}/>
        </svg>)
    )
};


export default Orf;