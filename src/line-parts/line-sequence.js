import React from 'react';
import {
  charMap,
  MINUS_STRAND_MARGIN,
  LINE_PADDING_TOP,
  RESITE_BOX_HOR_PADDING,
  RESITE_BOX_VERT_PADDING,
  FONT_FAMILY
} from '../constants';
import {flipSequence} from '../utils/sequence';

const getDx = length => {
  let res = '';
  for (let i = 0; i < length; i++) {
    res += `3 `;
  }
  res = res.trim();
  return res;
};

const Sequence = ({
  sequence,
  config,
  minusStrand,
  restrictionSites,
  startIndex,
  endIndex,
  charsPerRow,
  annotationsTopHeight
}) => {
  const restrictionSiteBoxes = restrictionSites.map((site, index) => {
    const width = RESITE_BOX_HOR_PADDING + (site.endIndex - site.startIndex + 1) * config.LETTER_FULL_WIDTH_SEQUENCE;
    const height = (config.LETTER_HEIGHT_SEQUENCE + RESITE_BOX_VERT_PADDING) * (minusStrand ? 2 : 1);
    const x = (site.startIndex - startIndex) * config.LETTER_FULL_WIDTH_SEQUENCE + 1;
    const y = annotationsTopHeight + LINE_PADDING_TOP;
    const pointsHalfStrand1 = [
      x,
      y,
      x + (site.cutIndex3_5 + (site.direction === -1 ? site.overhang : 0)) * config.LETTER_FULL_WIDTH_SEQUENCE,
      y,
      x + (site.cutIndex3_5 + (site.direction === -1 ? site.overhang : 0)) * config.LETTER_FULL_WIDTH_SEQUENCE,
      y + height,
      x,
      y + height
    ].join(' ');
    const pointsFullStrand1 = [
      x,
      y,
      x + site.cutIndex3_5 * config.LETTER_FULL_WIDTH_SEQUENCE,
      y,
      x + site.cutIndex3_5 * config.LETTER_FULL_WIDTH_SEQUENCE,
      y + (minusStrand ? height / 2 : height),
      x + (site.cutIndex3_5 + site.overhang) * config.LETTER_FULL_WIDTH_SEQUENCE,
      y + height / 2,
      x + (site.cutIndex3_5 + site.overhang) * config.LETTER_FULL_WIDTH_SEQUENCE,
      y + height,
      x,
      y + height
    ].join(' ');
    const pointsHalfStrand2 = [
      x + width,
      y,
      x + width,
      y + height,
      x + (site.cutIndex3_5 + (site.direction === -1 ? site.overhang : 0)) * config.LETTER_FULL_WIDTH_SEQUENCE,
      y + height,
      x + (site.cutIndex3_5 + (site.direction === -1 ? site.overhang : 0)) * config.LETTER_FULL_WIDTH_SEQUENCE,
      y
    ].join(' ');
    const pointsFullStrand2 = [
      x + width,
      y,
      x + width,
      y + height,
      x + (site.cutIndex3_5 + site.overhang) * config.LETTER_FULL_WIDTH_SEQUENCE,
      y + height,
      x + (site.cutIndex3_5 + site.overhang) * config.LETTER_FULL_WIDTH_SEQUENCE,
      y + height / 2,
      x + site.cutIndex3_5 * config.LETTER_FULL_WIDTH_SEQUENCE,
      y + height / 2,
      x + site.cutIndex3_5 * config.LETTER_FULL_WIDTH_SEQUENCE,
      y
    ].join(' ');
    const mid_x = x + width / 2;
    const mid_y = y + height / 2;
    const rotate = 'rotate(180 ' + mid_x.toString() + ' ' + mid_y.toString() + ')';
    return (
      <g key={`restriction-site-${index}`}>
        <polygon
          points={minusStrand ? pointsFullStrand1 : pointsHalfStrand1}
          x={x}
          y={y}
          fill="transparent"
          stroke={site.color}
          strokeWidth="1"
          transform={site.direction === -1 ? rotate : 'rotate(0)'}
        />
        <polygon
          points={minusStrand ? pointsFullStrand2 : pointsHalfStrand2}
          x={x}
          y={y}
          fill="transparent"
          stroke={site.color}
          strokeWidth="1"
          transform={site.direction === -1 ? rotate : 'rotate(0)'}
        />
      </g>
    );
  });

  return (
    <g width={config.LETTER_FULL_WIDTH_SEQUENCE * sequence.length}>
      <text
        y={annotationsTopHeight + config.LETTER_HEIGHT_SEQUENCE + LINE_PADDING_TOP}
        fontFamily={FONT_FAMILY}
        fontSize="12pt"
        fill="#000000"
        text-anchor="start"
        dx={getDx(sequence.length)}>
        {sequence}
      </text>
      {restrictionSiteBoxes}
      {minusStrand && (
        <text
          x="0"
          y={annotationsTopHeight + config.LETTER_HEIGHT_SEQUENCE * 2 + MINUS_STRAND_MARGIN + LINE_PADDING_TOP}
          fontFamily={FONT_FAMILY}
          fontSize="12pt"
          text-anchor="start"
          dx={getDx(sequence.length)}
          fill="#808080">
          {flipSequence(charMap, sequence)}
        </text>
      )}
    </g>
  );
};

export default Sequence;
