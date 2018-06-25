import {
  LINE_PADDING_TOP,
  ANNOTATION_HEIGHT,
  ANNOTATION_GAP,
  ANNOTATION_PADDING_TOP,
  MINUS_STRAND_MARGIN
} from '../constants';
import {getAnnotationLayer} from '../rendering/annotations.js';

const AnnotationMarker = ({annotation, index, arr, config, minusStrand, startIndex, annotationsTopHeight}) => {
  const layer = getAnnotationLayer(arr, index);
  const width = (annotation.endIndex - annotation.startIndex) * config.LETTER_FULL_WIDTH_SEQUENCE;
  const x = (annotation.startIndex - startIndex) * config.LETTER_FULL_WIDTH_SEQUENCE;
  const y =
    annotationsTopHeight +
    config.LETTER_HEIGHT_SEQUENCE * (minusStrand ? 2 : 1) +
    (minusStrand ? MINUS_STRAND_MARGIN : 0) +
    layer * (ANNOTATION_HEIGHT + ANNOTATION_GAP) +
    LINE_PADDING_TOP +
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
