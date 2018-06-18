import React from 'react';
import {RIGHT_PADDING} from '../constants';

export const WithSelection = Component => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.onMouseDown = this.onMouseDown.bind(this);
      this.onMouseUp = this.onMouseUp.bind(this);
      this.state = {
        clickedIndex: null,
        selection: {},
        mouseDownIndex: 0
      };
    }

    getIndexFromEvent(e, index) {
      return Math.floor((e.clientX - RIGHT_PADDING) / this.props.config.OTHER_LETTERS_WIDTH) + index;
    }

    onMouseDown(e, index) {
      this.setState({mouseDownIndex: this.getIndexFromEvent(e, index)});
    }

    onMouseUp(e, index, endSelection) {
      const mouseUpIndex = this.getIndexFromEvent(e, index);
      const selection = {
        startIndex: Math.min(this.state.mouseDownIndex, mouseUpIndex),
        endIndex: Math.max(this.state.mouseDownIndex, mouseUpIndex)
      };
      this.setState({selection: selection});
      if (endSelection) {
        this.setState({mouseDownIndex: 0});
      }
    }

    render() {
      return <Component {...this.props} {...this.state} onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} />;
    }
  };
};
