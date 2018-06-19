import {
  ANNOTATION_HEIGHT,
  ANNOTATION_GAP,
  ANNOTATION_PADDING_TOP,
  MINUS_STRAND_MARGIN,
  LINE_PADDING_TOP,
  LINE_PADDING_BOTTOM
} from '../constants';

import Line from '../line-parts/line';
import {getAnnotationLayer} from './annotations';
import {getResiteLabelsContainerHeight} from './resite-labels';


export const rowRenderer = ({
  sequence,
  annotations,
  restrictionSites,
  charsPerRow,
  minusStrand,
  onMouseDown,
  onMouseUp,
  selection,
  selectionInProgress,
  config
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
      restrictionSites={restrictionSites}
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
    />
  );
};

export const getRowHeight = (charsPerRow, annotations = [], restrictionSites = [], showMinusStrand, config) => ({index}) => {
  const startIndex = charsPerRow * index;
  const layerCount = annotations
    .filter(
      annotation =>
        (annotation.startIndex < startIndex && annotation.endIndex > startIndex) ||
        (annotation.startIndex > startIndex && annotation.startIndex < startIndex + charsPerRow)
    )
    .reduce((layers, annotation, currIndex, arr) => {
      return Math.max(layers, getAnnotationLayer(arr, currIndex));
    }, 0);
  const resiteLabelsContainerHeight = getResiteLabelsContainerHeight(restrictionSites);
  const annotationContainerHeight =
    layerCount > 0 ? layerCount * (ANNOTATION_GAP + ANNOTATION_HEIGHT) + ANNOTATION_PADDING_TOP : 0;
  const sequenceHeight = showMinusStrand
    ? config.LETTER_HEIGHT_SEQUENCE * 2 + MINUS_STRAND_MARGIN
    : config.LETTER_HEIGHT_SEQUENCE;
  return resiteLabelsContainerHeight + sequenceHeight + annotationContainerHeight + LINE_PADDING_BOTTOM + LINE_PADDING_TOP + config.BP_INDEX_HEIGHT;
};
