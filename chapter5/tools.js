// Helper functions
// LZW-compress a string
function lzwEncode(s) {
  let dict = {};
  let data = (s + "").split("");
  let out = [];
  let currChar;
  let phrase = data[0];
  let code = 256;
  for (let i = 1; i < data.length; i++) {
    currChar=data[i];
    if (dict[phrase + currChar] != null) {
      phrase += currChar;
    } else {
      out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
      dict[phrase + currChar] = code;
      code++;
      phrase=currChar;
    }
  }
  out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
  for (let i = 0; i < out.length; i++) {
    out[i] = String.fromCharCode(out[i]);
  }
  return out.join("");
}

// Decompress an LZW-encoded string
function lzwDecode(s) {
  let dict = {};
  let data = (s + "").split("");
  let currChar = data[0];
  let oldPhrase = currChar;
  let out = [currChar];
  let code = 256;
  let phrase;
  for (let i=1; i<data.length; i++) {
    let currCode = data[i].charCodeAt(0);
    if (currCode < 256) {
      phrase = data[i];
    }
    else {
      phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
    }
    out.push(phrase);
    currChar = phrase.charAt(0);
    dict[code] = oldPhrase + currChar;
    code++;
    oldPhrase = phrase;
  }
  return out.join("");
}

// Shuffle an array
function shuffle(array) {
  let newArray = [];
  while (array.length > 0) {
    let index = Math.floor(Math.random() * array.length);
    newArray.push(array[index]);
    let restArray1 = array.slice(0, index);
    let restArray2 = [];
    if (index < array.length - 1) {
      restArray2 = array.slice(index + 1, array.length);
    }
    restArray1.push(...restArray2);
    array = restArray1;
  }
  return newArray;
}

// Get two different random indices from an array
function randomIndices(array) {
  let idx1 = Math.floor(Math.random() * array.length);
  let idx2;
  do {
    idx2 = Math.floor(Math.random() * array.length);
  } while (idx2 == idx1);
  return [idx1, idx2];
}

let _toolsExports = {
  lzwEncode: lzwEncode,
  lzwDecode: lzwDecode,
  shuffle: shuffle,
  randomIndices: randomIndices
};

if (typeof window === 'undefined') {
  module.exports = _toolsExports;
} else {
  tools = _toolsExports;
}
