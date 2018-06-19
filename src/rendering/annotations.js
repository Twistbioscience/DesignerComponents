const getLayerCount = checkOverlap => (annotations = [], index) => {
  let newAnno = annotations
    .slice(0, index)
    .map((annotation, i) => Object.assign({}, annotation, {layer: getLayerCount(checkOverlap)(annotations, i)}))
    .filter(annotation => checkOverlap(annotations[index], annotation));
  newAnno.sort((a, b) => {
    if (a.layer < b.layer) {
      return -1;
    }
    if (b.layer < a.layer) {
      return 1;
    }
    return 0;
  });
  return newAnno.reduce((curr, prev) => (prev.layer === curr ? prev.layer + 1 : curr), 1);
};

export const getAnnotationLayer = getLayerCount((curr, prev) => curr.startIndex < prev.endIndex);
export const getResiteLayer = getLayerCount((curr, prev) => curr.startIndex < prev.endIndex);
export const getOrfLayer = getLayerCount((curr, prev) => curr.orfLineStart < prev.orfLineEnd);
