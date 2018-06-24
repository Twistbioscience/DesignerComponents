// @flow

export const getAnnotationLayer = (annotations, index) => {
  const annotation = annotations[index];
  let layer = 1;
  for (let i = index; i >= 0; i--) {
    if (i === 0) {
      return layer;
    }
    const prevAnnotation = annotations[i - 1];
    if (annotation.startIndex < prevAnnotation.endIndex) {
      const prevLayer = getAnnotationLayer(annotations, i - 1);
      if (layer === prevLayer) {
        layer++;
      } else {
        break;
      }
    } else {
      break;
    }
  }
  return layer;
};
