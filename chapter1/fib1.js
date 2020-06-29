if (typeof window === 'undefined') {
  util = require(__dirname + '/../util.js');
}

function fib1(n) {
  return fib1(n - 1) + fib1(n + 2);
}

util.out(fib1(5));
// Note that this example is purposefully wrong.
