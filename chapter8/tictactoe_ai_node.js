util = require(__dirname + '/../util.js');
mm = require(__dirname + '/minimax.js');
tt = require(__dirname + '/tictactoe.js');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var board = new tt.TTTBoard();

// Main game loop (recursion to use readline)
var recursiveAsyncReadLine = function() {
  rl.question('Enter a legal square (0-8): ', function(humanMove) {
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

