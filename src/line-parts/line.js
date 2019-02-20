// @flow
import React from 'react';
import LineBpIndex from './bp-index';
import Sequence from './line-sequence';
import {Selection, SelectionCaret} from './selection';
import RestrictionSiteLabel from './resite-label';
import AnnotationMarker from './annotation-marker';
import {getLayers, filterAnnotations} from '../rendering/annotations';
import {map} from '../utils/array';
import type {Config, Annotation, RestrictionSite, SelectionType, RangeType} from '../types';

type Props = {
  charsPerRow: number,
  minusStrand: boolean,
  index: number,
  style: any,
  selection: SelectionType,
  selectionInProgress: boolean,
  sequence: string,
  config: Config,
  restrictionSites: Array<RestrictionSite>,
  maxResiteLayer: number,
  annotations: Array<Annotation>,
  annotationsTopHeight: number,
  onMouseDown: (e: SyntheticEvent<>, index: number) => void,
  onMouseUp: (e: SyntheticEvent<>, index: number, endSelection: boolean) => void
};

const indexInRow = (index: number, rowStart: number, rowEnd: number) => index >= rowStart && index <= rowEnd;

class Line extends React.Component<Props> {
  constructor() {
    super();
    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onClick(index: number, charsPerRow: number) {
    return this.props.onClick
      ? (e: SyntheticEvent<>) => {
          this.props.onClick(e, index * charsPerRow);
        }
      : null;
  }

  mouseDownHandler(index: number, charsPerRow: number) {
    return this.props.onMouseDown
      ? (e: SyntheticEvent<>) => {
          this.props.onMouseDown(e, index * charsPerRow);
        }
      : null;
  }

  mouseUpHandler(index: number, charsPerRow: number, endSelection: boolean, selectionInProgress: boolean) {
    return this.props.onMouseUp
      ? (e: SyntheticEvent<>) => {
          if (selectionInProgress) {
            this.props.onMouseUp(e, index * charsPerRow, endSelection);
          }
        }
      : null;
  }

  render() {
    const {
      charsPerRow,
      minusStrand,
      index,
      style,
      selection,
      selectionInProgress,
      config,
      restrictionSites,
      annotations,
      maxResiteLayer,
      annotationsTopHeight
    } = this.props;
    const startIndex = charsPerRow * index;
    const sequence = this.props.sequence.substr(startIndex, charsPerRow).toUpperCase();
    const endIndex = startIndex + sequence.length;
    const lineWidth = config.LETTER_FULL_WIDTH_SEQUENCE * charsPerRow;
    const filteredRestrictionSites = restrictionSites.filter(annotation =>
      filterAnnotations(annotation, startIndex, charsPerRow)
    );
    const annotationsTop = map(getLayers(filteredRestrictionSites), (layer, layerIndex) => {
      return map(layer, (site, siteIndex) => {
        return (
          <RestrictionSiteLabel
            key={'resite-label-' + layerIndex + '-' + site.name + '-' + siteIndex}
            site={site}
            layerIndex={layerIndex}
            config={config}
            startIndex={startIndex}
            maxResiteLayer={maxResiteLayer}
            charsPerRow={charsPerRow}
            lineWidth={lineWidth}
          />
        );
      });
    });
    const filteredAnnotations = annotations.filter(annotation =>
      filterAnnotations(annotation, startIndex, charsPerRow)
    );
    const annotationsBottom = map(getLayers(filteredAnnotations), (layer, layerIndex) => {
      return map(layer, (annotation, annotationIndex) => {
        return (
          <AnnotationMarker
            key={'annotation-marker-' + annotation.name + '-' + annotationIndex}
            annotation={annotation}
            index={index}
            layerIndex={layerIndex}
            annotationIndex={annotationIndex}
            config={config}
            minusStrand={minusStrand}
            lineStartIndex={startIndex}
            lineEndIndex={endIndex}
            annotationsTopHeight={annotationsTopHeight}
          />
        );
      });
    });

    const getRect: (selection: RangeType) => {x: number, wdt: number} = () => {
      const startX =
        selection.startIndex && selection.startIndex > startIndex
          ? (selection.startIndex - startIndex) * config.LETTER_FULL_WIDTH_SEQUENCE
          : 0;
      const endX = selection.endIndex
        ? selection.endIndex < endIndex
          ? (selection.endIndex - startIndex) * config.LETTER_FULL_WIDTH_SEQUENCE
          : (endIndex - startIndex) * config.LETTER_FULL_WIDTH_SEQUENCE
        : -1;
      return {x: startX, wdt: endX - startX};
    };

    const isCaret = typeof selection === 'number';
    const isSelection =
      selection !== null &&
      typeof selection === 'object' &&
      (indexInRow(selection.startIndex, startIndex, endIndex) ||
        indexInRow(selection.endIndex, startIndex, endIndex) ||
        (selection.startIndex <= startIndex && selection.endIndex >= endIndex));
    const selectionRect = isSelection && getRect();
    return (
      <svg
        style={style}
        onMouseDown={this.mouseDownHandler(index, charsPerRow)}
        onClick={this.onClick(index, charsPerRow)}
        onMouseUp={this.mouseUpHandler(index, charsPerRow, true, selectionInProgress)}
        onMouseMove={this.mouseUpHandler(index, charsPerRow, false, selectionInProgress)}>
        {annotationsTop}
        <Sequence
          sequence={sequence}
          minusStrand={minusStrand}
          config={config}
          startIndex={startIndex}
          endIndex={endIndex}
          charsPerRow={charsPerRow}
          annotationsTopHeight={annotationsTopHeight}
          restrictionSites={filteredRestrictionSites}
        />
        <LineBpIndex
          startIndex={startIndex + 1}
          endIndex={startIndex + sequence.length}
          stepSize={10}
          minusStrand={minusStrand}
          offset={startIndex === 1 ? 30 : 0}
          annotationsTopHeight={annotationsTopHeight}
          config={config}
        />
        {annotationsBottom}
        <rect height="2" y={style.height - 2} width={lineWidth} style={{fill: '#000000'}} />
        {isSelection && (
          <Selection
            height={style.height}
            selectionRect={selectionRect}
            selection={selection}
            startIndex={startIndex}
            endIndex={endIndex}
          />
        )}
        {isCaret && <SelectionCaret height={style.height} pos={startIndex} />}
      </svg>
    );
  }
}

export default Line;
