util = require(__dirname + '/../util.js');
mm = require(__dirname + '/minimax.js');
c4 = require(__dirname + '/connectfour.js');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var board = new c4.C4Board();

// Main game loop (recursion to use readline)
var recursiveAsyncReadLine = function() {
  rl.question('Enter a legal column (0-6): ', function(humanMove) {
    if (board.legalMoves().indexOf(humanMove) > -1) {
      board = board.move(humanMove);
      if (board.isWin()) {
        util.out('Human wins!');
        rl.close();
        return;
      } else if (board.isDraw()) {
        util.out('Draw!');
        rl.close();
        return;
      }
      let computerMove = mm.findBestMove(board);
      util.out('Computer move is ' + computerMove);
      board = board.move(computerMove);
      util.out(board.toString());
      if (board.isWin()) {
        util.out('Computer wins!');
        rl.close();
        return;
      } else if (board.isDraw()) {
        util.out('Draw!');
        rl.close();
        return;
      }
    }
    recursiveAsyncReadLine();
  });
}

recursiveAsyncReadLine(); 

