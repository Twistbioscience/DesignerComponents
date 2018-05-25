import React, { Component } from 'react';
import sequenceEditorData from './data.json';
import {SequenceViewer} from '../src/index';
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
      show: false
    };

  }
  componentWillMount() {
    setTimeout(() => {
      this.setState({ show:true })
    }, 2000);
  }
}

export default hot(module)(App);


