// @flow
// This is where we will hold the external component API
import React from 'react';
import List from 'react-virtualized/dist/commonjs/List';
import {LEFT_PADDING} from './constants';
import {getRowHeight, rowRenderer} from './rendering/row';
import {css, cx} from 'react-emotion';
import type {Config, Annotation, RestrictionSite, SelectionType} from './types';
import {detectRestrictionSites} from './utils/restriction-sites';
import {detectOrfs} from './utils/sequence';
import {getLayers, getAnnotationsTopHeight} from './rendering/annotations';
import KeyboardHandlerWrapper from './wrappers/keyboard-handler';
import SequenceInput from './components/sequence-input';

const noSelection = css`
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: -moz-none;
  -o-user-select: none;
  user-select: none;
`;

const panel = css`
  padding-left: ${LEFT_PADDING}px;
  -webkit-font-smoothing: antialiased;
`;

type Props = {
  charsPerRow: number,
  minusStrand: boolean,
  selection: SelectionType,
  selectionInProgress: boolean,
  sequence: string,
  config: Config,
  restrictionSites: Array<RestrictionSite>,
  annotations: Array<Annotation>,
  onMouseDown: (e: SyntheticEvent<>, index: number) => void,
  onMouseUp: (e: SyntheticEvent<>, index: number, endSelection: boolean) => void,
  mouseDownIndex: number,
  rowCount: number
};

class SequenceViewer extends React.Component<Props> {
  render() {
    const maxResiteLayer = getLayers(this.restrictionSites).length;
    const annotationsTopHeight = getAnnotationsTopHeight(this.restrictionSites);
    const rowHeightFunc = getRowHeight(
      this.props.charsPerRow,
      this.props.annotations,
      annotationsTopHeight,
      this.props.minusStrand,
      this.props.config,
      this.props.orfs,
      this.props.sequence
    );
    const width = this.props.config.LETTER_FULL_WIDTH_SEQUENCE * this.props.charsPerRow + LEFT_PADDING;
    return (
      <div
        style={{position: 'relative'}}
        onMouseDown={e => {
          this.setState({caretY: e.clientY});
        }}>
        <List
          ref={this.listRef}
          className={cx(panel, noSelection)}
          rowCount={this.props.rowCount}
          rowHeight={rowHeightFunc}
          height={this.props.height}
          width={width}
          rowRenderer={rowRenderer({
            sequence: this.props.sequence,
            annotations: this.props.annotations,
            restrictionSites: this.restrictionSites,
            maxResiteLayer: maxResiteLayer,
            charsPerRow: this.props.charsPerRow,
            minusStrand: this.props.minusStrand,
            onMouseDown: this.props.onMouseDown,
            onMouseUp: this.props.onMouseUp,
            onDrag: this.props.onDrag,
            onSequenceClick: this.props.onSequenceClick,
            selection: this.props.selection,
            config: this.props.config,
            orfs: this.props.orfs,
            mouseDownIndex: this.props.mouseDownIndex,
            selectionInProgress: this.props.selectionInProgress,
            annotationsTopHeight
          })}
        />
        {this.props.showInputPopup && (
          <SequenceInput
            selection={this.props.selection}
            sequence={this.props.sequence}
            features={this.props.annotations}
            top={this.state.caretY}
            left={(this.props.selection % this.props.charsPerRow) * this.props.config.LETTER_FULL_WIDTH_SEQUENCE}
            okHandler={this.props.onChange}
          />
        )}
      </div>
    );
  }

  constructor(props: Props) {
    super(props);
    this.listRef = this.listRef.bind(this);
    this.restrictionSites = this.props.reSiteDefinitions
      ? detectRestrictionSites(this.props.sequence, this.props.reSiteDefinitions)
      : [];
  }

  listRef(c) {
    if (c) {
      this.list = c;
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.minusStrand !== this.props.minusStrand) {
      if (this.list) {
        this.list.recomputeRowHeights();
      }
    }
    if (nextProps.sequence !== this.props.sequence && nextProps.reSiteDefinitions) {
      if (nextProps.reSiteDefinitions) {
        this.restrictionSites = detectRestrictionSites(nextProps.sequence, nextProps.reSiteDefinitions);
      }
    }
  }
}

SequenceViewer.defaultProps = {};

export default KeyboardHandlerWrapper(SequenceViewer);
