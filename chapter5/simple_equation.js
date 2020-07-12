if (typeof window === 'undefined') {
  ga = require(__dirname + '/genetic_algorithm.js');
  util = require(__dirname + '/../util.js');
}

class SimpleEquation {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  fitness() { // 6x - x^2 + 4y - y^2
    return 6 * this.x - this.x * this.x + 4 * this.y - this.y * this.y;
  }

  static randomInstance() {
    return new SimpleEquation(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100));
  }

  crossover(other) {
    let child1 = new SimpleEquation(this.x, other.y);
    let child2 = new SimpleEquation(other.x, this.y);
    return [child1, child2];
  }

  mutate() {
    if (Math.random() > 0.5) { // mutate x
      if (Math.random() > 0.5) {
        this.x++;
      } else {
        this.x--;
      }
    } else { // otherwise mutate y
      if (Math.random() > 0.5) {
        this.y++;
      } else {
        this.y--;
      }
    }
  }

  toString() {
    return 'X: ' + this.x + ' Y: ' + this.y + ' Fitness: ' + this.fitness();
  }
}

let initialPopulation = [];
for (let i = 0; i < 20; i++) {
  initialPopulation.push(SimpleEquation.randomInstance());
}
let gAlgo = new ga.GeneticAlgorithm(initialPopulation, 13, 100, 0.1, 0.7);
let result = gAlgo.run();
util.out(result.toString());
