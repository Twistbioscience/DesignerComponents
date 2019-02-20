import React from 'react';
import {LEFT_PADDING} from '../constants';

export const WithSelection = Component => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.onMouseDown = this.onMouseDown.bind(this);
      this.onMouseUp = this.onMouseUp.bind(this);
      this.onSequenceClick = this.onSequenceClick.bind(this);
      this.state = {
        clickedIndex: null,
        mouseDownIndex: 0
      };
    }

    getIndexFromEvent(e, index) {
      return (
        Math.floor((e.clientX - LEFT_PADDING - this.props.left) / this.props.config.LETTER_FULL_WIDTH_SEQUENCE) + index
      );
    }

    onMouseDown(e, index) {
      this.setState({mouseDownIndex: this.getIndexFromEvent(e, index)});
    }

    onSequenceClick(e, index) {
      this.props.selectionHandler(this.getIndexFromEvent(e, index));
      this.setState({mouseDownIndex: null});
    }

    onMouseUp(e, index, endSelection) {
      const mouseUpIndex = this.getIndexFromEvent(e, index);
      const selection = {
        startIndex: Math.min(this.state.mouseDownIndex, mouseUpIndex),
        endIndex: Math.max(this.state.mouseDownIndex, mouseUpIndex)
      };
      this.props.selectionHandler(selection);
      if (endSelection) {
        this.setState({mouseDownIndex: null});
      }
    }

    render() {
      return (
        <Component
          {...this.props}
          {...this.state}
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          onSequenceClick={this.onSequenceClick}
        />
      );
    }
  };
};
