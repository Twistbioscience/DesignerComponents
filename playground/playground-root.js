import React, {Component} from 'react';
import sequenceEditorData from './data.json';
import {detectOrfs} from '../src/utils/sequence';
import {hot} from 'react-hot-loader';
import {DesignerComponentsViewer} from '../src/index';
import {DesignerComponents} from '../src/index';
import AutoSizer from '../src/utils/auto-sizer';

class App extends Component {
  render() {
    return (
      <div className="App">
        {this.state.show ? (
          <AutoSizer>
            {({width, x}) => (
              <div>
                <DesignerComponents
                  sequence={sequenceEditorData.text}
                  annotations={sequenceEditorData.annotations}
                  restrictionSites={ sequenceEditorData.restrictionSites }
                  orfs={this.state.orfs}
                  minusStrand={this.state.minusStrand}
                  width={width}
                  left={x}
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
      minusStrand: false
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
}

export default hot(module)(App);
