if (typeof window === 'undefined') {
  gs = require(__dirname + '/generic_search.js');
  util = require(__dirname + '/../util.js');
}

const Cell = {
  EMPTY: ' ',
  BLOCKED: 'X',
  START: 'S',
  GOAL: 'G',
  PATH: '*'
};

class MazeLocation {
  constructor(row, column) {
    this.row = row;
    this.column = column;
  }

  equal(other) {
    return this.row == other.row && this.column == other.column;
  }
}

class Maze {
  constructor(rows, columns, sparseness, start, goal) {
    // initialize basic instance variables
    this.rows = rows ? rows : 10;
    this.columns = columns ? columns : 10;
    this.sparseness = sparseness ? sparseness : 0.2;
    this.start = start ? start : new MazeLocation(0, 0);
    this.goal = goal ? goal : new MazeLocation(9, 9);
    // fill the grid with empty cells
    this.grid = [];
    for (let i = 0; i < this.rows; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.columns; j++) {
        this.grid[i][j] = Cell.EMPTY;
      }
    }
    // populate the grid with blocked cells
    this.randomlyFill(this.rows, this.columns, this.sparseness);
    // fill the start and goal locations in
    this.grid[this.start.row][this.start.column] = Cell.START;
    this.grid[this.goal.row][this.goal.column] = Cell.GOAL;
  }

  randomlyFill(rows, columns, sparseness) {
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        if (Math.random() < sparseness) {
          this.grid[row][column] = Cell.BLOCKED;
        }
      }
    }
  }

  // return a nicely formatted version of the maze for printing
  toString() {
    let output = '';
    for (let row of this.grid) {
      for (let c of row) {
        output += c;
      }
      output += "\n";
    }
    return output;
  }

  goalTest(ml) {
    return ml.row == this.goal.row && ml.column == this.goal.column;
  }

  successors(ml) {
    let locations = [];
    if (ml.row + 1 < this.rows && this.grid[ml.row + 1][ml.column] != Cell.BLOCKED) {
      locations.push(new MazeLocation(ml.row + 1, ml.column));
    }
    if (ml.row - 1 >= 0 && this.grid[ml.row - 1][ml.column] != Cell.BLOCKED) {
      locations.push(new MazeLocation(ml.row - 1, ml.column));
    }
    if (ml.column + 1 < this.columns && this.grid[ml.row][ml.column + 1] != Cell.BLOCKED) {
      locations.push(new MazeLocation(ml.row, ml.column + 1));
    }
    if (ml.column - 1 >= 0 && this.grid[ml.row][ml.column + 1] != Cell.BLOCKED) {
      locations.push(new MazeLocation(ml.row, ml.column - 1));
    }
    return locations;
  }

  mark(path) {
    for (let mazeLocation of path) {
      this.grid[mazeLocation.row][mazeLocation.column] = Cell.PATH;
    }
    this.grid[this.start.row][this.start.column] = Cell.START;
    this.grid[this.goal.row][this.goal.column] = Cell.GOAL;
  }

  clear(path) {
    for (let mazeLocation of path) {
      this.grid[mazeLocation.row][mazeLocation.column] = Cell.EMPTY;
    }
    this.grid[this.start.row][this.start.column] = Cell.START;
    this.grid[this.goal.row][this.goal.column] = Cell.GOAL;
  }
}

function euclideanDistance(goal) {
  return function(ml) {
    let xdist = ml.column - goal.column;
    let ydist = ml.row - goal.row;
    return Math.sqrt((xdist * xdist) + (ydist * ydist));
  };
}

function manhattanDistance(goal) {
  return function(ml) {
    let xdist = Math.abs(ml.column - goal.column);
    let ydist = Math.abs(ml.row - goal.row);
    return (xdist + ydist);
  };
}

// Test DFS
let m = new Maze();
util.out(m.toString());
let solution1 = gs.dfs(m.start, (ml) => m.goalTest(ml), (ml) => m.successors(ml));
if (solution1 == null) {
  util.out("No solution found using depth-first search!");
} else {
  let path1 = gs.nodeToPath(solution1);
  m.mark(path1);
  util.out(m.toString());
  m.clear(path1);
}

// Test BFS
let solution2 = gs.bfs(m.start, (ml) => m.goalTest(ml), (ml) => m.successors(ml));
if (solution2 == null) {
  util.out("No solution found using breadth-first search!");
} else {
  let path2 = gs.nodeToPath(solution2);
  m.mark(path2);
  util.out(m.toString());
  m.clear(path2);
}

// Test A*
distance = manhattanDistance(m.goal);
let solution3 = gs.astar(m.start, (ml) => m.goalTest(ml), (ml) => m.successors(ml), (ml) => distance(ml));
if (solution3 == null) {
  util.out("No solution found using A*!");
} else {
  let path3 = gs.nodeToPath(solution3);
  m.mark(path3);
  util.out(m.toString());
  m.clear(path3);
}
