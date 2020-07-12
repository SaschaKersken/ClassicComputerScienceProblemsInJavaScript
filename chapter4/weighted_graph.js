if (typeof window === 'undefined') {
  graph = require(__dirname + '/graph.js');
}

class WeightedEdge extends graph.Edge {
  constructor(u, v, weight) {
    super(u, v);
    this.weight = weight;
  }

  reversed() {
    return new WeightedEdge(this.v, this.u, this.weight);
  }

  // so that we can order edges by weight to find the minimum weight edge
  compare(other) {
    return this.weight - other.weight;
  }

  toString() {
    return this.u + ' ' + this.weight + '> ' + this.v;
  }
}

class WeightedGraph extends graph.Graph {
  constructor(vertices) {
    super(vertices);
  }

  addEdgeByIndices(u, v, weight) {
    let edge = new WeightedEdge(u, v, weight);
    this.addEdge(edge); // call superclass version
  }

  addEdgeByVertices(first, second, weight) {
    let u = this.vertices.indexOf(first);
    let v = this.vertices.indexOf(second);
    this.addEdgeByIndices(u, v, weight);
  }

  neighborsForIndexWithWeights(index) {
    let distanceTuples = [];
    for (let edge of this.edgesForIndex(index)) {
      distanceTuples.push([this.vertexAt(edge.v), edge.weight]);
    }
    return distanceTuples;
  }

  toString() {
    let desc = "";
    for (let i = 0; i < this.vertexCount(); i++) {
      desc += this.vertexAt(i) + ' -> ';
      let v;
      let weight;
      for ([v, weight] of this.neighborsForIndexWithWeights(i)) {
        desc += v + ' (' + weight + ') ';
      }
      desc += "\n";
    }
    return desc;
  }
}

let _wgExports = {
  WeightedEdge: WeightedEdge,
  WeightedGraph: WeightedGraph
};

if (typeof window === 'undefined') {
  module.exports = _wgExports;
} else {
  wg = _wgExports;
}
