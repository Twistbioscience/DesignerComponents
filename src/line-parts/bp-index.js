// @flow
import React from 'react';
import type {Config} from '../types';

//const someVal = 0;
const LineBpIndex = ({
  startIndex,
  endIndex,
  stepSize,
  minusStrand,
  config,
  annotationsTopHeight
}: {
  startIndex: number,
  endIndex: number,
  stepSize: number,
  minusStrand: boolean,
  config: Config,
  annotationsTopHeight: number
}) => {
  const markers = [
    /* <line
      x1={10 + 11 * (someVal - 0.25)}
      x2={10 + 11 * (someVal - 0.25)}
      y1={0}
      y2={30}
      stroke="#000000"
      strokeWidth="1px"
    /> */
  ];
  const firstMarker = Math.ceil(startIndex / stepSize) * stepSize;
  const lastMarker = Math.floor(endIndex / stepSize) * stepSize;
  for (let marker = firstMarker; marker <= lastMarker; marker += stepSize) {
    const offset = marker - startIndex;
    const pos = config.LETTER_FULL_WIDTH_SEQUENCE + (offset - 0.25) * config.LETTER_FULL_WIDTH_SEQUENCE;
    const lineStart = !minusStrand ? config.LETTER_HEIGHT_SEQUENCE + 5 : 2 * config.LETTER_HEIGHT_SEQUENCE + 5;
    const lineEnd = !minusStrand ? config.LETTER_HEIGHT_SEQUENCE + 10 : 2 * config.LETTER_HEIGHT_SEQUENCE + 10;
    const bpLabel = !minusStrand ? config.LETTER_HEIGHT_SEQUENCE + 20 : 2 * config.LETTER_HEIGHT_SEQUENCE + 20;
    markers.push(
      <line
        key={`bp-line-${marker}`}
        x1={pos}
        x2={pos}
        y1={lineStart + annotationsTopHeight}
        y2={lineEnd + annotationsTopHeight}
        shapeRendering="crispEdges"
        stroke="#000000"
        strokeWidth="1px"
      />
    );
    markers.push(
      <text
        key={`bp-index-marker-${marker}`}
        fontFamily="Droid Sans Mono"
        fontSize="7pt"
        fill="#4a4a4a"
        y={bpLabel + annotationsTopHeight}
        x={pos - (marker.toString().length * config.LETTER_WIDTH_BP_INDEX_LABEL) / 2}>
        {marker}
      </text>
    );
  }
  return <g height={20}>{markers}</g>;
};

export default LineBpIndex;
