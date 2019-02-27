// @flow
import React from 'react';
import {charMap, MINUS_STRAND_MARGIN, FONT_FAMILY} from '../constants';
import {flipSequence} from '../utils/sequence';
import RestrictionSiteBox from './resite-box';
import {map} from '../utils/array';
import type {Config, RestrictionSite} from '../types';

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
  annotationsTopHeight
}: {
  sequence: string,
  config: Config,
  minusStrand: boolean,
  restrictionSites: Array<RestrictionSite>,
  startIndex: number,
  endIndex: number,
  annotationsTopHeight: number
}) => {
  const restrictionSiteBoxes = map(restrictionSites, (site, index) => {
    return (
      <RestrictionSiteBox
        key={'resite-box-' + startIndex + '-' + site.name + '-' + site.startIndex}
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
        className="sequence-text-plus-strand"
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
