if (typeof window === 'undefined') {
  gs = require(__dirname + '/generic_search.js');
  util = require(__dirname + '/../util.js');
}

class Test {
  constructor(v) {
    this.value = v;
  }

  equal(other) {
    return this.value == other.value;
  }

  compare(other) {
    return this.value - other.value;
  }
}

let m1 = [1, 8, 4, 9, 24, 17, 6, 5];
let m2 = [new Test(1), new Test(8), new Test(4), new Test(9), new Test(24), new Test(17), new Test(6), new Test(5)];
util.out(gs.linearContains(m1, 24));
util.out(gs.linearContains(m1, 2));
util.out(gs.linearContains(m2, new Test(24)));
util.out(gs.linearContains(m2, new Test(2)));
m1.sort((a, b) => a - b);
m2.sort(
  function(item1, item2) {
    return item1.compare(item2);
  }
);
util.out('SORTED');
util.out(m1, m2);
util.out(gs.binaryContains(m1, 9));
util.out(gs.binaryContains(m1, 10));
util.out(gs.binaryContains(m2, new Test(9)));
util.out(gs.binaryContains(m2, new Test(10)));
let s = new gs.Stack();
s.push(23);
s.push(42);
s.push(99);
util.out(s);
util.out(s.pop());
util.out(s.pop());
util.out(s.pop());
util.out(s.pop());
let n1 = new gs.Node('Test');
util.out(n1);
let n2 = new gs.Node('Test', n1);
util.out(n2);
let n3 = new gs.Node('Test', null, 1.5);
util.out(n3);
let n4 = new gs.Node('Test', n3, 1.5, 0.5);
util.out(n4);
util.out(n3.compare(n4));
let goalNode = gs.dfs(
  1,
  function(v) { return v >= 10; },
  function(v) { return [0 - v, v + 1]; }
);
util.out(goalNode);
util.out(gs.nodeToPath(goalNode));
let q = new gs.Queue();
q.push(23);
q.push(42);
q.push(99);
util.out(q);
util.out(q.pop());
util.out(q.pop());
util.out(q.pop());
util.out(q.pop());
