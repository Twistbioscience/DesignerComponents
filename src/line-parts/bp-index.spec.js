import React from 'react';
import LineBpIndex from './bp-index';
import {render} from 'react-testing-library';
// this add custom jest matchers from jest-dom
import 'jest-dom/extend-expect';

describe('bp-index', () => {
  const config = {
    LETTER_FULL_WIDTH_SEQUENCE: 10,
    LETTER_HEIGHT_SEQUENCE: 10,
    LETTER_WIDTH_BP_INDEX_LABEL: 8
  };
  it('should render 0 markers when difference between startIndex and endIndex is less than stepSize', () => {
    const props = {
      startIndex: 1,
      endIndex: 5,
      stepSize: 10,
      minusStrand: false,
      offset: 0,
      config
    };

    const {container, debug} = render(<LineBpIndex {...props} />);
    expect(container.querySelectorAll('text').length).toBe(0);
    expect(container.querySelectorAll('line').length).toBe(0);
  });
});
