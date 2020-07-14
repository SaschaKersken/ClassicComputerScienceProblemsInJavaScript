if (typeof window === 'undefined') {
  ga = require(__dirname + '/genetic_algorithm.js');
  tools = require(__dirname + '/tools.js');
  util = require(__dirname + '/../util.js');
}

class SendMoreMoney2 {
  constructor(letters) {
    this.letters = letters;
  }

  fitness() {
    let s = this.letters.indexOf('S');
    let e = this.letters.indexOf('E');
    let n = this.letters.indexOf('N');
    let d = this.letters.indexOf('D');
    let m = this.letters.indexOf('M');
    let o = this.letters.indexOf('O');
    let r = this.letters.indexOf('R');
    let y = this.letters.indexOf('Y');
    let send = s * 1000 + e * 100 + n * 10 + d;
    let more = m * 1000 + o * 100 + r * 10 + e;
    let money = m * 10000 + o * 1000 + n * 100 + e * 10 + y;
    let difference = Math.abs(money - (send + more));
    return 1 / (difference + 1);
  }

  static randomInstance() {
    let letters = ['S', 'E', 'N', 'D', 'M', 'O', 'R', 'Y', ' ', ' '];
    letters = tools.shuffle(letters);
    return new SendMoreMoney2(letters);
  }

  crossover(other) {
    let child1 = new SendMoreMoney2(this.letters.slice());
    let child2 = new SendMoreMoney2(other.letters.slice());
    let [idx1, idx2] = tools.randomIndices(this.letters);
    let [l1, l2] = [child1.letters[idx1], child2.letters[idx2]];
    [child1.letters[child1.letters.indexOf(l2)], child1.letters[idx2]] = [child1.letters[idx2], l2];
    [child2.letters[child2.letters.indexOf(l1)], child2.letters[idx1]] = [child2.letters[idx1], l1];
    return [child1, child2];
  }

  mutate() { // swap two letters' locations
    let [idx1, idx2] = tools.randomIndices(this.letters);
    [this.letters[idx1], this.letters[idx2]] = [this.letters[idx2], this.letters[idx1]];
  }

  toString() {
    let s = this.letters.indexOf('S');
    let e = this.letters.indexOf('E');
    let n = this.letters.indexOf('N');
    let d = this.letters.indexOf('D');
    let m = this.letters.indexOf('M');
    let o = this.letters.indexOf('O');
    let r = this.letters.indexOf('R');
    let y = this.letters.indexOf('Y');
    let send = s * 1000 + e * 100 + n * 10 + d;
    let more = m * 1000 + o * 100 + r * 10 + e;
    let money = m * 10000 + o * 1000 + n * 100 + e * 10 + y;
    let difference = Math.abs(money - (send + more));
    return send + ' + ' + more + ' = ' + money + ' Difference: ' + difference;
  }
}

let initialPopulation = [];
for (let i = 0; i < 1000; i++) {
  initialPopulation.push(SendMoreMoney2.randomInstance());
}
let gAlg = new ga.GeneticAlgorithm(initialPopulation, 1.0, 1000, 0.2, 0.7, ga.SelectionType.ROULETTE);
let result = gAlg.run();
util.out(result.toString());
