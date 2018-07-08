import {
  RESITE_LABEL_GAP,
  ANNOTATION_GAP,
  ANNOTATION_HEIGHT,
  ANNOTATION_PADDING_TOP,
  LINE_PADDING_TOP,
  LINE_PADDING_BOTTOM,
  MINUS_STRAND_MARGIN
} from '../constants';

const getLayerCount = checkOverlap => (annotations = [], index) =>
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

export const getAnnotationLayer = getLayerCount((curr, prev) => curr.startIndex <= prev.endIndex);
export const getResiteLayer = getLayerCount((curr, prev) => curr.startIndex <= prev.endIndex);
export const getOrfLayer = getLayerCount((curr, prev) => curr.orfLineStart < prev.orfLineEnd);

export const filterAnnotations = (annotation, startIndex, charsPerRow) => {
  const showAnnotation =
    (annotation.startIndex <= startIndex && annotation.endIndex >= startIndex) ||
    (annotation.startIndex >= startIndex && annotation.startIndex < startIndex + charsPerRow);
  return showAnnotation;
};

export const getAnnotationsTopHeight = restrictionSites => {
  const resiteLabelLayers = restrictionSites.map((site, index) => {
    return getAnnotationLayer(restrictionSites, index);
  });
  const mostLayers = Math.max(...resiteLabelLayers);
  const annotationsTopHeight = LINE_PADDING_TOP + (1 + RESITE_LABEL_GAP) * (mostLayers > 0 ? mostLayers + 1 : 1);
  return annotationsTopHeight;
};

export const getSequenceHeight = (minusStrand, config) => {
  const sequenceHeight = minusStrand
    ? config.LETTER_HEIGHT_SEQUENCE * 2 + MINUS_STRAND_MARGIN
    : config.LETTER_HEIGHT_SEQUENCE;
  return sequenceHeight;
};

export const getAnnotationsBottomHeight = (annotations, startIndex, charsPerRow) => {
  const layerCount = annotations
    .filter(annotation => filterAnnotations(annotation, startIndex, charsPerRow))
    .reduce((layers, annotation, currIndex, arr) => {
      return Math.max(layers, getAnnotationLayer(arr, currIndex));
    }, 0);
  const annotationsBottomHeight =
    LINE_PADDING_BOTTOM + layerCount > 0
      ? layerCount * (ANNOTATION_GAP + ANNOTATION_HEIGHT) + ANNOTATION_PADDING_TOP
      : 0;
  return annotationsBottomHeight;
};
