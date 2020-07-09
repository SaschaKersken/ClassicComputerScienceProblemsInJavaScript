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

function generateDomain(word, grid) {
  let domain = [];
  let height = grid.length;
  let width = grid[0].length;
  let len = word.length;
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      if (col + len <= width) {
        // left to right
        let tempLoc = [];
        for (let c = col; c < col + len; c++) {
          tempLoc.push(new GridLocation(row, c));
        }
        domain.push(tempLoc);
        // diagonal towards bottom right
        if (row + len <= height) {
          tempLoc = [];
          for (let r = row; r < row + len; r++) {
            tempLoc.push(new GridLocation(r, col + (r - row)));
          }
          domain.push(tempLoc);
        }
      }
      if (row + len <= height) {
        // top to bottom
        tempLoc = [];
        for (let r = row; r < row + len; r++) {
          tempLoc.push(new GridLocation(r, col));
        }
        domain.push(tempLoc);
      }
      // diagonal towards bottom left
      if (col - len >= 0) {
        tempLoc = [];
        for (let r = row; r < row + len; r++) {
          tempLoc.push(new GridLocation(r, col - (r - row)));
        }
        domain.push(tempLoc);
      }
    }
  }
  return domain;
}
      

class WordSearchConstraint extends csp.Constraint {
  constructor(words) {
    super(words);
    this.words = words;
  }

  satisfied(assignment) {
    // if there are any duplicates grid locations then there is an overlap
    let allLocations = [];
    for (let vals of Object.values(assignment)) {
      for (let locs of vals) {
        allLocations.push(locs);
      }
    }
    return !this.hasDuplicates(allLocations);
  }

  // Helper method that finds duplicates in an array of GridLocation objects
  hasDuplicates(locations) {
    let comparison = [];
    let newLoc, oldLoc;
    while (newLoc = locations.pop()) {
      for (oldLoc of comparison) {
        if (newLoc.row == oldLoc.row && newLoc.column == oldLoc.column) { // duplicate!
          return true;
        }
      }
      comparison.push(newLoc);
    }
    return false;
  }
}

let grid = generateGrid(9, 9);
let words = ["MATTHEW", "JOE", "MARY", "SARAH", "SALLY"];
let locations = {};
for (let word of words) {
  locations[word] = generateDomain(word, grid);
}
let wCsp = new csp.CSP(words, locations);
wCsp.addConstraint(new WordSearchConstraint(words));
let solution = wCsp.backtrackingSearch();
if (solution == null) {
  util.out("No solution found!");
} else {
  let word, gridLocations;
  for ([word, gridLocations] of Object.entries(solution)) {
    if (Math.random() < 0.5) {
      gridLocations.reverse();
    }
    for (let i = 0; i < word.length; i++) {
      let letter = word.charAt(i);
      let row = gridLocations[i].row;
      let column = gridLocations[i].column;
      grid[row][column] = letter;
    }
  }
  displayGrid(grid);
}
