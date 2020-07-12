if (typeof window === 'undefined') {
  gs = require(__dirname + '/../chapter2/generic_search.js');
  wg = require(__dirname + '/weighted_graph.js');
}

class DijkstraNode {
  constructor(vertex, distance) {
    this.vertex = vertex;
    this.distance = distance;
  }

  compare(other) {
    return this.distance - other.distance;
  }
}

function dijkstra(wGraph, root) {
  let first = wGraph.indexOf(root); // find starting index
  // distances are unknown at first
  let distances = [];
  for (let i = 0; i < wGraph.vertexCount(); i++) {
    distances.push(null);
  }
  distances[first] = 0; // the root is 0 away from the root
  let pathDict = {}; // how we got to each vertex
  let pq = new gs.PriorityQueue();
  pq.push(new DijkstraNode(first, 0));
  while (!pq.empty()) {
    let u = pq.pop().vertex; // explore the next closest vertex
    let distU = distances[u]; // should already have seen it
    // look at every edge/vertex from the vertex in question
    for (let we of wGraph.edgesForIndex(u)) {
      // the old distance to this vertex
      let distV = distances[we.v];
      // no old distance or found shorter path
      if (distV == null || distV > we.weight + distU) {
        // update distance to this vertex
        distances[we.v] = we.weight + distU;
        // update the edge on the shortest path of this vertex
        pathDict[we.v] = we;
        // explore it soon
        pq.push(new DijkstraNode(we.v, we.weight + distU));
      }
    }
  }
  return [distances, pathDict];
}

// Helper function to get easier access to dijkstra results
function distanceArrayToVertexDict(wGraph, distances) {
  let distanceDict = {};
  for (let i = 0; i < distances.length; i++) {
    distanceDict[wGraph.vertexAt(i)] = distances[i];
  }
  return distanceDict;
}

// Takes a dictionary of edges to reach each node and returns a list of
// edges that goes from `start` to `end`
function pathDictToPath(start, end, pathDict) {
  if (Object.keys(pathDict).length == 0) {
    return [];
  }
  let edgePath = [];
  let e = pathDict[end];
  edgePath.push(e);
  while (e.u != start) {
    e = pathDict[e.u];
    edgePath.push(e);
  }
  return edgePath.reverse();
}

let _dnExports = {
  DijkstraNode: DijkstraNode,
  dijkstra: dijkstra,
  distanceArrayToVertexDict: distanceArrayToVertexDict,
  pathDictToPath
};

if (typeof window === 'undefined') {
  module.exports = _dnExports;
} else {
  dn = _dnExports;
}
