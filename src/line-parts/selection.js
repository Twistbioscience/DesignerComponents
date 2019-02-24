// @flow
import React from 'react';
import {LINE_PADDING_TOP} from '../constants';
import type {RangeType} from '../types';

export const Selection = ({
  selectionRect,
  height,
  selection,
  startIndex,
  endIndex
}: {
  selectionRect: {x: number, wdt: number},
  height: number,
  selection: RangeType,
  startIndex: number,
  endIndex: number
}) => {
  return (
    <g>
      <rect
        x={selectionRect.x}
        y={LINE_PADDING_TOP}
        height={height}
        width={selectionRect.wdt}
        fill="rgba(0,0,0,0.05)"
      />
      {selection.startIndex > startIndex &&
        selection.startIndex < endIndex && <SelectionCaret height={height} pos={selectionRect.x} />}
      {selection.endIndex < endIndex &&
        selection.endIndex > startIndex && <SelectionCaret height={height} pos={selectionRect.x + selectionRect.wdt} />}
    </g>
  );
};

export const SelectionCaret = ({height, pos}) => {
  return (
    <g>
      <rect x={pos - 3} y={LINE_PADDING_TOP - 3} height="5" width="5" fill="0x111111" />
      <line
        x1={pos}
        x2={pos}
        y1={LINE_PADDING_TOP}
        y2={height - LINE_PADDING_TOP}
        shapeRendering="crispEdges"
        stroke="#000000"
        strokeWidth="1px"
      />
    </g>
  );
};
