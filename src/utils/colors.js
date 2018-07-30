var nameColor = {},
  colorRunningIndex = 0,
  randomColorArray = [
    '#2AD4C6',
    '#2AB7D4',
    '#2A8DD4',
    '#2A63D4',
    '#D42A63',
    '#D42AB7',
    '#D4472A',
    '#9B2AD4',
    '#D49B2A',
    '#58A9D1',
    '#588AD1',
    '#586CD1',
    '#6258D1',
    '#D16258',
    '#D1588A',
    '#D19F58',
    '#D158C7',
    '#ADB648',
    '#9677F2',
    '#B477F2',
    '#D377F2',
    '#F277F2',
    '#F2B477',
    '#B4F277',
    '#F27777',
    '#5DD95D',
    '#EBB328',
    '#F5EF38',
    '#D377F2',
    '#9DF538',
    '#389DF5',
    '#29BFBB',
    '#383FF5',
    '#2FD47C',
    '#9038F5'
  ];

export const getNamedColor = name => {
  if (nameColor[name] === undefined) {
    nameColor[name] = randomColorArray[colorRunningIndex];
    colorRunningIndex = (colorRunningIndex + 1) % randomColorArray.length;
  }

  return nameColor[name];
};
