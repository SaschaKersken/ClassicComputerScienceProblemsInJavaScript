// Find the best possible outcome for original player
function minimax(board, maximizing, originalPlayer, maxDepth) {
  if (!maxDepth) {
    maxDepth = 8;
  }
  // Base case - terminal position or maximum depth reached
  if (board.isWin() || board.isDraw() || maxDepth == 0) {
    return board.evaluate(originalPlayer);
  }

  // Recursive case - terminal position or maximum depth reached
  if (maximizing) {
    let bestEval = -Infinity; // arbitrarily low starting point
    for (let move of board.legalMoves()) {
      let result = minimax(board.move(move), false, originalPlayer, maxDepth - 1);
      bestEval = Math.max(result, bestEval); // we want the move with the highest evaluation
    }
    return bestEval;
  } else { // minimizing
    let worstEval = Infinity;
    for (let move of board.legalMoves()) {
      let result = minimax(board.move(move), true, originalPlayer, maxDepth - 1);
      worstEval = Math.min(result, worstEval); // we want the move with the lowest evaluation
    }
    return worstEval;
  }
}

function alphabeta(board, maximizing, originalPlayer, maxDepth, alpha, beta) {
  if (!maxDepth) {
    maxDepth = 8;
  }
  if (!alpha) {
    alpha = -Infinity;
  }
  if (!beta) {
    beta = Infinity;
  }
  // Base case - terminal position or maximum depth reached
  if (board.isWin() || board.isDraw() || maxDepth == 0) {
    return board.evaluate(originalPlayer);
  }

  // Recursive case - maximize your gains or minimize the opponent's gains
  if (maximizing) {
    for (let move of board.legalMoves()) {
      let result = alphabeta(board.move(move), false, originalPlayer, maxDepth - 1, alpha, beta);
      alpha = Math.max(result, alpha);
      if (beta <= alpha) {
        break;
      }
    }
    return alpha;
  } else { // minimizing
    for (let move of board.legalMoves()) {
      let result = alphabeta(board.move(move), true, originalPlayer, maxDepth - 1, alpha, beta);
      beta = Math.min(result, beta);
      if (beta <= alpha) {
        break;
      }
    }
    return beta;
  }
}

// Find the best possible move in the current position
// looking up to maxDepth ahead
function findBestMove(board, maxDepth) {
  if (!maxDepth) {
    maxDepth = 8;
  }
  let bestEval = -Infinity;
  let bestMove = -1;
  for (let move of board.legalMoves()) {
    let result = alphabeta(board.move(move), false, board.turn, maxDepth);
    if (result > bestEval) {
      bestEval = result;
      bestMove = move;
    }
  }
  return bestMove;
}

let _mmExports = {
  minimax: minimax,
  alphabeta: alphabeta,
  findBestMove: findBestMove
};
if (typeof window == 'undefined') {
  module.exports = _mmExports;
} else {
  mm = _mmExports;
}
