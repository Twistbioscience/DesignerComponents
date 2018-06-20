import {FONT_FAMILY} from 'constants';

const getDx = count => {
  let res = '';
  for (let i = 0; i < count; i++) {
    res += '3 ';
  }
  return res;
};
export function measureFontWidth(fontFamily, fontSize, letter) {
  var svgNS = 'http://www.w3.org/2000/svg';
  var svgRoot = document.createElementNS(svgNS, 'svg');
  var text = document.createElementNS(svgNS, 'text');
  text.setAttribute('font-family', fontFamily);
  text.setAttribute('font-size', fontSize);
  text.setAttribute('visibility', 'hidden');
  if (letter) {
    text.setAttribute('dx', getDx(letter.length));
  }
  text.setAttribute('text-anchor', 'start');
  text.textContent = letter || 'A';
  svgRoot.appendChild(text);
  document.body.appendChild(svgRoot);
  const size = text.getBBox();
  document.body.removeChild(svgRoot);
  return size;
}

export function isFontLoaded() {
  return measureFontWidth(FONT_FAMILY, '12pt', 'w').width === measureFontWidth(FONT_FAMILY, '12pt', 'i').width;
}
