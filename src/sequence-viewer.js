// This is where we will hold the external component API
import React from 'react';
import List from 'react-virtualized/dist/commonjs/List';
import {
  RIGHT_PADDING
} from './constants';
import {getRowHeight, rowRenderer} from './rendering/row';
import {css, cx} from 'react-emotion';


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


export default class SequenceViewer extends React.Component {
  render() {
    const rowHeightFunc = getRowHeight(this.props.charsPerRow, this.props.annotations, this.props.minusStrand, this.props.config);
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
            config: this.props.config
          })
        }>
      </List>
      { this.props.clickedIndex && <pre>{ this.props.clickedIndex }</pre>}
    </div>
  }

  constructor(props) {
    super(props);
    this.listRef = this.listRef.bind(this);
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