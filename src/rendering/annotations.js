// @flow

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

export const filterAnnotations = (annotation, startIndex, charsPerRow) => {
  const showAnnotation =
    (annotation.startIndex <= startIndex && annotation.endIndex >= startIndex) ||
    (annotation.startIndex >= startIndex && annotation.startIndex < startIndex + charsPerRow);
  return showAnnotation;
};
