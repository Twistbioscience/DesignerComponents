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



const rowRenderer = (gene, charsPerRow, showMinusStrand) => ({
  key,         // Unique key within array of rows
  index,       // Index of row within collection
  isScrolling, // The List is currently being scrolled
  isVisible,   // This row is visible within the List (eg it is not an overscanned row)
  style        // Style object to be applied to row (to position it)
}) => {
  return <Line gene={ gene } style={ style } charsPerRow={ charsPerRow } showMinusStrand={ showMinusStrand } key={ key } index={ index }/>
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

    const rowHeightFunc = getRowHeight(this.state.charsPerRow, this.props.data.annotations, this.state.showMinusStrand)
    return <div>
      <List
          ref={ this.listRef }
          className="list-container"
          rowCount={ this.state.rowCount }
          rowHeight={ rowHeightFunc }
          height={ 500 }
          width={ this.props.width }
          rowRenderer={rowRenderer(this.props.data, this.state.charsPerRow, this.state.showMinusStrand)}>
          </List>
      <button onClick={ this.toggleMinusStrand }>Toggle minus strand</button>
    </div>
  }

  constructor(props) {
    super(props);
    this.setSvgHeight = this.setSvgHeight.bind(this);
    this.getTextElemArray = this.getTextElemArray.bind(this);
    this.toggleMinusStrand = this.toggleMinusStrand.bind(this);
    this.listRef = this.listRef.bind(this);
    this.state = {
      showDesigner: false,
      showMinusStrand: false
    };
  }

  listRef(c) {
    if (c) {
      this.list = c;
    }
  }

  toggleMinusStrand() {
    this.setState({ showMinusStrand: !this.state.showMinusStrand });
    if (this.list) {
      this.list.recomputeRowHeights();
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
  }

  calculateStaticParams(props) {
    const charsPerRow = Math.floor(props.width/LETTER_WIDTH) - SCOLL_BAR_OFFSET;
    const rowCount = Math.ceil(props.data.text.length/charsPerRow);
    this.setState({
      charsPerRow,
      rowCount,
      showDesigner: true
    });
  }

  getTextElemArray() {
    const res = [];
    for (let i = 0; i < this.state.rowCount; i++) {
      res.push(<text x="0" y={ (i * LETTER_HEIGHT) + LETTER_HEIGHT } fontFamily="monospace" fontSize="12pt">{ this.props.data.text.substr(this.state.charsPerRow*i, this.state.charsPerRow) }</text>)
    }
    return res;
  }

  setSvgHeight(c) {
    if (c) {
      c.setAttribute('height', `${this.state.rowCount*LETTER_HEIGHT}px`);
    }
  }
}