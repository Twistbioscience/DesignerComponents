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
  var svgNS = 'http://www.w3.org/2000/svg';
  var svgRoot = document.createElementNS(svgNS,"svg");
  var text = document.createElementNS(svgNS,"text");
  text.setAttribute("font-family",fontFamily);
  text.setAttribute("font-size",fontSize);
  text.setAttribute('visibility', 'hidden');
  text.textContent = "A";
  svgRoot.appendChild(text);
  document.body.appendChild(svgRoot);
  const size = text.getBBox();
  document.body.removeChild(svgRoot);
  return size;
}