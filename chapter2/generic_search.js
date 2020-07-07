function compare(item1, item2) {
  if (typeof item1.compare === 'function') {
    return item1.compare(item2);
  }
  if (item1 < item2) {
    return -1;
  }
  if (item1 > item2) {
    return 1;
  }
  return 0;
}

function linearContains(iterable, key) {
  for (let item of iterable) {
    let identical = false;
    if (typeof item.equal === 'function') {
      // Objects with an equal() method
      identical = item.equal(key);
    } else {
      // All other kinds of values
      identical = (item == key);
    }
    if (identical) {
      return true;
    }
  }
  return false;
}

function binaryContains(sequence, key) {
  let low = 0;
  let high = sequence.length - 1;
  while (low < high) {
    let mid = Math.floor((low + high) / 2);
    if (compare(sequence[mid], key) < 0) {
      low = mid + 1;
    } else if (compare(sequence[mid], key) > 0) {
      high = mid - 1;
    } else {
      return true;
    }
  }
  return false;
}

class Node {
  constructor(state, nParent, cost, heuristic) {
    this.state = state;
    this.nParent = nParent ? nParent : null;
    this.cost = cost ? cost : 0.0;
    this.heuristic = heuristic ? heuristic : 0.0;
  }

  compare(other) {
    return (this.cost + this.heuristic) - (other.cost + other.heuristic);
  }

  toString() {
    let result = 'Node { state: ' + this.state + ', parent: ';
    result += this.nParent ? 'Node' : 'null';
    result += ', cost: ' + this.cost;
    result += ', heuristic: ' + this.heuristic + '}';
    return result;
  }
}

class Stack {
  constructor() {
    this.container = [];
  }

  empty() {
    return this.container.length == 0;
  }

  push(item) {
    this.container.push(item);
  }

  pop(item) {
    return this.container.pop();
  }

  toString() {
    return this.container.join(', ');
  }
}

function find(set, item) {
  if (typeof item.equal === 'function') {
    for (let i of set) {
      if (item.equal(i)) {
        return true;
      }
    }
    return false;
  }
  return set.indexOf(item) > -1;
}

function dfs(initial, goalTest, successors) {
  // frontier is where we've yet to go
  let frontier = new Stack();
  frontier.push(new Node(initial, null));
  // explored is where we've been
  let explored = [initial];

  // keep going while there is more to explore
  while (!frontier.empty()) {
    let currentNode = frontier.pop();
    let currentState = currentNode.state;
    // if we found the goal, we're done
    if (goalTest(currentState)) {
      return currentNode;
    }
    // Check where we can go next and haven't explored
    for (let child of successors(currentState)) {
      if (find(explored, child)) {
        continue; // skip children we already explored
      }
      explored.push(child);
      frontier.push(new Node(child, currentNode));
    }
  }
  return null; // went through everything and never found a goal
}

function nodeToPath(node) {
  let path = [node.state];
  // work backwards from end to front
  while (node.nParent != null) {
    node = node.nParent;
    path.push(node.state);
  }
  path.reverse();
  return path;
}

class Queue extends Stack {
  pop() {
    return this.container.shift();
  }
}

function bfs(initial, goalTest, successors) {
  // frontier is where we've yet to go
  let frontier = new Queue();
  frontier.push(new Node(initial, null));
  // explored is where we've been
  let explored = [initial];

  // keep going while there is more to explore
  while (!frontier.empty()) {
    let currentNode = frontier.pop();
    let currentState = currentNode.state;
    // if we found the goal, we're done
    if (goalTest(currentState)) {
      return currentNode;
    }
    // Check where we can go next and haven't explored
    for (let child of successors(currentState)) {
      if (find(explored, child)) {
        continue; // skip children we already explored
      }
      explored.push(child);
      frontier.push(new Node(child, currentNode));
    }
  }
  return null; // went through everything and never found a goal
}

class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  empty() {
    return this.heap.length == 0;
  }

  push(node) {
    this.heap.push(node);
    let index = this.heap.length - 1;
    while (index !== 0 && this.heap[index].compare(this.heap[this.nParent(index)]) < 0) {
      this.swap(index, this.nParent(index));
      index = this.nParent(index);
    }
  }

  pop() {
    let root = this.heap.shift();
    this.heap.unshift(this.heap[this.heap.length - 1]);
    this.heap.pop();
    this.heapify(0);
    return root;
  }

  // Helper methods
  leftChild(index) {
    return index * 2 + 1;
  }

  rightChild(index) {
    return index * 2 + 2;
  }

  nParent(index) {
    return Math.floor((index - 1) / 2);
  }

  swap(index1, index2) {
    let tmp = this.heap[index1];
    this.heap[index1] = this.heap[index2];
    this.heap[index2] = tmp;
  }

  heapify(index) {
    let left = this.leftChild(index);
    let right = this.rightChild(index);
    let smallest = index;
    if (left < this.heap.length && this.heap[smallest].compare(this.heap[left]) > 0) {
      smallest = left;
    }
    if (right < this.heap.length && this.heap[smallest].compare(this.heap[right]) < 0) {
      smallest = right;
    }
    if (smallest != index) {
      this.swap(smallest, index);
      this.heapify(smallest);
    }
  }
}

function hash(value) {
  return JSON.stringify(value);
}

function astar(initial, goalTest, successors, heuristic) {
  // frontier is where we've yet to go
  let frontier = new PriorityQueue();
  frontier.push(new Node(initial, null, 0.0, heuristic(initial)));
  // explored is where we've been
  let explored = {};
  explored[hash(initial)] = 0.0;

  // keep going while there is more to explore
  while (!frontier.empty()) {
    let currentNode = frontier.pop();
    let currentState = currentNode.state;
    // if we found the goal, we're done
    if (goalTest(currentState)) {
      return currentNode;
    }
    // Check where we can go next and haven't explored
    for (let child of successors(currentState)) {
      let newCost = currentNode.cost + 1; // 1 assumes a grid, need a cost function for more sophisticated apps
      if (Object.keys(explored).indexOf(hash(child)) == -1 || explored[hash(child)] > newCost) {
        explored[hash(child)] = newCost;
        frontier.push(new Node(child, currentNode, newCost, heuristic(child)));
      }
    }
  }
  return null; // went through everything and never found a goal
}

let _exports = {
  compare: compare,
  linearContains: linearContains,
  binaryContains: binaryContains,
  Stack: Stack,
  Node: Node,
  dfs: dfs,
  nodeToPath: nodeToPath,
  Queue: Queue,
  bfs: bfs,
  PriorityQueue: PriorityQueue,
  astar: astar
};

if (typeof window === 'undefined') {
  module.exports = _exports;
} else {
  gs = _exports;
}
