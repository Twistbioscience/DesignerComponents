export const map = (arr, f) => {
  if (!Array.isArray(arr) || arr.length === 0) {
    return [];
  }
  const res = [];
  for (let i = 0; i < arr.length; i++) {
    res.push(f(arr[i], i));
  }
  return res;
};

export const includes = (arr, elem) => {
  if (!arr || !Array.isArray(arr)) {
    return false;
  }
  return arr.indexOf(elem) > -1;
};
