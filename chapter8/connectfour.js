if (typeof window === 'undefined') {
  mm = require(__dirname + '/minimax.js');
}

const B = 'B';
const R = 'R';
const E = ' '; // stand-in for empty

class C4Piece {
  constructor(value) {
    this.value = value;
  }

  opposite() {
    if (this.value == B) {
      return new C4Piece(R);
    } else if (this.value == R) {
      return new C4Piece(B);
    } else {
      return new C4Piece(E);
    }
  }
}

function generateSegments(numColumns, numRows, segmentLength) {
  let segments = [];
  // generate the vertical segments
  for (let c = 0; c < numColumns; c++) {
    for (let r = 0; r <= numRows - segmentLength; r++) {
      let segment = [];
      for (let t = 0; t < segmentLength; t++) {
        segment.push([c, r + t]);
      }
      segments.push(segment);
    }
  }
  // generate the horizontal segments
  for (let c = 0; c <= numColumns - segmentLength; c++) {
    for (let r = 0; r < numRows; r++) {
      let segment = [];
      for (let t = 0; t < segmentLength; t++) {
        segment.push([c + t, r]);
      }
      segments.push(segment);
    }
  }
  // generate the bottom left to top right diagonl segments
  for (let c = 0; c <= numColumns - segmentLength; c++) {
    for (let r = 0; r <= numRows - segmentLength; r++) {
      let segment = [];
      for (let t = 0; t < segmentLength; t++) {
        segment.push([c + t, r + t]);
      }
      segments.push(segment);
    }
  }
  // generate the top left to bottom right diagonal segments
  for (let c = 0; c <= numColumns - segmentLength; c++) {
    for (let r = segmentLength - 1; r < numRows; r++) {
      let segment = [];
      for (let t = 0; t < segmentLength; t++) {
        segment.push([c + t, r - t]);
      }
      segments.push(segment);
    }
  }
  return segments;
}

const NUM_ROWS = 6;
const NUM_COLUMNS = 7;
const SEGMENT_LENGTH = 4;
const SEGMENTS = generateSegments(NUM_COLUMNS, NUM_ROWS, SEGMENT_LENGTH);

class C4Column {
  constructor() {
    this.container = [];
  }

  full() {
    return this.container.length == NUM_ROWS;
  }

  push(item) {
    if (this.full()) {
      throw "Trying to push piece to full column";
    }
    this.container.push(item);
  }

  itemAt(index) {
    if (index > this.container.length - 1) {
      return new C4Piece(E);
     }
     return this.container[index];
  }

  copy() {
    let temp = new C4Column();
    temp.container = this.container.slice();
    return temp;
  }
}

class C4Board {
  constructor(position, turn) {
    if (!position) {
      position = [];
      for (let i = 0; i < NUM_COLUMNS; i++) {
        position.push(new C4Column());
      }
    }
    this.position = position;
    if (!turn) {
      turn = new C4Piece(B);
    }
    this.turn = turn;
  }

  move(location) {
    let tempPosition = this.position.slice();
    for (let c = 0; c < NUM_COLUMNS; c++) {
      tempPosition[c] = this.position[c].copy();
    }
    tempPosition[location].push(this.turn);
    return new C4Board(tempPosition, this.turn.opposite());
  }

  legalMoves() {
    return Object.keys(this.position).filter((c) => !this.position[c].full());
  }

  // Returns the count of black and red pieces in a segment
  countSegment(segment) {
    let blackCount = 0;
    let redCount = 0;
    for (let [column, row] of segment) {
      if (this.position[column].itemAt(row).value == B) {
        blackCount++;
      } else if (this.position[column].itemAt(row).value == R) {
        redCount++;
      }
    }
    return [blackCount, redCount];
  }

  isWin() {
    for (let segment of SEGMENTS) {
      let [blackCount, redCount] = this.countSegment(segment);
      if (blackCount == 4 || redCount == 4) {
        return true;
      }
    }
    return false;
  }

  isDraw() {
    return !this.isWin() && this.legalMoves().length == 0;
  }

  evaluateSegment(segment, player) {
    let [blackCount, redCount] = this.countSegment(segment);
    if (redCount > 0 && blackCount > 0) {
      return 0; // mixed segments are neutral
    }
    let count = Math.max(redCount, blackCount);
    let score = 0;
    if (count == 2) {
      score = 1;
    } else if (count == 3) {
      score = 100;
    } else if (count == 4) {
      score = 1000000;
    }
    let color = B;
    if (redCount > blackCount) {
      color = R;
    }
    if (color != player.value) {
      return -score;
    }
    return score;
  }

  evaluate(player) {
    let total = 0;
    for (let segment of SEGMENTS) {
      total += this.evaluateSegment(segment, player);
    }
    return total;
  }

  toString(withColor) {
    let display = '';
    for (let r = NUM_ROWS - 1; r >= 0; r--) {
      display += '|';
      for (let c = 0; c < NUM_COLUMNS; c++) {
        let current = this.position[c].itemAt(r).value;
        if (withColor && current == R) {
          current = '<span style="color: #f00;">' + R + '</span>';
        }
        display += current + '|';
      }
      display += "\n";
    }
    return display;
  }
}

let _c4Exports = {
  C4Piece: C4Piece,
  C4Column: C4Column,
  C4Board: C4Board
};

if (typeof window === 'undefined') {
  module.exports = _c4Exports;
} else {
  c4 = _c4Exports;
}   
