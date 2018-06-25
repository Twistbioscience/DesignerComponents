import React from 'react';
import {
  charMap,
  MINUS_STRAND_MARGIN,
  RESITE_BOX_HOR_PADDING,
  RESITE_BOX_VERT_PADDING,
  FONT_FAMILY
} from '../constants';
import {flipSequence} from '../utils/sequence';
import RestrictionSiteBox from './resite-box';

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
    return (
      <RestrictionSiteBox
        key={'resite-box-' + startIndex + '-' + site.name + '-'  + site.startIndex.toString()}
        site={site}
        index={index}
        minusStrand={minusStrand}
        config={config}
        startIndex={startIndex}
        endIndex={endIndex}
        annotationsTopHeight={annotationsTopHeight}
      />
    );
  });

  return (
    <g width={config.LETTER_FULL_WIDTH_SEQUENCE * sequence.length}>
      <text
        y={annotationsTopHeight + config.LETTER_HEIGHT_SEQUENCE}
        fontFamily={FONT_FAMILY}
        fontSize="12pt"
        fill="#000000"
        textAnchor="start"
        dx={getDx(sequence.length)}>
        {sequence}
      </text>
      {restrictionSiteBoxes}
      {minusStrand && (
        <text
          x="0"
          y={annotationsTopHeight + config.LETTER_HEIGHT_SEQUENCE * 2 + MINUS_STRAND_MARGIN}
          fontFamily={FONT_FAMILY}
          fontSize="12pt"
          textAnchor="start"
          dx={getDx(sequence.length)}
          fill="#808080">
          {flipSequence(charMap, sequence)}
        </text>
      )}
    </g>
  );
};

export default Sequence;
