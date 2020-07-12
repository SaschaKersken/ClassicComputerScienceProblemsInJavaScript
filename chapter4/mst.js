if (typeof window === 'undefined') {
  graph = require(__dirname + '/graph.js');
  wg = require(__dirname + '/weighted_graph.js');
  gs = require(__dirname + '/../chapter2/generic_search.js');
  util = require(__dirname + '/../util.js');
}

function totalWeight(wp) {
  let result = 0;
  for (let edge of wp) {
    result += parseInt(edge.weight);
  }
  return result;
}

function getMst(wGraph, start) {
  if (start == null) {
    start = 0;
  }
  if (start > wGraph.vertexCount() - 1 || start < 0) {
    return null;
  }
  let result = [];
  let pq = new gs.PriorityQueue();
  let visited = [];  // where we've been
  for (let i = 0; i < wGraph.vertexCount(); i++) {
    visited.push(false);
  }

  function visit(index) {
    visited[index] = true;
    for (let edge of wGraph.edgesForIndex(index)) {
      // add all edges coming from here to pq
      if (!visited[edge.v]) {
        pq.push(edge);
      }
    }
  }

  visit(start); // the first vertex is where everything begins

  while (!pq.empty()) { // keep going while there are edges to process
    let edge = pq.pop();
    if (visited[edge.v]) {
      continue; // don't ever revisit
    }
    // this is the current smallest, so add it to solution
    result.push(edge);
    visit(edge.v); // visit where this connects
  }

  return result;
}

function printWeightedPath(wGraph, wp) {
  for (let edge of wp) {
    util.out(wGraph.vertexAt(edge.u) + ' ' + edge.weight + '> ' + wGraph.vertexAt(edge.v));
  }
  util.out("Total Weight: " + totalWeight(wp));
}

let _mstExports = {
  totalWeight: totalWeight,
  getMst: getMst,
  printWeightedPath: printWeightedPath
};

if (typeof window === 'undefined') {
  module.exports = _mstExports;
} else {
  mst = _mstExports;
}
