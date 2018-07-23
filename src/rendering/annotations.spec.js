import {getLayers} from './annotations';

const annotations = [
  {name: 'BsaI', startIndex: 142, endIndex: 152, overhang: 4, cutIndex3_5: 7, direction: -1, color: '#b0b3ee'},
  {name: 'HaeII', startIndex: 149, endIndex: 154, overhang: -4, cutIndex3_5: 5, direction: 1, color: '#fc957b'},
  {name: 'EcoRV', startIndex: 151, endIndex: 156, overhang: 0, cutIndex3_5: 3, direction: 1, color: '#7dfc7e'},
  {name: 'EcoRV', startIndex: 151, endIndex: 156, overhang: 0, cutIndex3_5: 3, direction: 1, color: '#7dfc7e'},
  {name: 'EcoRV', startIndex: 151, endIndex: 156, overhang: 0, cutIndex3_5: 3, direction: 1, color: '#7dfc7e'},
  {name: 'EcoRV', startIndex: 151, endIndex: 156, overhang: 0, cutIndex3_5: 3, direction: 1, color: '#7dfc7e'},
  {name: 'EcoRV', startIndex: 151, endIndex: 156, overhang: 0, cutIndex3_5: 3, direction: 1, color: '#7dfc7e'},
  {name: 'EcoRV', startIndex: 151, endIndex: 156, overhang: 0, cutIndex3_5: 3, direction: 1, color: '#7dfc7e'},
  {name: 'EcoRV', startIndex: 151, endIndex: 156, overhang: 0, cutIndex3_5: 3, direction: 1, color: '#7dfc7e'},
  {name: 'EcoRV', startIndex: 219, endIndex: 225, overhang: 0, cutIndex3_5: 3, direction: -1, color: '#7dfc7e'},
  {name: 'HaeII', startIndex: 340, endIndex: 345, overhang: -4, cutIndex3_5: 5, direction: 1, color: '#fc957b'},
  {name: 'HaeII', startIndex: 370, endIndex: 375, overhang: -4, cutIndex3_5: 5, direction: 1, color: '#fc957b'}
];

describe('rendering/getLayers', () => {
  it('should return 4 annotations for layer 0', () => {
    expect(getLayers(annotations)[0].length).toBe(4);
  });
  it('should return 1 annotation for layer 1', () => {
    expect(getLayers(annotations)[1].length).toBe(1);
  });
  it('should return 1 annotation for layer 2', () => {
    expect(getLayers(annotations)[2].length).toBe(1);
  });
});
