import {
  ANNOTATION_HEIGHT,
  ANNOTATION_GAP,
  ANNOTATION_PADDING_TOP,
  MINUS_STRAND_MARGIN,
  LINE_PADDING_TOP,
  LINE_PADDING_BOTTOM
} from '../constants';

import Line from '../line-parts/line';
import {getAnnotationLayer, getOrfLayer} from './annotations';
import {getOrfPositionInLine} from '../line-parts/line';

export const rowRenderer = ({
  sequence,
  annotations,
  charsPerRow,
  minusStrand,
  onMouseDown,
  onMouseUp,
  selection,
  selectionInProgress,
  config,
  orfs
}) => ({
  key, // Unique key within array of rows
  index, // Index of row within collection
  // isScrolling, // The List is currently being scrolled
  // isVisible, // This row is visible within the List (eg it is not an overscanned row)
  style // Style object to be applied to row (to position it)
}) => {
  return (
    <Line
      sequence={sequence}
      annotations={annotations}
      style={style}
      charsPerRow={charsPerRow}
      minusStrand={minusStrand}
      key={key}
      index={index}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      selection={selection}
      selectionInProgress={selectionInProgress}
      config={config}
      orfs={orfs}
    />
  );
};

const getAnnotationsHeight = (annotations, startIndex, charsPerRow) => {
  const layerCount = annotations
    .filter(
      annotation =>
        (annotation.startIndex < startIndex && annotation.endIndex > startIndex) ||
        (annotation.startIndex > startIndex && annotation.startIndex < startIndex + charsPerRow)
    )
    .reduce((layers, annotation, currIndex, arr) => {
      return Math.max(layers, getAnnotationLayer(arr, currIndex));
    }, 0);
  return layerCount > 0 ? layerCount * (ANNOTATION_GAP + ANNOTATION_HEIGHT) + ANNOTATION_PADDING_TOP : 0;
};

const getOrfsHeight = (startIndex, sequence, charsPerRow, orfs, config) => {
  const seqLength = sequence.substr(startIndex, charsPerRow).length;
  const endIndex = startIndex + seqLength;
  const orfsPerLine = getOrfPositionInLine(
    startIndex,
    endIndex,
    orfs,
    charsPerRow,
    config.LETTER_FULL_WIDTH_SEQUENCE,
    config.LETTER_SPACING_SEQUENCE
  );
  const orfsLayersCount =
    orfsPerLine.length > 0 ? Math.max(...orfsPerLine.map((orf, index, arr) => getOrfLayer(arr, index))) : 0;
  return orfsLayersCount ? orfsLayersCount * config.ORF_LINE_HEIGHT + config.ORF_LINE_HEIGHT : 0;
};

const getSequenceHeight = (showMinusStrand, config) => {
  return showMinusStrand ? config.LETTER_HEIGHT_SEQUENCE * 2 + MINUS_STRAND_MARGIN : config.LETTER_HEIGHT_SEQUENCE;
};

export const getRowHeight = (charsPerRow, annotations = [], showMinusStrand, config, orfs, sequence) => ({index}) => {
  const startIndex = charsPerRow * index;

  const annotationContainerHeight = getAnnotationsHeight(annotations, startIndex, charsPerRow);
  const orfsHeight = getOrfsHeight(startIndex, sequence, charsPerRow, orfs, config);
  const sequenceHeight = getSequenceHeight(showMinusStrand, config);
  const extras = LINE_PADDING_BOTTOM + LINE_PADDING_TOP + config.BP_INDEX_HEIGHT;
  return sequenceHeight + annotationContainerHeight + orfsHeight + extras;
};
