// @flow
// This is where we will hold the external component API
import React from 'react';
import List from 'react-virtualized/dist/commonjs/List';
import {LEFT_PADDING} from './constants';
import {getRowHeight, rowRenderer} from './rendering/row';
import {css, cx} from 'react-emotion';
import type {Config, Annotation, RestrictionSite, SelectionType} from './types';
import {detectRestrictionSites} from './utils/restriction-sites';
import {getLayers, getAnnotationsTopHeight} from './rendering/annotations';

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

export default class SequenceViewer extends React.Component<Props> {
  render() {
    const restrictionSites = detectRestrictionSites(this.props.sequence, this.props.reSiteDefinitions);
    const maxResiteLayer = getLayers(restrictionSites).length;
    const annotationsTopHeight = getAnnotationsTopHeight(restrictionSites);
    const rowHeightFunc = getRowHeight(
      this.props.charsPerRow,
      this.props.annotations,
      annotationsTopHeight,
      this.props.minusStrand,
      this.props.config
    );
    const selectionInProgress = this.props.mouseDownIndex > 0;
    const width = this.props.config.LETTER_FULL_WIDTH_SEQUENCE * this.props.charsPerRow + LEFT_PADDING;
    return (
      <div>
        <List
          ref={this.listRef}
          className={cx(panel, noSelection)}
          rowCount={this.props.rowCount}
          rowHeight={rowHeightFunc}
          height={500}
          width={width}
          rowRenderer={rowRenderer({
            sequence: this.props.sequence,
            annotations: this.props.annotations,
            restrictionSites: restrictionSites,
            maxResiteLayer: maxResiteLayer,
            charsPerRow: this.props.charsPerRow,
            minusStrand: this.props.minusStrand,
            onMouseDown: this.props.onMouseDown,
            onMouseUp: this.props.onMouseUp,
            selection: this.props.selection,
            selectionInProgress: selectionInProgress,
            config: this.props.config
          })}
        />
      </div>
    );
  }

  constructor(props: Props) {
    super(props);
    this.listRef = this.listRef.bind(this);
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
  }
}
