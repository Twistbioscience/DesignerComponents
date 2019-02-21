import React from 'react';
import RestrictionSiteLabel from './resite-label';
import {render, cleanup} from 'react-testing-library';
import {getLayers} from '../rendering/annotations';
import sinon from 'sinon';
import * as Fonts from '../rendering/fonts';

// this add custom jest matchers from jest-dom
import 'jest-dom/extend-expect';

const restrictionSites = [
  // Restriction Site that starts at index 0
  {name: 'BsaI', startIndex: 0, endIndex: 10, overhang: 4, cutIndex3_5: 7, direction: 1, color: '#b0b3ee'},
  // Restriction Site that starts somewhere else
  {name: 'BsaI', startIndex: 128, endIndex: 138, overhang: 4, cutIndex3_5: 7, direction: 1, color: '#b0b3ee'},
  // Same Restriction Site, but matching on the reverse strand (direction: -1)
  {name: 'BsaI', startIndex: 142, endIndex: 152, overhang: 4, cutIndex3_5: 7, direction: -1, color: '#b0b3ee'},
  // Restriction Site with negative overhang
  {name: 'HaeII', startIndex: 149, endIndex: 154, overhang: -4, cutIndex3_5: 5, direction: 1, color: '#fc957b'},
  // Same Restriction Site, but matching on the reverse strand (direction: -1)
  {name: 'HaeII', startIndex: 160, endIndex: 154, overhang: -4, cutIndex3_5: 5, direction: 1, color: '#fc957b'},
  // Restriction Site with 0 overhang
  {name: 'EcoRV', startIndex: 162, endIndex: 167, overhang: 0, cutIndex3_5: 3, direction: 1, color: '#7dfc7e'},
  // Restriction Site that is very long and spans more than one line
  {name: 'vErYLong', startIndex: 200, endIndex: 500, overhang: -50, cutIndex3_5: 88, direction: 1, color: '#800000'},
  // Shortest Restriction Site (4 characters)
  {name: 'BfuCI', startIndex: 204, endIndex: 207, overhang: 4, cutIndex3_5: 0, direction: 1, color: '#ff0065'},
  {name: 'EcoRV', startIndex: 219, endIndex: 225, overhang: 0, cutIndex3_5: 3, direction: -1, color: '#7dfc7e'},
  // Two Restriction Sites that end at the same index
  {name: 'stuff', startIndex: 240, endIndex: 265, overhang: 0, cutIndex3_5: 3, direction: -1, color: '#b0b3ee'},
  {name: 'yeahhh', startIndex: 247, endIndex: 265, overhang: 4, cutIndex3_5: 5, direction: 1, color: '#7dfc7e'},
  // Two Restriction Sites that start at the same index
  {name: 'mOrE', startIndex: 293, endIndex: 299, overhang: -2, cutIndex3_5: 5, direction: 1, color: '#b0b3ee'},
  {name: 'siTeS', startIndex: 293, endIndex: 302, overhang: 4, cutIndex3_5: 4, direction: 1, color: '#7dfc7e'}
];

// This is a not a real test right now. Still need to figure out how to render/test svgs by mocking measureFontWidth.
describe('resite-label', () => {
  const config = {
    LETTER_FULL_WIDTH_SEQUENCE: 10.703125,
    LETTER_HEIGHT_SEQUENCE: 17,
    LETTER_WIDTH_BP_INDEX_LABEL: 8
  };

  const maxResiteLayer = getLayers(restrictionSites).length;

  it('label should be as long as the restriction site', () => {
    const props = {
      startIndex: 0,
      charsPerRow: 500,
      lineWidth: 10.703125 * 20 + 12,
      minusStrand: false,
      arr: restrictionSites,
      index: 3,
      site: restrictionSites[3],
      config,
      maxResiteLayer
    };

    let measureFontWidth = sinon.stub(Fonts, 'measureFontWidth');
    measureFontWidth.returns({x: 3, y: -9, width: 5.328125, height: 11});

    const {container} = render(<RestrictionSiteLabel {...props} />);

    expect(container.querySelectorAll('text').length).toBe(1);
  });
});
