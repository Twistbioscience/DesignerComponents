// @flow
import React from 'react';
import LineBpIndex from './bp-index';
import Sequence from './line-sequence';
import {Selection, SelectionCaret} from './selection';
import Orf from '../line-parts/orf/orf';

const isStarterWithinLine = (start, end, starter) => starter <= end && starter >= start;
const isOrfWithinLine = (orf, start, end) => orf.location[0].start <= end && orf.location[0].end >= start;

export const getOrfPositionInLine = (lineStartIndex, lineEndIndex, orfs, charsPerRow, letterWidth) => {
  return orfs.filter(orf => isOrfWithinLine(orf, lineStartIndex, lineEndIndex)).map(orf => {
    const orfLineStart = Math.max(lineStartIndex, orf.location[0].start);
    const orfLineEnd = Math.min(lineEndIndex, orf.location[0].end);
    return {
      orfLineStart,
      orfLineEnd,
      start: (orfLineStart % charsPerRow) * letterWidth,
      end: (orfLineEnd % charsPerRow) * letterWidth,
      orfStartIndex: orf.location[0].start,
      strand: orf.strand,
      frame: orf.frame,
      starters: orf.starters
        .filter(starter => isStarterWithinLine(lineStartIndex, lineEndIndex, starter))
        .map(starter => (starter % (charsPerRow + 1)) * letterWidth)
    };
  });
};
import RestrictionSiteLabel from './resite-label';
import AnnotationMarker from './annotation-marker';
import {getLayers, filterAnnotations, getOrfsHeight} from '../rendering/annotations';
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

const isIndexInLine = (index: number, rowStart: number, rowEnd: number) => index >= rowStart && index <= rowEnd;
const getRect: (
  selection: RangeType,
  startIndex: number,
  endIndex: number,
  letterWidth: number
) => {x: number, wdt: number} = (selection, startIndex, endIndex, letterWidth) => {
  const startX = selection.startIndex > startIndex ? (selection.startIndex - startIndex) * letterWidth : 0;
  const endX =
    selection.endIndex < endIndex
      ? (selection.endIndex - startIndex) * letterWidth
      : (endIndex - startIndex) * letterWidth;

  return {x: startX, wdt: endX - startX};
};

class Line extends React.Component<Props> {
  constructor() {
    super();
    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onClick(index: number, charsPerRow: number, elementRange: RangeType) {
    return this.props.onClick
      ? (e: SyntheticEvent<>) => {
          e.stopPropagation();
          this.props.onClick(e, index * charsPerRow, elementRange);
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

  mouseDragHandler(index: number, charsPerRow: number) {
    return this.props.onDrag
      ? (e: SyntheticEvent<>) => {
          this.props.onDrag(e, index * charsPerRow);
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
            index={index}
            layerIndex={layerIndex}
            config={config}
            startIndex={startIndex}
            maxResiteLayer={maxResiteLayer}
            charsPerRow={charsPerRow}
            lineWidth={lineWidth}
            onClick={this.onClick(index, charsPerRow, {startIndex: site.startIndex, endIndex: site.endIndex})}
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
            onClick={this.onClick(index, charsPerRow, {
              startIndex: annotation.startIndex,
              endIndex: annotation.endIndex
            })}
          />
        );
      });
    });
    const orfsHeight = getOrfsHeight(startIndex, this.props.sequence, charsPerRow, this.props.orfs, config);

    const isCaret = typeof selection === 'number';
    const isSelection =
      selection !== null &&
      typeof selection === 'object' &&
      (isIndexInLine(selection.startIndex, startIndex, endIndex) ||
        isIndexInLine(selection.endIndex, startIndex, endIndex) ||
        (selection.startIndex <= startIndex && selection.endIndex >= endIndex));
    const selectionRect = isSelection && getRect(selection, startIndex, endIndex, config.LETTER_FULL_WIDTH_SEQUENCE);
    return (
      <svg
        style={style}
        onMouseDown={this.mouseDownHandler(index, charsPerRow)}
        // onDrag is in actual event, which we are hijacking, but the name makes sense for us
        onClick={this.onClick(index, charsPerRow)}
        onMouseMove={this.mouseDragHandler(index, charsPerRow)}
        onMouseUp={this.mouseUpHandler(index, charsPerRow, true, selectionInProgress)}>
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
        <Orf
          orfs={getOrfPositionInLine(
            startIndex,
            endIndex - 1,
            this.props.orfs,
            config.LETTER_FULL_WIDTH_SEQUENCE,
            config.LETTER_SPACING_SEQUENCE
          )}
          index={index}
          charsPerRow={charsPerRow}
          endIndex={endIndex - 1}
          letterWidth={config.LETTER_FULL_WIDTH_SEQUENCE}
          config={config}
          minusStrand={minusStrand}
          sequence={this.props.sequence}
          annotationsTopHeight={annotationsTopHeight}
          onClick={this.onClick}
        />
        <svg y={orfsHeight}>{annotationsBottom}</svg>

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
        {isCaret && (
          <SelectionCaret height={style.height} pos={(selection - startIndex) * config.LETTER_FULL_WIDTH_SEQUENCE} />
        )}
      </svg>
    );
  }
}

export default Line;
