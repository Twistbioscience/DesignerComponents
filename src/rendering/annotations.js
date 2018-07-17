import {
  RESITE_LABEL_GAP,
  ANNOTATION_GAP,
  ANNOTATION_HEIGHT,
  ANNOTATION_PADDING_TOP,
  LINE_PADDING_TOP,
  LINE_PADDING_BOTTOM,
  MINUS_STRAND_MARGIN
} from '../constants';

// This function uses a greedy interval partitioning algorithm
export const getLayers = (annotations = []) => {
  var layers = {};
  if (annotations.length !== 0) {
    layers[0] = [annotations[0]];
    var numLayers = 1;
    annotations.slice(1, annotations.length).forEach(annotation => {
      var added = false;
      for (var layer in layers) {
        if (!overlapping(annotation, layers[layer])) {
          layers[layer].push(annotation);
          added = true;
          break;
        }
      }
      if (!added) {
        layers[numLayers] = [annotation];
        numLayers++;
      }
    });
  }
  return Object.values(layers);
};

const overlapping = (annotation, layerOfAnnotations) => {
  const overlapping = layerOfAnnotations.reduce(function(overlapping, currAnnotation) {
    const overlappingWithCurrent =
      annotation.startIndex <= currAnnotation.endIndex && annotation.endIndex >= currAnnotation.startIndex;
    return overlapping || overlappingWithCurrent;
  }, false);
  return overlapping;
};

export const filterAnnotations = (annotation, startIndex, charsPerRow) => {
  const showAnnotation =
    (annotation.startIndex <= startIndex && annotation.endIndex >= startIndex) ||
    (annotation.startIndex >= startIndex && annotation.startIndex < startIndex + charsPerRow);
  return showAnnotation;
};

export const getAnnotationsTopHeight = restrictionSites => {
  const numLayers = getLayers(restrictionSites).length;
  const annotationsTopHeight = LINE_PADDING_TOP + (1 + RESITE_LABEL_GAP) * (numLayers > 0 ? numLayers + 1 : 1);
  return annotationsTopHeight;
};

export const getSequenceHeight = (minusStrand, config) => {
  const sequenceHeight = minusStrand
    ? config.LETTER_HEIGHT_SEQUENCE * 2 + MINUS_STRAND_MARGIN
    : config.LETTER_HEIGHT_SEQUENCE;
  return sequenceHeight;
};

export const getAnnotationsBottomHeight = (annotations, startIndex, charsPerRow) => {
  const filteredAnnotations = annotations.filter(annotation => filterAnnotations(annotation, startIndex, charsPerRow));
  const layerCount = getLayers(filteredAnnotations).length;
  const annotationsBottomHeight =
    LINE_PADDING_BOTTOM + layerCount > 0
      ? layerCount * (ANNOTATION_GAP + ANNOTATION_HEIGHT) + ANNOTATION_PADDING_TOP
      : 0;
  return annotationsBottomHeight;
};
