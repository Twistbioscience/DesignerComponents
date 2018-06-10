// This is where we will hold the external component API
import React from 'react';
import List from 'react-virtualized/dist/commonjs/List';
import {
  ANNOTATION_HEIGHT,
  ANNOTATION_GAP,
  ANNOTATION_PADDING_TOP,
  MINUS_STRAND_MARGIN,
  LINE_PADDING_TOP,
  LINE_PADDING_BOTTOM,
  RIGHT_PADDING
} from './constants';
import Line from './line';
import { getAnnotationLayer } from './utils/rendering';
import {css, cx} from 'react-emotion';
import {getOrfPositionInLine} from "./line";

const noSelection = css`
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: -moz-none;
    -o-user-select: none;
    user-select: none;
`;

const panel = css`
    padding-left: ${RIGHT_PADDING}px;
    -webkit-font-smoothing: antialiased;
`;

const rowRenderer = ({sequence, annotations, charsPerRow, minusStrand, onMouseDown, onMouseUp, selection,
selectionInProgress, config, orfs }) => ({
       key,         // Unique key within array of rows
       index,       // Index of row within collection
       isScrolling, // The List is currently being scrolled
       isVisible,   // This row is visible within the List (eg it is not an overscanned row)
       style        // Style object to be applied to row (to position it)
     }) => {
  return <Line  sequence={ sequence } annotations={ annotations } style={ style } charsPerRow={ charsPerRow }
                minusStrand={ minusStrand } key={ key } index={ index } onMouseDown={ onMouseDown } onMouseUp={onMouseUp}
                selection={selection} selectionInProgress={selectionInProgress} config={config} orfs={orfs} />
};

const getRowHeight = (charsPerRow = 169, annotations = [], showMinusStrand, config, orfs, sequence) => ({ index }) => {
  const startIndex = charsPerRow*index;
  const seqLength = sequence.substr(startIndex, charsPerRow).length;
  const endIndex = startIndex + seqLength;
  const orfsPerLine = getOrfPositionInLine(startIndex, endIndex, orfs, charsPerRow, config.LETTER_FULL_WIDTH_SEQUENCE, config.LETTER_SPACING_SEQUENCE);
  const layerCount = annotations
    .filter(
      annotation => (annotation.startIndex < startIndex && annotation.endIndex > startIndex) || (annotation.startIndex > startIndex && annotation.startIndex < startIndex + charsPerRow)
    )
    .reduce((layers, annotation, currIndex, arr) => {
      return Math.max(layers, getAnnotationLayer(arr, currIndex));
    }, 0);
  const annotationContainerHeight = layerCount > 0 ? ((layerCount) * (ANNOTATION_GAP + ANNOTATION_HEIGHT))+ ANNOTATION_PADDING_TOP : 0;
  const sequenceHeight = showMinusStrand ? config.LETTER_HEIGHT_SEQUENCE * 2 + MINUS_STRAND_MARGIN : config.LETTER_HEIGHT_SEQUENCE;
  const orfsHeight = (Object.keys(orfsPerLine).length * config.ORF_LINE_HEIGHT) + config.ORF_LINE_HEIGHT;
  return sequenceHeight + annotationContainerHeight + LINE_PADDING_BOTTOM + LINE_PADDING_TOP + config.BP_INDEX_HEIGHT + orfsHeight;
};


export default class SequenceViewer extends React.Component {
  render() {
    const rowHeightFunc = getRowHeight(this.state.charsPerRow, this.props.annotations, this.props.minusStrand, this.props.config, this.props.orfs, this.props.sequence);
    const selectionInProgress=  (this.props.mouseDownIndex > 0);

    return <div>
      <List
        ref={ this.listRef }
        className={cx(panel,noSelection)}
        rowCount={ this.props.rowCount }
        rowHeight={ rowHeightFunc }
        height={ 500 }
        width={ this.props.width }
        rowRenderer={
          rowRenderer({
            sequence: this.props.sequence,
            annotations: this.props.annotations,
            charsPerRow: this.props.charsPerRow,
            minusStrand: this.props.minusStrand,
            onMouseDown: this.props.onMouseDown,
            onMouseUp: this.props.onMouseUp,
            selection: this.props.selection,
            selectionInProgress:selectionInProgress,
            config: this.props.config,
            orfs: this.props.orfs
          })
        }>
      </List>
      { this.state.clickedIndex && <pre>{ this.state.clickedIndex }</pre>}
    </div>
  }

  constructor(props) {
    super(props);
    this.listRef = this.listRef.bind(this);
    this.state = {
      showDesigner: false,
      fontsLoaded: false
    };
  }

  listRef(c) {
    if (c) {
      this.list = c;
    }
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.minusStrand !== this.props.minusStrand) {
      if (this.list) {
        this.list.recomputeRowHeights();
      }
    }
  }

}