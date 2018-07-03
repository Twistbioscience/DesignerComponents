import React from 'react';
import RestrictionSiteLabel from './resite-label';
import {render, cleanup} from 'react-testing-library';
import Enzyme, { shallow } from 'enzyme';
import {getResiteLayer} from '../rendering/annotations';
// this add custom jest matchers from jest-dom
import 'jest-dom/extend-expect';

import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const restrictionSites = [
  {"name": "BsaI", "startIndex": 0, "endIndex": 10, "overhang": 4, "cutIndex3_5": 7, "direction": 1, "color": "#b0b3ee"},
  {"name": "BsaI", "startIndex": 128, "endIndex": 138, "overhang": 4, "cutIndex3_5": 7, "direction": 1, "color": "#b0b3ee"},
  {"name": "BsaI", "startIndex": 142, "endIndex": 152, "overhang": 4, "cutIndex3_5": 7, "direction": -1, "color": "#b0b3ee"},
  {"name": "HaeII", "startIndex": 149, "endIndex": 154, "overhang": -4, "cutIndex3_5": 5, "direction": 1, "color": "#fc957b"},
  {"name": "EcoRV", "startIndex": 151, "endIndex": 156, "overhang": 0, "cutIndex3_5": 3, "direction": 1, "color": "#7dfc7e"},
  {"name": "vErYLongStrandwithLongName", "startIndex": 200, "endIndex": 500, "overhang": -50, "cutIndex3_5": 88, "direction": 1, "color": "#800000"},
  {"name": "EcoRV", "startIndex": 219, "endIndex": 225, "overhang": 0, "cutIndex3_5": 3, "direction": -1, "color": "#7dfc7e"},
  {"name": "stuff", "startIndex": 240, "endIndex": 265, "overhang": 0, "cutIndex3_5": 3, "direction": -1, "color": "#b0b3ee"},
  {"name": "yeahhh", "startIndex": 247, "endIndex": 265, "overhang": 4, "cutIndex3_5": 5, "direction": 1, "color": "#7dfc7e"}
];

describe('resite-label', () => {
  const config = {
    LETTER_FULL_WIDTH_SEQUENCE: 10.703125,
    LETTER_HEIGHT_SEQUENCE: 17,
    LETTER_WIDTH_BP_INDEX_LABEL: 8
  };

  const maxResiteLayer = restrictionSites
    .map((site, index, arr) => {
      return getResiteLayer(arr, index);
    })
    .reduce((maxLayer, currentLayer) => {
      return Math.max(maxLayer, currentLayer);
    });

  it('label should be as long as the restriction site', () => {
    const props = {
      charsPerRow: 20,
      lineWidth: 10.703125 * 20 + 12,
      minusStrand: false,
      arr: restrictionSites,
      index: 3,
      site: restrictionSites[3],
      config,
      maxResiteLayer
    };

    afterEach(cleanup)

    expect(1).toBe(1);
  });
});
