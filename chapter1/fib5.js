if (typeof window === 'undefined') {
  util = require(__dirname + '/../util.js');
}

function* fib5(n) {
  yield 0; // special case
  if (n > 0) {
    yield 1; // special case
  }
  let last = 0; // initially set to fib(0)
  let next = 1; // initially set to fib(1)
  for (let i = 1; i < n; i++) {
    let helper = last;
    last = next;
    next += helper;
    yield next; // main generator step
  }
}

for (var item of fib5(50)) {
  util.out(item);
}
