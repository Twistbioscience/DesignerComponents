import React from 'react';
import {isValidDna} from 'utils/sequence';
import {includes} from 'utils/array';

const Button = ({children, style = {}, ...otherProps}) => (
  <button
    style={{
      cursor: 'pointer',
      width: 78,
      height: 30,
      lineHeight: '30px',
      fontSize: 14,
      borderRadius: 2,
      display: 'block',
      borderWidth: 1,
      textAlign: 'center',
      verticalAlign: 'middle',
      padding: 0,
      ...style
    }}
    {...otherProps}>
    {children}
  </button>
);

class SequenceInput extends React.Component {
  state = {
    tempSequence: ''
  };

  render() {
    return (
      <div
        style={{
          position: 'absolute',
          width: 300,
          height: 208,
          top: this.props.container.getBoundingClientRect().top,
          left: this.props.left,
          border: 'solid 1px #ABABAB',
          borderRadius: 3,
          backgroundColor: 'white',
          boxShadow: '0 2px 10px 1px rgba(48, 52, 56, 0.5)',
          textAlign: 'center',
          paddingTop: 20,
          paddingLeft: 20,
          paddingRight: 20,
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box'
        }}
        onMouseDown={e => {
          e.stopPropagation();
        }}
        onClick={e => {
          e.stopPropagation();
        }}>
        <textarea
          autoFocus={true}
          value={this.state.tempSequence}
          onInput={this.onInput}
          style={{height: 90, marginBottom: 10}}
        />
        {isValidDna(this.state.tempSequence) ? (
          <span>
            {this.state.tempSequence.length} bps will be insterted at location{' '}
            {(this.props.selection.startIndex || this.props.selection) + 1}
          </span>
        ) : (
          <span>Your sequence contains invalid chars</span>
        )}
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 20, width: 180, alignSelf: 'center'}}>
          <Button style={{backgroundColor: '#FFFFFF', color: '#313538'}} onClick={this.props.cancelHandler}>
            Cancel
          </Button>
          <Button
            style={{backgroundColor: '#7676f3', color: 'white', border: '1px solid #DDDDDD'}}
            disabled={!isValidDna(this.state.tempSequence)}
            onClick={this.onConfirmInput}>
            Insert
          </Button>
        </div>
      </div>
    );
  }

  onInput = e => {
    this.setState({tempSequence: e.target.value});
  };

  onConfirmInput = () => {
    this.props.okHandler({
      selection: this.props.selection,
      type: 'ADDITION',
      sequence: this.props.sequence,
      features: this.props.features,
      value: this.state.tempSequence
    });
  };
}

const START_INPUT_KEYS = ['a', 't', 'g', 'c', 'A', 'T', 'G', 'C'];
const KEY_BACKSPACE = 'Backspace';
const KEY_DELETE = 'Delete';
const KEY_ESCAPE = 'Escape';

function copyStringToClipboard(str) {
  // Create new element
  var el = document.createElement('textarea');
  // Set value (string to be copied)
  el.value = str;
  // Set non-editable to avoid focus and move outside of view
  el.setAttribute('readonly', '');
  el.style = {position: 'absolute', left: '-9999px'};
  document.body.appendChild(el);
  // Select text inside element
  el.select();
  // Copy text to clipboard
  document.execCommand('copy');
  // Remove temporary element
  document.body.removeChild(el);
}

const isPaste = e => e.key.toLowerCase() === 'v' && e.ctrlKey;

class SequenceInputWrapper extends React.Component {
  state = {
    showSequenceInput: false
  };

  render() {
    return (
      this.state.showSequenceInput && (
        <SequenceInput {...this.props} cancelHandler={this.toggleSequenceInput} okHandler={this.okHandler} />
      )
    );
  }

  toggleSequenceInput = () => {
    this.setState({showSequenceInput: !this.state.showSequenceInput});
  };

  okHandler = e => {
    this.props.onChange(e);
    this.toggleSequenceInput();
  };

  componentDidMount() {
    window.addEventListener('keydown', this.keyDownHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.keyDownHandler);
  }

  componentDidUpdate(prevProps) {
    window.removeEventListener('keydown', this.keyDownHandler);
    if (this.props.selection !== null) {
      window.addEventListener('keydown', this.keyDownHandler);
    }
    if (
      (prevProps.selection !== this.props.selection || prevProps.sequence !== this.props.sequence) &&
      this.state.showSequenceInput
    ) {
      this.setState({showSequenceInput: false});
    }
  }

  keyDownHandler = e => {
    if (
      e.key.toLowerCase() === 'c' &&
      e.ctrlKey &&
      this.props.selection !== null &&
      typeof this.props.selection === 'object'
    ) {
      copyStringToClipboard(
        this.props.sequence.substring(this.props.selection.startIndex, this.props.selection.endIndex)
      );
      return;
    }
    if ((includes(START_INPUT_KEYS, e.key) || isPaste(e)) && !this.state.showSequenceInput) {
      // Preperation for having change handlers with no popup
      if (this.props.inlineAddition) {
        this.props.onChange({
          selection: this.props.selection,
          type: 'ADDITION',
          sequence: this.props.sequence,
          features: this.props.features,
          value: isPaste(e) ? document.clipboardData.getData('Text') : e.key
        });
      } else {
        this.setState({showSequenceInput: true});
      }
    }
    if (e.key === KEY_ESCAPE && this.state.showSequenceInput) {
      this.setState({showSequenceInput: false});
    }
    if (e.key === KEY_BACKSPACE) {
      this.props.onChange({
        selection: this.props.selection,
        type: 'DELETE',
        sequence: this.props.sequence,
        features: this.props.features
      });
    }
    if (e.key === KEY_DELETE) {
      // Delete has a special case because it deletes the next char
      this.props.onChange({
        selection: typeof this.props.selection === 'number' ? this.props.selection + 1 : this.props.selection,
        type: 'DELETE',
        sequence: this.props.sequence,
        features: this.props.features
      });
    }
  };
}

export default SequenceInputWrapper;
