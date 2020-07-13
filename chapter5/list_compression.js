if (typeof window === 'undefined') {
  ga = require(__dirname + '/genetic_algorithm.js');
  util = require(__dirname + '/../util.js');
}

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

const PEOPLE = ["Michael", "Sarah", "Joshua", "Narine", "David", "Sajid", "Melanie", "Daniel", "Wei", "Dean", "Brian", "Murat", "Lisa"];

class ListCompression {
  constructor(lst) {
    this.lst = lst;
  }

  bytesCompressed() {
    return lzwEncode(this.lst.join(',')).length;
  }

  fitness() {
    return 1 / this.bytesCompressed();
  }

  static randomInstance() {
    let mylst = shuffle(PEOPLE.slice());
    return new ListCompression(mylst);
  }

  _randomIndices() {
    let idx1 = Math.floor(Math.random() * this.lst.length);
    let idx2;
    do {
      idx2 = Math.floor(Math.random() * this.lst.length);
    } while (idx2 == idx1);
    return [idx1, idx2];
  }

  crossover(other) {
    let child1 = new ListCompression(this.lst.slice());
    let child2 = new ListCompression(other.lst.slice());
    let [idx1, idx2] = this._randomIndices();
    let [l1, l2] = [child1.lst[idx1], child2.lst[idx2]];
    [child1.lst[child1.lst.indexOf(l2)], child1.lst[idx2]] = [child1.lst[idx2], l2];
    [child2.lst[child2.lst.indexOf(l1)], child2.lst[idx1]] = [child2.lst[idx1], l1];
    return [child1, child2];
  }

  mutate() {
    let [idx1, idx2] = this._randomIndices();
    [this.lst[idx1], this.lst[idx2]] = [this.lst[idx2], this.lst[idx1]];
  }

  toString() {
    return "Order: " + this.lst.join(', ') + " Bytes: " + this.bytesCompressed();
  }
}

let lc = ListCompression.randomInstance();
let initialPopulation = [];
for (let i = 0; i < 100; i++) {
  initialPopulation.push(ListCompression.randomInstance());
}
let gAlg = new ga.GeneticAlgorithm(initialPopulation, 1.0, 100, 0.2, 0.7, ga.SelectionType.TOURNAMENT);
let result = gAlg.run();
util.out(result.toString());
