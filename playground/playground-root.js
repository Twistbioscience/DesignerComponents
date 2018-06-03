import React, { Component } from 'react';
import sequenceEditorData from './data.json';
import {SequenceViewer} from '../src/index';
import { detectOrfs } from '../src/utils/sequence';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import { hot } from 'react-hot-loader'

class App extends Component {
  render() {
    return (
      <div className="App">
      {
        this.state.show 
        ? <AutoSizer>
          {
            ({ width }) =>
            <SequenceViewer
                sequence={ sequenceEditorData.text }
                annotations={ sequenceEditorData.annotations }
                orfs={ this.state.orfs }
                width={ width } />
            
          }
        </AutoSizer>
        : <div>Loading...</div>
      }
      </div>
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      orfs: []
    };

  }
  componentWillMount() {
    setTimeout(() => {
      this.setState({ show:true })
    }, 0);
  }

  componentDidMount() {
    this.setState({ orfs: detectOrfs({ sequence: sequenceEditorData.text.toUpperCase() }) })
  }
}

export default hot(module)(App);


