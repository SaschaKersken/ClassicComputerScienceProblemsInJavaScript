if (typeof window === 'undefined') {
  csp = require(__dirname + '/csp.js');
  util = require(__dirname + '/../util.js');
}

class QueensConstraint extends csp.Constraint {
  constructor(columns) {
    super(columns);
    this.columns = columns;
  }

  satisfied(assignment) {
    // q1c = queen1 column, q1r = queen 1 row
    let q1c, q1r;
    for ([q1c, q1r] of this.tuples(assignment)) {
      // q2c = queen 2 column
      for (let q2c = parseInt(q1c) + 1; q2c <= this.columns.length; q2c++) {
        if (csp.member(Object.keys(assignment), q2c)) {
          let q2r = assignment[q2c]; // q2r = queen 2 row
          if (q1r == q2r) { // same row?
            return false;
          }
          if (Math.abs(q1r - q2r) == Math.abs(q1c - q2c)) { // same diagonal?
            return false;
          }
        }
      }
    }
    return true; // no conflict
  }

  // Helper function to turn an object {key1: value1, key2: value2...}
  // into an array of tuples: [[key1, value1], [key2, value2]...]
  tuples(object) {
    let result = [];
    for (let key of Object.keys(object)) {
      result.push([key, object[key]]);
    }
    return result;
  }
}

let columns = [1, 2, 3, 4, 5, 6, 7, 8];
let rows = {};
for (let column of columns) {
  rows[column] = [1, 2, 3, 4, 5, 6, 7, 8];
}
let qCsp = new csp.CSP(columns, rows);
qCsp.addConstraint(new QueensConstraint(columns));
let solution = qCsp.backtrackingSearch();
if (solution == null) {
  util.out("No solution found!");
} else {
  util.out(solution);
}
