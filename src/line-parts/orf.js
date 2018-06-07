import React from "react";

const calculateLines = (orfChunks, y) => {
    return orfChunks.map(chunk => ({
        start: chunk.start,
        end: chunk.end,
        y: y * 10,
        color: chunk.color,
        starters: chunk.starters
    }));
};

const OrfLineChunks = ({chunks}) =>
    chunks.map(chunk =>
    <g>
        <line x1={chunk.start} y1={chunk.y} x2={chunk.end} y2={chunk.y} stroke={chunk.color} />
        {
            chunk.starters.map(starter => <line x1={starter} y1={chunk.y - 10} x2={starter} y2={chunk.y + 10} stroke="blue"/>)
        }
    </g>
        );

const Orf = ({orfs}) => {
    const orfsPositions = Object.values(orfs).map((orf, index) => calculateLines(orf, index + 1));
    return orfsPositions.map(orfPosition => <OrfLineChunks chunks={orfPosition} />)
};


export default Orf;