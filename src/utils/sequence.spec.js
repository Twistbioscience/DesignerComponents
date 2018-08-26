import {generateSequence} from './sequence';

describe('utils/generateSequence', () => {
  it('should generate a sequence of length > min', () => {
    expect(generateSequence(100).length).toBeGreaterThan(100);
  });
});
