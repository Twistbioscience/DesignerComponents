// @flow
export type Annotation = {startIndex: number, endIndex: number, name: string, color?: string};

export type RestrictionSite = Annotation & {overhang: number, cutIndex3_5: number, direction: number};

export type SelectionType = {
  startIndex: number,
  endIndex: number
};

export type Config = {
  LETTER_WIDTH_SEQUENCE: number,
  LETTER_HEIGHT_SEQUENCE: number,
  LETTER_WIDTH_BP_INDEX_LABEL: number,
  LETTER_FULL_WIDTH_SEQUENCE: number,
  BP_INDEX_HEIGHT: number
};
