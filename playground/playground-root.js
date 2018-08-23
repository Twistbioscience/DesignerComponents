import React, {Component} from 'react';
import sequenceEditorData from './data.json';
import {detectOrfs} from '../src/utils/sequence';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import {hot} from 'react-hot-loader';
import {DesignerComponentsViewer} from '../src/index';
import {DesignerComponents} from '../src/index';

class App extends Component {
  render() {
    return (
      <div className="App">
        {this.state.show ? (
          <AutoSizer>
            {({width}) => (
              <div>
                <DesignerComponents
                  sequence={sequenceEditorData.text}
                  annotations={sequenceEditorData.annotations}
                  orfs={this.state.orfs}
                  minusStrand={this.state.minusStrand}
                  selection={this.state.selection}
                  width={width}
                  selectionHandler={this.selectionHandler}
                />
                <button onClick={this.toggleMinusStrand}>Toggle minus strand</button>
              </div>
            )}
          </AutoSizer>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    );
  }

  constructor(props) {
    super(props);
    this.toggleMinusStrand = this.toggleMinusStrand.bind(this);
    this.state = {
      show: false,
      orfs: [],
      annotations: [],
      minusStrand: false,
      selection: {}
    };
  }
  componentWillMount() {
    setTimeout(() => {
      this.setState({show: true, orfs: detectOrfs({sequence: sequenceEditorData.text.toUpperCase()})});
    }, 0);
  }

  toggleMinusStrand() {
    this.setState({minusStrand: !this.state.minusStrand});
  }

  selectionHandler(selection) {
    this.setState({ selection });
  }
}

export default hot(module)(App);
