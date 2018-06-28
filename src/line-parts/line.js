// @flow
import React from 'react';
import LineBpIndex from './bp-index';
import Sequence from './line-sequence';
import Selection from './selection';
import RestrictionSiteLabel from './resite-label';
import AnnotationMarker from './annotation-marker';
import type {Config, Annotation, RestrictionSite, SelectionType} from '../types';

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

class Line extends React.Component<Props> {
  mouseDownHandler = (index: number, charsPerRow: number) => {
    return this.props.onMouseDown
      ? (e: SyntheticEvent<>) => {
          this.props.onMouseDown(e, index * charsPerRow);
        }
      : null;
  };

  mouseUpHandler = (index: number, charsPerRow: number, endSelection: boolean, selectionInProgress: boolean) => {
    return this.props.onMouseUp
      ? (e: SyntheticEvent<>) => {
          if (selectionInProgress) {
            this.props.onMouseUp(e, index * charsPerRow, endSelection);
          }
        }
      : null;
  };

  render() {
    const {
      charsPerRow,
      minusStrand,
      index,
      style,
      selection,
      selectionInProgress,
      annotations,
      config,
      restrictionSites,
      maxResiteLayer,
      annotationsTopHeight
    } = this.props;
    const startIndex = charsPerRow * index;
    const sequence = this.props.sequence.substr(startIndex, charsPerRow).toUpperCase();
    const endIndex = startIndex + sequence.length;
    const lineWidth = config.LETTER_FULL_WIDTH_SEQUENCE * charsPerRow;
    const filteredRestrictionSites = restrictionSites.filter(
      site =>
        (site.startIndex <= startIndex && site.endIndex >= startIndex) ||
        (site.startIndex >= startIndex && site.startIndex < startIndex + charsPerRow)
    );
    const annotationsTop = filteredRestrictionSites.map((site, index, arr) => {
      return (
        <RestrictionSiteLabel
          key={'resite-label-' + startIndex + '-' + site.name + '-' + site.startIndex}
          site={site}
          index={index}
          arr={arr}
          config={config}
          startIndex={startIndex}
          maxResiteLayer={maxResiteLayer}
          charsPerRow={charsPerRow}
          lineWidth={lineWidth}
        />
      );
    });
    const annotationsBottom = annotations
      .filter(
        annotation =>
          (annotation.startIndex < startIndex && annotation.endIndex > startIndex) ||
          (annotation.startIndex > startIndex && annotation.startIndex < startIndex + charsPerRow)
      )
      .map((annotation, index, arr) => {
        return (
          <AnnotationMarker
            key={'annotation-marker-' + annotation.name + '-' + annotation.startIndex}
            annotation={annotation}
            index={index}
            arr={arr}
            config={config}
            minusStrand={minusStrand}
            startIndex={startIndex}
            annotationsTopHeight={annotationsTopHeight}
          />
        );
      });

    const getRect: () => {x: number, wdt: number} = () => {
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

    const selectionRect = selection ? getRect() : {x: 0, wdt: 0};
    return (
      <svg
        style={style}
        onMouseDown={this.mouseDownHandler(index, charsPerRow)}
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
        {selectionRect.wdt > 0 && (
          <Selection
            height={style.height}
            selectionRect={selectionRect}
            selection={selection}
            startIndex={startIndex}
            endIndex={endIndex}
          />
        )}
      </svg>
    );
  }
}

export default Line;
