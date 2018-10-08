// @flow
import React from 'react';
import {ANNOTATION_HEIGHT, ANNOTATION_GAP, ANNOTATION_PADDING_TOP} from '../constants';
import {getSequenceHeight} from '../rendering/annotations.js';
import {measureFontWidth} from '../rendering/fonts';
import type {Config, Annotation} from '../types';

const AnnotationMarker = ({
  annotation,
  layerIndex,
  annotationIndex,
  config,
  minusStrand,
  lineStartIndex,
  lineEndIndex,
  annotationsTopHeight
}: {
  annotation: Annotation,
  layerIndex: number,
  annotationIndex: number,
  config: Config,
  minusStrand: boolean,
  lineStartIndex: number,
  lineEndIndex: number,
  annotationsTopHeight: number
}) => {
  const sequenceHeight = getSequenceHeight(minusStrand, config);
  const annotationLineStart = Math.max(annotation.startIndex, lineStartIndex);
  const annotationLineEnd = Math.min(annotation.endIndex, lineEndIndex);
  const width = (annotationLineEnd - annotationLineStart) * config.LETTER_FULL_WIDTH_SEQUENCE;
  const x = (annotationLineStart - lineStartIndex) * config.LETTER_FULL_WIDTH_SEQUENCE;
  const y =
    annotationsTopHeight +
    sequenceHeight +
    (layerIndex + 1) * (ANNOTATION_HEIGHT + ANNOTATION_GAP) +
    ANNOTATION_PADDING_TOP;
  const points = [
    //arrowheads on both edges, no teeth:
    x - 5 / 2 + 5,
    y,
    x + width - 5 / 2,
    y,
    x + width + 5 / 2,
    y + ANNOTATION_HEIGHT / 2,
    x + width - 5 / 2,
    y + ANNOTATION_HEIGHT,
    x - 5 / 2 + 5,
    y + ANNOTATION_HEIGHT,
    x + 5 / 2 + 5,
    y + ANNOTATION_HEIGHT / 2
  ].join(' ');
  const charWidth = measureFontWidth('Droid Sand Mono', '8pt', 'a').width;
  const annotationNameWidth = measureFontWidth('Droid Sand Mono', '8pt', annotation.name).width;
  const {annotationName, annotationPos} =
    annotationNameWidth > width + 26 /* For padding and arrowhead */
      ? {annotationName: `${annotation.name.substring(0, Math.floor(width / charWidth) - 5)}...`, annotationPos: 10}
      : {annotationName: annotation.name, annotationPos: (width - annotationNameWidth) / 2 + 7 /* for arrowhead */};
  return (
    <g key={`annotations-bottom-${layerIndex}-${annotationIndex}`}>
      <polygon
        key={`annotations-bottom-poly-${layerIndex}-${annotationIndex}`}
        points={points}
        x={x}
        y={y}
        fill={annotation.color || '#0000a4'}
        fillOpacity="0.3"
      />
      <text
        key={`annotations-bottom-text-${layerIndex}-${annotationIndex}`}
        x={x + annotationPos}
        y={y + ANNOTATION_HEIGHT / 2 + 3}
        fill="#FFFFFF"
        fontFamily="Droid Sans Mono"
        fontSize="8pt">
        {annotationName}
      </text>
    </g>
  );
};

export default AnnotationMarker;
