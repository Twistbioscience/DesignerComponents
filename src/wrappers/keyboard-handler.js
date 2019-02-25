import React from 'react';
import {includes} from 'utils/array';

const START_INPUT_KEYS = ['a', 't', 'g', 'c', 'A', 'T', 'G', 'C'];
const KEY_BACKSPACE = 'Backspace';
const KEY_DELETE = 'Delete';
const KEY_ESCAPE = 'Escape';

const KeyboardHandlerWrapper = Comp => {
  return class KeyboardHandler extends React.Component {
    state = {
      showInputPopup: false
    };

    componentDidUpdate(prevProps) {
      window.removeEventListener('keydown', this.keyDownHandler);
      if (this.props.selection !== null) {
        window.addEventListener('keydown', this.keyDownHandler);
      }
      if (
        (prevProps.selection !== this.props.selection || prevProps.sequence !== this.props.sequence) &&
        this.state.showInputPopup
      ) {
        this.setState({showInputPopup: false});
      }
    }

    keyDownHandler = e => {
      if (includes(START_INPUT_KEYS, e.key) && !this.state.showInputPopup) {
        // Preperation for having change handlers with no popup
        if (this.props.inlineAddition) {
          this.props.onChange({
            selection: this.props.selection,
            type: 'ADDITION',
            sequence: this.props.sequence,
            features: this.props.annotations,
            value: e.key
          });
        } else {
          this.setState({showInputPopup: true});
        }
      }
      if (e.key === KEY_ESCAPE && this.state.showInputPopup) {
        this.setState({showInputPopup: false});
      }
      if (e.key === KEY_BACKSPACE) {
        this.props.onChange({
          selection: this.props.selection,
          type: 'DELETE',
          sequence: this.props.sequence,
          features: this.props.annotations
        });
      }
      if (e.key === KEY_DELETE) {
        // Delete has a special case because it deletes the next char
        this.props.onChange({
          selection: typeof this.props.selection === 'number' ? this.props.selection + 1 : this.props.selection,
          type: 'DELETE',
          sequence: this.props.sequence,
          features: this.props.annotations
        });
      }
    };

    render() {
      return <Comp {...this.props} showInputPopup={this.state.showInputPopup} />;
    }
  };
};

export default KeyboardHandlerWrapper;
