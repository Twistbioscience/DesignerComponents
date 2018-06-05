// This is where we will hold the external component API
import React from 'react';
import List from 'react-virtualized/dist/commonjs/List';
import {
  ANNOTATION_HEIGHT,
  ANNOTATION_GAP,
  SCOLL_BAR_OFFSET,
  MINUS_STRAND_MARGIN,
  LINE_PADDING_TOP,
  LINE_PADDING_BOTTOM
} from './constants';
import Line from './line';
import { getAnnotationLayer } from './utils/rendering';
import FontsLoader from './utils/fonts-loader';
import { measureFontWidth } from './utils/rendering';
import {css, cx} from 'react-emotion';

const noSelection = css`
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: -moz-none;
    -o-user-select: none;
    user-select: none;
`;


const RIGHT_PADDING = 12;
const panel = css`
    padding-left: ${RIGHT_PADDING}px;
    -webkit-font-smoothing: antialiased;
`;

const config = {
  LETTER_WIDTH_SEQUENCE:0,
  LETTER_HEIGHT_SEQUENCE:0,
  LETTER_WIDTH_BP_INDEX_LABEL:0,
  LETTER_SPACING_SEQUENCE:0,
  LETTER_FULL_WIDTH_SEQUENCE:0,
  BP_INDEX_HEIGHT:0,
};

const rowRenderer = ({sequence, annotations, charsPerRow, minusStrand, onMouseDown, onMouseUp, selection, selectionInProgress }) => ({
  key,         // Unique key within array of rows
  index,       // Index of row within collection
  isScrolling, // The List is currently being scrolled
  isVisible,   // This row is visible within the List (eg it is not an overscanned row)
  style        // Style object to be applied to row (to position it)
}) => {
  return <Line  sequence={ sequence } annotations={ annotations } style={ style } charsPerRow={ charsPerRow }
  minusStrand={ minusStrand } key={ key } index={ index } onMouseDown={ onMouseDown } onMouseUp={onMouseUp}
  selection={selection} selectionInProgress={selectionInProgress} config={config} />
};

const getRowHeight = (charsPerRow, annotations = [], showMinusStrand) => ({ index }) => {
  const startIndex = charsPerRow*index;
  const layerCount = annotations
  .filter(
    annotation => (annotation.startIndex < startIndex && annotation.endIndex > startIndex) || (annotation.startIndex > startIndex && annotation.startIndex < startIndex + charsPerRow)
  )
  .reduce((layers, annotation, currIndex, arr) => {
    return Math.max(layers, getAnnotationLayer(arr, currIndex));
  }, 0);
  const annotationContainerHeight = layerCount > 0 ? ((layerCount + 1) * (ANNOTATION_GAP + ANNOTATION_HEIGHT)) : 0;
  const sequenceHeight = showMinusStrand ? config.LETTER_HEIGHT_SEQUENCE * 2 + MINUS_STRAND_MARGIN : config.LETTER_HEIGHT_SEQUENCE;
  return sequenceHeight + annotationContainerHeight + LINE_PADDING_BOTTOM + LINE_PADDING_TOP + config.BP_INDEX_HEIGHT;
}

export class SequenceViewer extends React.Component {
  render() {
    if (!this.state.showDesigner || !this.state.fontsLoaded) {
      return <FontsLoader callBack={this.onFontsLoaded} />
    }

    const rowHeightFunc = getRowHeight(this.state.charsPerRow, this.props.annotations, this.props.minusStrand);
    const selectionInProgress=  (this.state.mouseDownIndex > 0);
    return <div>
      <List
          ref={ this.listRef }
          className={cx(panel,noSelection)}
          rowCount={ this.state.rowCount }
          rowHeight={ rowHeightFunc }
          height={ 500 }
          width={ this.props.width }
          rowRenderer={
            rowRenderer({ 
              sequence: this.props.sequence,
              annotations: this.props.annotations,
              charsPerRow: this.state.charsPerRow,
              minusStrand: this.props.minusStrand,
              onMouseDown: this.onMouseDown,
              onMouseUp: this.onMouseUp,
              selection: this.state.selection,
              selectionInProgress:selectionInProgress,
              config: config
            })
          }>
      </List>
      { this.state.clickedIndex && <pre>{ this.state.clickedIndex }</pre>}
    </div>
  }

  constructor(props) {
    super(props);
    this.listRef = this.listRef.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onFontsLoaded = this.onFontsLoaded.bind(this);
    this.state = {
      showDesigner: false,
      clickedIndex: null,
      selection:{},
      mouseDownIndex: 0,
      fontsLoaded: false
    };
  }

  listRef(c) {
    if (c) {
      this.list = c;
    }
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.width !== this.props.width) {
      if (nextProps.width === 0) {
        this.setState({ showDesigner: false });
      } else {
        this.calculateStaticParams(nextProps);
      }
    }
    if (nextProps.minusStrand !== this.props.minusStrand) {
      if (this.list) {
        this.list.recomputeRowHeights();
      }
    }
  }

  onFontsLoaded() {
    this.setState({fontsLoaded:true});
    const fontSize = measureFontWidth('Inconsolata', '12pt');
    const letterSpacing = 3;
    config.LETTER_WIDTH_SEQUENCE = fontSize.width;
    config.LETTER_HEIGHT_SEQUENCE = fontSize.height;
    config.LETTER_WIDTH_BP_INDEX_LABEL = measureFontWidth('Droid Sans Mono', '7pt').width;
    config.LETTER_SPACING_SEQUENCE = letterSpacing; // this could be calculated from letter width
    config.LETTER_FULL_WIDTH_SEQUENCE = (fontSize.width + letterSpacing);
    config.BP_INDEX_HEIGHT = 25;   //calculate dynamically
    this.calculateStaticParams(this.props);
  }

  calculateStaticParams(props) {
    const charsPerRow = Math.floor((props.width-RIGHT_PADDING)/(config.LETTER_WIDTH_SEQUENCE + config.LETTER_SPACING_SEQUENCE)) - SCOLL_BAR_OFFSET;
    const rowCount = Math.ceil(props.sequence.length/charsPerRow);
    this.setState({
      charsPerRow,
      rowCount,
      showDesigner: true
    });
  }

  getIndexFromEvent(e, index) {
    return Math.floor((e.clientX-RIGHT_PADDING)/(config.LETTER_WIDTH_SEQUENCE + config.LETTER_SPACING_SEQUENCE)) + index;
  }

  onMouseDown(e, index) {
    this.setState({ mouseDownIndex: this.getIndexFromEvent(e, index) });
  }

  onMouseUp(e, index, endSelection) {
    const mouseUpIndex = this.getIndexFromEvent(e, index);
    const selection = {startIndex: Math.min(this.state.mouseDownIndex, mouseUpIndex), endIndex: Math.max(this.state.mouseDownIndex, mouseUpIndex)  };
    this.setState({ selection: selection});
    if(endSelection){
      this.setState({ mouseDownIndex: 0});
    }
  }
}