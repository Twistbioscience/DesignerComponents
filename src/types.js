// @flow
export type Annotation = {startIndex: number, endIndex: number, name: string, color?: string};

export type RestrictionSite = Annotation & {overhang: number, cutIndex3_5: number, direction: number};

// start and end index are both 0 based and inclusive
export type RangeType = {
  startIndex: number,
  endIndex: number
};

export type CaretType = number;

export type SelectionType = ?CaretType | ?RangeType;

export type Config = {
  LETTER_WIDTH_SEQUENCE: number,
  LETTER_HEIGHT_SEQUENCE: number,
  LETTER_WIDTH_BP_INDEX_LABEL: number,
  LETTER_FULL_WIDTH_SEQUENCE: number,
  BP_INDEX_HEIGHT: number
};
