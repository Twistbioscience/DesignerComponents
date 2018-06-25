import {
  ANNOTATION_HEIGHT,
  ANNOTATION_GAP,
  ANNOTATION_PADDING_TOP,
} from '../constants';
import {getAnnotationLayer, getSequenceHeight} from '../rendering/annotations.js';

const AnnotationMarker = ({annotation, index, arr, config, minusStrand, startIndex, annotationsTopHeight}) => {
  const layer = getAnnotationLayer(arr, index);
  const sequenceHeight = getSequenceHeight(minusStrand, config);
  const width = (annotation.endIndex - annotation.startIndex) * config.LETTER_FULL_WIDTH_SEQUENCE;
  const x = (annotation.startIndex - startIndex) * config.LETTER_FULL_WIDTH_SEQUENCE;
  const y =
    annotationsTopHeight +
    sequenceHeight +
    layer * (ANNOTATION_HEIGHT + ANNOTATION_GAP) +
    ANNOTATION_PADDING_TOP;
  const points = [
    //arrowheads on both edges, no teeth:
    x - 5 / 2,
    y,
    x + width - 5 / 2,
    y,
    x + width + 5 / 2,
    y + ANNOTATION_HEIGHT / 2,
    x + width - 5 / 2,
    y + ANNOTATION_HEIGHT,
    x - 5 / 2,
    y + ANNOTATION_HEIGHT,
    x + 5 / 2,
    y + ANNOTATION_HEIGHT / 2
  ].join(' ');
  return (
    <g key={`annotations-bottom-${index}`}>
      <polygon
        key={`annotations-bottom-poly-${index}`}
        points={points}
        x={x}
        y={y}
        fill={annotation.color || '#0000a4'}
        fillOpacity="0.3"
      />
      <text
        key={`annotations-bottom-text-${index}`}
        x={x + width / 4}
        y={y + ANNOTATION_HEIGHT / 2 + 5}
        fontSize="12px">
        {annotation.name}
      </text>
    </g>
  );
};

export default AnnotationMarker;
