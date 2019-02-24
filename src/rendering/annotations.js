import {getOrfPositionInLine} from '../line-parts/line';
// @flow
import {
  RESITE_LABEL_GAP,
  ANNOTATION_GAP,
  ANNOTATION_HEIGHT,
  ANNOTATION_PADDING_TOP,
  LINE_PADDING_TOP,
  LINE_PADDING_BOTTOM,
  MINUS_STRAND_MARGIN
} from '../constants';
import type {Annotation, RestrictionSite, Config} from '../types';

// This function uses a greedy interval partitioning algorithm
export const getLayers = (annotations: $ReadOnlyArray<Annotation>): Array<Array<Annotation>> => {
  const layers = [];
  if (annotations.length !== 0) {
    layers.push([annotations[0]]);
    annotations.slice(1, annotations.length).forEach(annotation => {
      let added = false;
      for (var i = 0; i < layers.length; i++) {
        if (!overlapping(annotation, layers[i])) {
          layers[i].push(annotation);
          added = true;
          break;
        }
      }
      if (!added) {
        layers.push([annotation]);
      }
    });
  }
  return layers;
};

const overlapping = (annotation: Annotation, layerOfAnnotations: Array<Annotation>): boolean => {
  const overlapping = layerOfAnnotations.reduce(function(overlapping, currAnnotation) {
    const overlappingWithCurrent =
      annotation.startIndex <= currAnnotation.endIndex && annotation.endIndex >= currAnnotation.startIndex;
    return overlapping || overlappingWithCurrent;
  }, false);
  return overlapping;
};

export const filterAnnotations = (annotation: Annotation, startIndex: number, charsPerRow: number): boolean => {
  const showAnnotation =
    (annotation.startIndex <= startIndex && annotation.endIndex >= startIndex) ||
    (annotation.startIndex >= startIndex && annotation.startIndex < startIndex + charsPerRow);
  return showAnnotation;
};

export const getAnnotationsTopHeight = (sites: Array<RestrictionSite>): number => {
  const numLayers = getLayers(sites).length;
  const annotationsTopHeight = LINE_PADDING_TOP + (1 + RESITE_LABEL_GAP) * (numLayers > 0 ? numLayers + 1 : 1);
  return annotationsTopHeight;
};

export const getSequenceHeight = (minusStrand: boolean, config: Config): number => {
  const sequenceHeight = minusStrand
    ? config.LETTER_HEIGHT_SEQUENCE * 2 + MINUS_STRAND_MARGIN
    : config.LETTER_HEIGHT_SEQUENCE;
  return sequenceHeight;
};

export const getAnnotationsBottomHeight = (
  annotations: Array<Annotation>,
  startIndex: number,
  charsPerRow: number
): number => {
  const filteredAnnotations = annotations.filter(annotation => filterAnnotations(annotation, startIndex, charsPerRow));
  const layerCount = getLayers(filteredAnnotations).length;
  const annotationsBottomHeight =
    LINE_PADDING_BOTTOM + layerCount > 0
      ? layerCount * (ANNOTATION_GAP + ANNOTATION_HEIGHT) + ANNOTATION_PADDING_TOP
      : 0;
  return annotationsBottomHeight;
};

export const getOrfsHeight = (startIndex, sequence, charsPerRow, orfs, config) => {
  const seqLength = sequence.substr(startIndex, charsPerRow).length;
  const endIndex = startIndex + seqLength;
  const orfsPerLine = getOrfPositionInLine(
    startIndex,
    endIndex,
    orfs,
    charsPerRow,
    config.LETTER_FULL_WIDTH_SEQUENCE,
    config.LETTER_SPACING_SEQUENCE
  );
  const transformedArray = orfsPerLine.map(item => ({startIndex: item.orfLineStart, endIndex: item.orfLineEnd}));

  const orfsLayersCount = getLayers(transformedArray).length;
  return orfsLayersCount ? orfsLayersCount * config.ORF_LINE_HEIGHT + config.ORF_LINE_HEIGHT : 0;
};
