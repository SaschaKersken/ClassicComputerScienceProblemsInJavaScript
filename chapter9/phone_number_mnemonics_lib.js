// Build the cartesian product of an arbitrary number of arrays
// Gratefully borrowed from https://stackoverflow.com/a/43053803
const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);

let phoneMapping = {
  '1': ['1'],
  '2': ['a', 'b', 'c'],
  '3': ['d', 'e', 'f'],
  '4': ['g', 'h', 'i'],
  '5': ['j', 'k', 'l'],
  '6': ['m', 'n', 'o'],
  '7': ['p', 'q', 'r', 's'],
  '8': ['t', 'u', 'v'],
  '9': ['w', 'x', 'y', 'z'],
  '0': ['0']
};

function possibleMnemonics(phoneNumber) {
  let letterTuples = [];
  for (let digit of phoneNumber.split('')) {
    letterTuples.push(phoneMapping[digit]);
  }
  let result = [];
  if (letterTuples.length > 0) {
    result = cartesian(...letterTuples);
  }
  return result;
}

let _pmExports = {
  possibleMnemonics: possibleMnemonics
};

if (typeof window === 'undefined') {
  module.exports = _pmExports;
} else {
  pm = _pmExports;
}
