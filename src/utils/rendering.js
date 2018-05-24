export const getAnnotationLayer = (annotations, index) => {
  const annotation = annotations[index];
  let layer = 1;
  for (let i = index; i >= 0; i--) {
    if (i === 0) {
      return layer;
    }
    const prevAnnotation = annotations[i - 1];
    if (annotation.startIndex < prevAnnotation.endIndex) {
      const prevLayer = getAnnotationLayer(annotations, i-1);
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

export function measureFontWidth(fontFamily, fontSize, text) {
    var font = fontSize + fontFamily,
        canvas = document.createElement('canvas'),
        context,
        fontWidth,
        height;

    text = text || 'M';

    document.body.appendChild(canvas);
    context = canvas.getContext('2d');
    canvas.style.font = font;
    context.font = font;

    //measureText only gives us width:
    fontWidth = context.measureText(text).width;
    document.body.removeChild(canvas);

    return fontWidth;
}