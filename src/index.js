// This is where we will hold the external component API
import React from 'react';
import List from 'react-virtualized/dist/commonjs/List';
import {
  LETTER_WIDTH,
  LETTER_HEIGHT,
  ANNOTATION_HEIGHT,
  ANNOTATION_GAP,
  SCOLL_BAR_OFFSET,
  charMap
} from './constants';
import Line from './line';
import { getAnnotationLayer } from './utils/rendering';
import {css} from 'react-emotion';
import WebFont from 'webfontloader';


const noSelection = css`
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: -moz-none;
    -o-user-select: none;
    user-select: none;
`;

const rowRenderer = ({sequence, annotations, charsPerRow, minusStrand, onMouseDown, onMouseUp, selection, selectionInProgress }) => ({
  key,         // Unique key within array of rows
  index,       // Index of row within collection
  isScrolling, // The List is currently being scrolled
  isVisible,   // This row is visible within the List (eg it is not an overscanned row)
  style        // Style object to be applied to row (to position it)
}) => {
  return <Line sequence={ sequence } annotations={ annotations } style={ style } charsPerRow={ charsPerRow }
  minusStrand={ minusStrand } key={ key } index={ index } onMouseDown={ onMouseDown } onMouseUp={onMouseUp}
  selection={selection} selectionInProgress={selectionInProgress} />
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
  const sequenceHeight = showMinusStrand ? LETTER_HEIGHT * 2 : LETTER_HEIGHT;
  return sequenceHeight + annotationContainerHeight + 25;
}

export class SequenceViewer extends React.Component {
  render() {
    if (!this.state.showDesigner || !this.state.fontsLoaded) {
      return <div>Loading</div>;
    }

    const rowHeightFunc = getRowHeight(this.state.charsPerRow, this.props.annotations, this.props.minusStrand);
    const selectionInProgress=  (this.state.mouseDownIndex > 0)
    return <div>
      <List
          ref={ this.listRef }
          className={noSelection}
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
              selectionInProgress:selectionInProgress
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
    this.state = {
      showDesigner: false,
      clickedIndex: null,
      selection:{},
      mouseDownIndex: 0,
      fontsLoaded: false
    };
    this.loadFonts(()=>this.setState({fontsLoaded:true}));
  }


  loadFonts(callBack) {
    WebFont.load({
      google: {
        families: ['Inconsolata', 'Droid Sans Mono']
      },
      active: function() {
        console.info('*** DesignerComponentsController web fonts ready, initializing app');
        callBack()

      }
    })
  }

  listRef(c) {
    if (c) {
      this.list = c;
    }
  }

  componentDidMount() {
    if (this.props.width > 0) {
      this.calculateStaticParams(this.props);
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

  calculateStaticParams(props) {
    const charsPerRow = Math.floor(props.width/LETTER_WIDTH) - SCOLL_BAR_OFFSET;
    const rowCount = Math.ceil(props.sequence.length/charsPerRow);
    this.setState({
      charsPerRow,
      rowCount,
      showDesigner: true
    });
  }

  onMouseDown(e, index) {
    this.setState({ mouseDownIndex: Math.floor(e.clientX/LETTER_WIDTH) + index });
  }
  onMouseUp(e, index, endSelection) {
    const mouseUpIndex = Math.floor(e.clientX/LETTER_WIDTH) + index ;
    const selection = {startIndex: Math.min(this.state.mouseDownIndex, mouseUpIndex), endIndex: Math.max(this.state.mouseDownIndex, mouseUpIndex)  };
    this.setState({ selection: selection})
    if(endSelection){
      this.setState({ mouseDownIndex: 0});
    }
  }
}