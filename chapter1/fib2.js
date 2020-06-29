if (typeof window === 'undefined') {
  util = require(__dirname + '/../util.js');
}

function fib2(n) {
  if (n < 2) { // base case
    return n;
  }
  return fib2(n - 1) + fib2(n - 2); // recursive case
}

util.out(fib2(5));
util.out(fib2(10));
