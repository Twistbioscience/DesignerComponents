import React from 'react';
import {LEFT_PADDING} from '../constants';

const CLICK_TIME = 500;

export const WithSelection = Component => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.onMouseDown = this.onMouseDown.bind(this);
      this.onMouseUp = this.onMouseUp.bind(this);
      this.onDrag = this.onDrag.bind(this);
      this.onSequenceClick = this.onSequenceClick.bind(this);
      this.mouseDownTime = null;
      this.state = {
        clickedIndex: null,
        mouseDownIndex: null,
        mouseUpIndex: null,
        selectionInProgress: false
      };
    }

    getIndexFromEvent(e, index) {
      return (
        Math.floor((e.clientX - LEFT_PADDING - this.props.left) / this.props.config.LETTER_FULL_WIDTH_SEQUENCE) + index
      );
    }

    onMouseDown(e, index) {
      this.mouseDownTime = new Date().getTime();
      this.setState({mouseDownIndex: this.getIndexFromEvent(e, index), selectionInProgress: true});
    }

    onDrag(e, index) {
      if (this.mouseDownTime !== null) {
        const currIndex = this.getIndexFromEvent(e, index);
        if (currIndex !== this.state.mouseUpIndex) {
          this.setState({mouseUpIndex: currIndex});
          this.props.selectionHandler({
            startIndex: Math.min(this.state.mouseDownIndex, currIndex),
            endIndex: Math.max(this.state.mouseDownIndex, currIndex)
          });
        }
      }
    }

    onSequenceClick(e, index, range) {
      // Have a time limit which longer than that is not a click
      const clickTime = new Date().getTime();
      if (clickTime - this.mouseDownTime > CLICK_TIME) {
        return;
      }
      if (range) {
        this.props.selectionHandler(range);
      } else {
        this.props.selectionHandler(this.getIndexFromEvent(e, index));
      }
      this.mouseDownTime = null;
      this.setState({mouseDownIndex: null, selectionInProgress: false});
    }

    onMouseUp(e, index, endSelection) {
      const upTime = new Date().getTime();
      if (upTime - this.mouseDownTime <= CLICK_TIME) {
        return;
      }
      const mouseUpIndex = this.getIndexFromEvent(e, index);
      const selection = {
        startIndex: Math.min(this.state.mouseDownIndex, mouseUpIndex),
        endIndex: Math.max(this.state.mouseDownIndex, mouseUpIndex)
      };
      this.props.selectionHandler(selection);
      if (endSelection) {
        this.mouseDownTime = null;
        this.setState({
          mouseDownIndex: null,
          mouseUpIndex: null,
          selectionInProgress: false,
          clickedIndex: null
        });
      }
    }

    render() {
      return (
        <Component
          {...this.props}
          {...this.state}
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          onDrag={this.onDrag}
          onSequenceClick={this.onSequenceClick}
        />
      );
    }
  };
};
