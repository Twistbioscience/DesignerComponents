

export function measureFontWidth(fontFamily, fontSize, letter) {
  var svgNS = 'http://www.w3.org/2000/svg';
  var svgRoot = document.createElementNS(svgNS,"svg");
  var text = document.createElementNS(svgNS,"text");
  text.setAttribute("font-family",fontFamily);
  text.setAttribute("font-size",fontSize);
  text.setAttribute('visibility', 'hidden');
  text.textContent = letter || "A";
  svgRoot.appendChild(text);
  document.body.appendChild(svgRoot);
  const size = text.getBBox();
  document.body.removeChild(svgRoot);
  return size;
}

export function isFontLoaded() {
  console.log("isFontLoaded = ",measureFontWidth('Inconsolata', '12pt','w').width === measureFontWidth('Inconsolata', '12pt','i').width)
  return measureFontWidth('Inconsolata', '12pt','w').width === measureFontWidth('Inconsolata', '12pt','i').width ;
}
