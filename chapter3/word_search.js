if (typeof window === 'undefined') {
  csp = require(__dirname + '/csp.js');
  util = require(__dirname + '/../util.js');
}

class GridLocation {
  constructor(row, column) {
    this.row = row;
    this.column = column;
  }
}

function generateGrid(rows, columns) {
  // initialize grid with random letters
  let grid = [];
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < columns; c++) {
      row.push(String.fromCharCode(Math.floor(Math.random() * 26 + 65)));
    }
    grid.push(row);
  }
  return grid;
}

function displayGrid(grid) {
  for (let row of grid) {
    util.out(row.join(''));
  }
}

let grid = generateGrid(10, 10);
displayGrid(grid);
/*

class WordSearchConstraint extends csp.Constraint {
}

let wCsp = new csp.CSP();
wCsp.addConstraint(new WordSearchConstraint());
let solution = sCsp.backtrackingSearch();
if (solution == null) {
  util.out("No solution found!");
} else {
}
*/
