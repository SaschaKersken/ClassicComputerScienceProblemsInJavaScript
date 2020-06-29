if (typeof window === 'undefined') {
  util = require(__dirname + '/../util.js');
}

function fib4(n) {
  if (n == 0) {
    return n; // special case
  }
  let last = 0; // initially set to fib(0)
  let next = 1; // initially set to fib(1)
  for (let i = 1; i < n; i++) {
    let helper = last;
    last = next;
    next += helper;
  }
  return next;
}

util.out(fib4(2));
util.out(fib4(50));
