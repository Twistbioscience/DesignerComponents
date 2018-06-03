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



const rowRenderer = ({sequence, annotations, charsPerRow, minusStrand, onMouseDown }) => ({
  key,         // Unique key within array of rows
  index,       // Index of row within collection
  isScrolling, // The List is currently being scrolled
  isVisible,   // This row is visible within the List (eg it is not an overscanned row)
  style        // Style object to be applied to row (to position it)
}) => {
  return <Line sequence={ sequence } annotations={ annotations } style={ style } charsPerRow={ charsPerRow } minusStrand={ minusStrand } key={ key } index={ index } onMouseDown={ onMouseDown }/>
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
    if (!this.state.showDesigner) {
      return <div>Loading</div>;
    }

    const rowHeightFunc = getRowHeight(this.state.charsPerRow, this.props.annotations, this.props.minusStrand)
    return <div>
      <List
          ref={ this.listRef }
          className="list-container"
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
              onMouseDown: this.props.onMouseDown
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
    this.state = {
      showDesigner: false,
      clickedIndex: null
    };
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

  onMouseDown(e) {
    this.setState({ clickedIndex: Math.floor(e.clientX/LETTER_WIDTH) });
  }
}