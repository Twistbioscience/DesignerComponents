const getLayerCount = (checkOverlap) => (annotations, index) => {
    const annotation = annotations[index];
    let layer = 1;
    for (let i = index; i >= 0; i--) {
        if (i === 0) {
            return layer;
        }
        const prevAnnotation = annotations[i - 1];
        const isOverLapped = checkOverlap(annotation, prevAnnotation);
        if (isOverLapped) {
            const prevLayer = getLayerCount(checkOverlap)(annotations, i-1);
            if (layer === prevLayer || isOverLapped) {
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

export const getAnnotationLayer = getLayerCount((curr, prev) => curr.startIndex < prev.endIndex);
export const getResiteLayer = getLayerCount((curr, prev) => curr.startIndex < prev.endIndex);
export const getOrfLayer = getLayerCount((curr, prev) => curr.orfLineStart < prev.orfLineEnd);
