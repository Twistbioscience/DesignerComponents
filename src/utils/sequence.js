const chars = "AGTC";
const getChar = () => (
  chars[Math.floor(Math.random() * (3 + 1)) + 0]
);

const randInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const generateSequence = (min = 1000, max = 100000) => {
  const len = randInRange(min, max);
  let sequence = '';
  for (let i = 0; i < len; i++) {
    sequence += getChar();
  }
  return sequence;
};

export const flipSequence = (map, sequence) => {
  let res = '';
  for (let i = 0; i < sequence.length; i++) {
    res += (map[sequence[i]] || sequence[i]);
  }
  return res;
}