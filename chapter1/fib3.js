if (typeof window === 'undefined') {
  util = require(__dirname + '/../util.js');
}

var memo = [0, 1]; // our base cases

function fib3(n) {
  if (typeof memo[n] === 'undefined') {
    memo[n] = fib3(n - 1) + fib3(n - 2); // memoization
  }
  return memo[n];
}

util.out(fib3(5));
util.out(fib3(50));
