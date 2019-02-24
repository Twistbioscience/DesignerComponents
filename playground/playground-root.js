import React, {Component} from 'react';
import sequenceEditorData from './data.json';
import orfs from './orfs.json';
import {detectOrfs} from '../src/utils/sequence';
import {hot} from 'react-hot-loader';
import {DesignerComponents /*, DesignerComponentsViewer*/, ReSiteDefinitions} from '../es/designer-components';
import Measurer from '../src/utils/measurer';

const getPopularReSiteDefinitions = reSiteDefinitions =>
  reSiteDefinitions.filter(site => site.subLists.includes('POPULAR'));

class App extends Component {
  render() {
    return (
      <div className="App">
        {this.state.show ? (
          <Measurer>
            {({width, x}) => (
              <div>
                <DesignerComponents
                  sequence={sequenceEditorData.text}
                  annotations={sequenceEditorData.annotations}
                  orfs={this.state.orfs}
                  minusStrand={this.state.minusStrand}
                  width={width}
                  left={x}
                  selectionHandler={this.selectionHandler}
                  selection={this.state.selection}
                  reSiteDefinitions={getPopularReSiteDefinitions(ReSiteDefinitions.reDefList)}
                />
                <button onClick={this.toggleMinusStrand}>Toggle minus strand</button>
              </div>
            )}
          </Measurer>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    );
  }

  constructor(props) {
    super(props);
    this.toggleMinusStrand = this.toggleMinusStrand.bind(this);
    this.selectionHandler = this.selectionHandler.bind(this);
    this.state = {
      show: false,
      orfs: [],
      annotations: [],
      minusStrand: false,
      selection: null
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
    this.setState({selection});
  }
}

export default hot(module)(App);
