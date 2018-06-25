import {
  ANNOTATION_HEIGHT,
  ANNOTATION_GAP,
  ANNOTATION_PADDING_TOP,
} from '../constants';

import Line from '../line-parts/line';
import {getAnnotationLayer, getResiteLayer, getAnnotationsTopHeight, getSequenceHeight, getAnnotationsBottomHeight} from './annotations';

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
  const annotationsTopHeight = getAnnotationsTopHeight(restrictionSites);
  const maxResiteLayer = restrictionSites
    .map((site, index, arr) => {
      return getResiteLayer(arr, index);
    })
    .reduce((maxLayer, currentLayer) => {
      return Math.max(maxLayer, currentLayer);
    });
  return (
    <Line
      sequence={sequence}
      annotations={annotations}
      restrictionSites={restrictionSites}
      annotationsTopHeight={annotationsTopHeight}
      maxResiteLayer={maxResiteLayer}
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

export const getRowHeight = (charsPerRow, annotations = [], restrictionSites = [], showMinusStrand, config) => ({
  index
}) => {
  const startIndex = charsPerRow * index;
  const annotationsTopHeight = getAnnotationsTopHeight(restrictionSites);
  const annotationsBottomHeight = getAnnotationsBottomHeight(annotations, startIndex, charsPerRow);
  const sequenceHeight = getSequenceHeight(showMinusStrand, config);
  return (
    annotationsTopHeight +
    sequenceHeight +
    annotationsBottomHeight +
    config.BP_INDEX_HEIGHT
  );
};
