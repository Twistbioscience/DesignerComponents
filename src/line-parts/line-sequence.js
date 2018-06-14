import React from 'react';
import {charMap, MINUS_STRAND_MARGIN, LINE_PADDING_TOP, FONT_FAMILY} from '../constants';
import {flipSequence} from '../utils/sequence';

const getDx = length => {
  let res = '';
  for (let i = 0; i < length; i++) {
    res += '3 ';
  }
  res = res.trim();
  return res;
};

const Sequence = ({sequence, config, minusStrand}) => {
  return (
    <g width={config.LETTER_FULL_WIDTH_SEQUENCE * sequence.length}>
      <text
        y={config.LETTER_HEIGHT_SEQUENCE + LINE_PADDING_TOP}
        fontFamily={FONT_FAMILY}
        fontSize="12pt"
        fill="#000000"
        text-anchor="start"
        dx={getDx(sequence.length)}>
        {sequence}
      </text>
      {minusStrand && (
        <text
          x="0"
          y={config.LETTER_HEIGHT_SEQUENCE * 2 + MINUS_STRAND_MARGIN + LINE_PADDING_TOP}
          fontFamily={FONT_FAMILY}
          fontSize="12pt"
          dx={getDx(sequence.length)}
          text-anchor="start"
          fill="#808080">
          {flipSequence(charMap, sequence)}
        </text>
      )}
    </g>
  );
};

export default Sequence;
