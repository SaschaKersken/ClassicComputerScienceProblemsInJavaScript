var board = new tt.TTTBoard();
var busy = false;

// Main game loop
document.getElementById('okButton').addEventListener(
  'click',
  function() {
    if (busy) {
      return;
    }
    busy = true;
    let  humanMove = document.getElementById('move').value;
    document.getElementById('move').value = '';
    if (board.legalMoves().indexOf(humanMove) > -1) {
      board = board.move(humanMove);
      if (board.isWin()) {
        document.getElementById('info').innerHTML = 'Human wins!';
        document.getElementById('interactive').style.display = 'none';
      } else if (board.isDraw()) {
        document.getElementById('info').innerHTML = 'Draw!';
        document.getElementById('interactive').style.display = 'none';
      }
      let computerMove = mm.findBestMove(board);
      document.getElementById('info').innerHTML = 'Computer move is ' + computerMove;
      board = board.move(computerMove);
      document.getElementById('board').innerHTML = '<pre>' + board.toString() + '</pre>';
      if (board.isWin()) {
        document.getElementById('info').innerHTML = 'Computer wins!';
        document.getElementById('interactive').style.display = 'none';
      } else if (board.isDraw()) {
        document.getElementById('info').innerHTML = 'Draw!';
        document.getElementById('interactive').style.display = 'none';
      }
    }
    busy = false;
  }
);
