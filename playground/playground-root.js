import React, {Component} from 'react';
import sequenceEditorData from './data.json';
import {detectOrfs} from '../src/utils/sequence';
import {hot} from 'react-hot-loader';
import {
  DesignerComponents /*, DesignerComponentsViewer*/,
  reSiteDefinitions,
  Measurer,
  handleChangeEvent
} from '../src';
import './app.css';

const getPopularReSiteDefinitions = reSiteDefinitions =>
  reSiteDefinitions.filter(site => site.subLists.includes('POPULAR'));

class App extends Component {
  render() {
    return (
      <div className="App">
        {this.state.show ? (
          <Measurer>
            {({width, x, height}) => (
              <div>
                <DesignerComponents
                  sequence={this.state.sequence}
                  annotations={this.state.features}
                  orfs={[] || this.state.orfs}
                  minusStrand={this.state.minusStrand}
                  width={width}
                  height={height - 50}
                  left={x}
                  selectionHandler={this.selectionHandler}
                  selection={this.state.selection}
                  onChange={this.onChange}
                  reSiteDefinitions={getPopularReSiteDefinitions(reSiteDefinitions.reSitesDefList)}
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
    this.onChange = this.onChange.bind(this);
    this.state = {
      show: false,
      orfs: [],
      annotations: [],
      minusStrand: false,
      selection: null,
      sequence: sequenceEditorData.text,
      features: sequenceEditorData.annotations
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

  onChange(e) {
    const newData = handleChangeEvent(e);
    this.setState({
      sequence: newData.sequence,
      features: newData.features,
      selection: newData.selection,
      orfs:
        newData.sequence !== this.state.sequence
          ? detectOrfs({sequence: newData.sequence.toUpperCase()})
          : this.state.orfs
    });
  }
}

export default hot(module)(App);
