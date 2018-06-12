import React from 'react';
import Line from './line';
import {render, prettyDOM, getByText} from 'react-testing-library';
// this add custom jest matchers from jest-dom
import 'jest-dom/extend-expect';

describe('Line', () => {
  const config = {
    LETTER_FULL_WIDTH_SEQUENCE: 13,
    LETTER_HEIGHT_SEQUENCE: 17,
    LETTER_WIDTH_BP_INDEX_LABEL: 8
  };
  xit('index marker should be under the correct letter', () => {
    const props = {
      charsPerRow: 10,
      minusStrand: false,
      index: 0,
      style: {},
      selection: {
        startIndex: 0,
        endIndex: 0
      },
      selectionInProgress: false,
      config,
      sequence: 'ACTACGACTACGACTCAGACCATCAGACTACACGACTACGAC',
      annotations: []
    };

    const {container, debug} = render(<Line {...props} />);
    const firstLabel = getByText(container, '10');
    const firstLabelXPos = parseFloat(firstLabel.getAttribute('x'));
    expect(firstLabelXPos).toBe(config.LETTER_FULL_WIDTH_SEQUENCE * 10 - (config.LETTER_WIDTH_BP_INDEX_LABEL * 2) / 2);
  });
});
