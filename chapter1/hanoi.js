if (typeof window === 'undefined') {
  util = require(__dirname + '/../util.js');
}

class Stack {
  constructor() {
    this.container = [];
  }

  push(item) {
    this.container.push(item);
  }

  pop(item) {
    return this.container.pop();
  }

  toString() {
    return this.container.join(', ');
  }
}

let numDiscs = 3;
let towerA = new Stack();
let towerB = new Stack();
let towerC = new Stack();
for (let i = 1; i <= numDiscs; i++) {
  towerA.push(i);
}

function hanoi(begin, end, temp, n) {
  if (n == 1) {
    end.push(begin.pop());
  } else {
    hanoi(begin, temp, end, n - 1);
    hanoi(begin, end, temp, 1);
    hanoi(temp, end, begin, n - 1);
  }
}

hanoi(towerA, towerC, towerB, numDiscs);
util.out('Tower A: ' + towerA);
util.out('Tower B: ' + towerB);
util.out('Tower C: ' + towerC);
