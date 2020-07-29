if (typeof window === 'undefined') {
  mm = require(__dirname + '/minimax.js');
}

const X = 'X';
const O = 'O';
const E = ' '; // stand-in for empty

class TTTPiece {
  constructor(value) {
    this.value = value;
  }

  opposite() {
    if (this.value == X) {
      this.value = O;
    } else if (this.value == O) {
      this.value = X;
    } else {
      this.value = E;
    }
  }
}

class TTTBoard {
  constructor(position, turn) {
    if (!position) {
      position = [];
      for (let i = 0; i < 9; i++) {
        position.push(new TTTPiece(E));
      }
    }
    this.position = position;
    if (!turn) {
      turn = new TTTPiece(X);
    }
    this.turn = turn;
  }

  move(location) {
    let tempPosition = this.position.slice();
    tempPosition[location] = this.turn;
    return new TTTBoard(tempPosition, this.turn.opposite());
  }

  legalMoves() {
    // return this.position.slice().filter((l) => l.value == E);
    let result = [];
    for (let i in this.position) {
      if (this.position[i].value == E) {
        result.push(i);
      }
    }
    return result;
  }

  isWin() {
    // three row, three column, and then two diagonal checks
    return (this.position[0].value == this.position[1] && this.position[0].value == this.position[2] && this.position[0].value != E) ||
      (this.position[3].value == this.position[4] && this.position[3].value == this.position[5] && this.position[3].value != E) || 
      (this.position[6].value == this.position[7] && this.position[6].value == this.position[8] && this.position[6].value != E) ||
      (this.position[0].value == this.position[3] && this.position[0].value == this.position[6] && this.position[0].value != E) ||
      (this.position[1].value == this.position[4] && this.position[1].value == this.position[7] && this.position[1].value != E) ||
      (this.position[2].value == this.position[5] && this.position[2].value == this.position[8] && this.position[2].value != E) ||
      (this.position[0].value == this.position[4] && this.position[0].value == this.position[8] && this.position[0].value != E) ||
      (this.position[2].value == this.position[4] && this.position[2].value == this.position[6] && this.position[2].value != E);
  }

  isDraw() {
    return !this.isWin() && this.legalMoves().length == 0;
  }

  evaluate(player) {
    if (this.isWin() && this.turn.value == player.value) {
      return -1;
    }
    if (this.isWin() && this.turn.value != player.value) {
      return 1;
    }
    return 0;
  }

  toString() {
    let result = "";
    result += this.position[0].value + "|" + this.position[1].value + "|" + this.position[2].value + "\n";
    result += "-----\n";
    result += this.position[3].value + "|" + this.position[4].value + "|" + this.position[5].value + "\n";
    result += "-----\n";
    result += this.position[6].value + "|" + this.position[7].value + "|" + this.position[8].value;
    return result;
  }
}

let _ttExports = {
  TTTPiece: TTTPiece,
  TTTBoard: TTTBoard
};

if (typeof window === 'undefined') {
  module.exports = _ttExports;
} else {
  tt = __ttExports;
}
