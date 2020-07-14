if (typeof window === 'undefined') {
  ga = require(__dirname + '/genetic_algorithm.js');
  tools = require(__dirname + '/tools.js');
  util = require(__dirname + '/../util.js');
}

const PEOPLE = ["Michael", "Sarah", "Joshua", "Narine", "David", "Sajid", "Melanie", "Daniel", "Wei", "Dean", "Brian", "Murat", "Lisa"];

class ListCompression {
  constructor(lst) {
    this.lst = lst;
  }

  bytesCompressed() {
    return tools.lzwEncode(this.lst.join(',')).length;
  }

  fitness() {
    return 1 / this.bytesCompressed();
  }

  static randomInstance() {
    let mylst = tools.shuffle(PEOPLE.slice());
    return new ListCompression(mylst);
  }

  crossover(other) {
    let child1 = new ListCompression(this.lst.slice());
    let child2 = new ListCompression(other.lst.slice());
    let [idx1, idx2] = tools.randomIndices(this.lst);
    let [l1, l2] = [child1.lst[idx1], child2.lst[idx2]];
    [child1.lst[child1.lst.indexOf(l2)], child1.lst[idx2]] = [child1.lst[idx2], l2];
    [child2.lst[child2.lst.indexOf(l1)], child2.lst[idx1]] = [child2.lst[idx1], l1];
    return [child1, child2];
  }

  mutate() {
    let [idx1, idx2] = tools.randomIndices(this.lst);
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
