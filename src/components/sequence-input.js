import React from 'react';
import {isValidDna} from 'utils/sequence';

class SequenceInput extends React.Component {
  state = {
    sequence: ''
  };
  render() {
    return (
      <div
        style={{
          position: 'absolute',
          width: 300,
          height: 200,
          top: this.props.top,
          left: this.props.left,
          border: '1px solid black',
          backgroundColor: 'white',
          boxShadow: '0 2px 10px 1px rgba(48, 52, 56, 0.5)'
        }}
        onMouseDown={e => {
          e.stopPropagation();
        }}
        onClick={e => {
          e.stopPropagation();
        }}>
        <textarea autoFocus={true} value={this.state.sequence} onInput={this.onInput} />
        {isValidDna(this.state.sequence) ? (
          <span>
            You will add {this.state.sequence.length} chars at position{' '}
            {(this.props.selection.startIndex || this.props.selection) + 1}
          </span>
        ) : (
          <span>Your sequence contains invalid chars</span>
        )}
      </div>
    );
  }

  onInput = e => {
    this.setState({sequence: e.target.value});
  };
}

export default SequenceInput;
