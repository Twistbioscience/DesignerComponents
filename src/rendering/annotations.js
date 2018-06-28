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

import type {Annotation, RestrictionSite, Config} from '../types.js';

const getLayerCount = checkOverlap => (annotations: Array<any> = [], index: number) =>
  annotations
    .slice(0, index)
    .map((annotation, i) => Object.assign({}, annotation, {layer: getLayerCount(checkOverlap)(annotations, i)}))
    .filter(annotation => checkOverlap(annotations[index], annotation))
    .sort((a, b) => {
      if (a.layer < b.layer) {
        return -1;
      }
      if (b.layer < a.layer) {
        return 1;
      }
      return 0;
    })
    .reduce((curr, prev) => (prev.layer === curr ? prev.layer + 1 : curr), 1);

export const getAnnotationLayer = getLayerCount((curr, prev) => curr.startIndex < prev.endIndex);
export const getResiteLayer = getLayerCount((curr, prev) => curr.startIndex < prev.endIndex);
export const getOrfLayer = getLayerCount((curr, prev) => curr.orfLineStart < prev.orfLineEnd);

export const getAnnotationsTopHeight = (restrictionSites: Array<RestrictionSite>) => {
  const resiteLabelLayers = restrictionSites.map((site, index) => {
    return getResiteLayer(restrictionSites, index);
  });
  const mostLayers = Math.max(...resiteLabelLayers);
  const annotationsTopHeight = LINE_PADDING_TOP + (1 + RESITE_LABEL_GAP) * (mostLayers > 0 ? mostLayers + 1 : 1);
  return annotationsTopHeight;
};

export const getSequenceHeight = (minusStrand: boolean, config: Config) => {
  const sequenceHeight = minusStrand
    ? config.LETTER_HEIGHT_SEQUENCE * 2 + MINUS_STRAND_MARGIN
    : config.LETTER_HEIGHT_SEQUENCE;
  return sequenceHeight;
};

export const getAnnotationsBottomHeight = (annotations: Array<Annotation>, startIndex: number, charsPerRow: number) => {
  const layerCount = annotations
    .filter(
      annotation =>
        (annotation.startIndex < startIndex && annotation.endIndex > startIndex) ||
        (annotation.startIndex > startIndex && annotation.startIndex < startIndex + charsPerRow)
    )
    .reduce((layers, annotation, currIndex, arr) => {
      return Math.max(layers, getAnnotationLayer(arr, currIndex));
    }, 0);
  const annotationsBottomHeight =
    LINE_PADDING_BOTTOM + layerCount > 0
      ? layerCount * (ANNOTATION_GAP + ANNOTATION_HEIGHT) + ANNOTATION_PADDING_TOP
      : 0;
  return annotationsBottomHeight;
};
