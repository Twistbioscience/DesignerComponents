import { measureFontWidth } from './utils/rendering';

export const LETTER_WIDTH = measureFontWidth('monospace', '12pt');
export const LETTER_HEIGHT = 30;
export const INDEX_OFFSET = 12; // Chars
export const ANNOTATION_HEIGHT = 17;
export const ANNOTATION_GAP = 5;
export const SCOLL_BAR_OFFSET = 3;

export const charMap = {
  A:'T',
  G:'C',
  C:'G',
  T:'A'
};

