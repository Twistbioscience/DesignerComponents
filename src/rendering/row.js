// @ flow
import React from 'react';
import Line from '../line-parts/line';
import {getSequenceHeight, getAnnotationsBottomHeight, getOrfsHeight} from './annotations';

export const rowRenderer = ({
  sequence,
  annotations,
  restrictionSites,
  maxResiteLayer,
  charsPerRow,
  minusStrand,
  onMouseDown,
  onMouseUp,
  onSequenceClick,
  selection,
  selectionInProgress,
  config,
  orfs,
  annotationsTopHeight,
  onDrag,
  showInputPopup
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
      annotationsTopHeight={annotationsTopHeight}
      maxResiteLayer={maxResiteLayer}
      style={style}
      charsPerRow={charsPerRow}
      minusStrand={minusStrand}
      key={key}
      index={index}
      onClick={onSequenceClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onDrag={onDrag}
      selection={selection}
      selectionInProgress={selectionInProgress}
      config={config}
      orfs={orfs}
      showInputPopup={showInputPopup}
    />
  );
};

export const getRowHeight = (
  charsPerRow,
  annotations = [],
  annotationsTopHeight,
  showMinusStrand,
  config,
  orfs,
  sequences
) => ({index}) => {
  const startIndex = charsPerRow * index;
  const annotationsBottomHeight = getAnnotationsBottomHeight(annotations, startIndex, charsPerRow);
  const sequenceHeight = getSequenceHeight(showMinusStrand, config);
  const orfsHeight = getOrfsHeight(startIndex, sequences, charsPerRow, orfs, config);
  return annotationsTopHeight + sequenceHeight + annotationsBottomHeight + orfsHeight + config.BP_INDEX_HEIGHT;
};
