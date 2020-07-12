class Edge {
  constructor(u, v) {
    this.u = u; // the "from" vertex
    this.v = v; // the "to" vertex
  }

  reversed() {
    return new Edge(this.v, this.u);
  }

  toString() {
    return this.u + ' -> ' + this.v;
  }
}

class Graph {
  constructor(vertices) {
    this.vertices = vertices ? vertices : [];
    this.edges = vertices.map((v) => []);
  }

  vertexCount() {
    return this.vertices.length;
  }

  edgeCount() {
    return this.edges.reduce((edges, s) => s + edges.length);
  }

  // Add a vertex to the graph and return its index
  addVertex(vertex) {
    this.vertices.push(vertex);
    this.edges.push([]);
    return this.vertexCount() - 1;
  }

  // This is an undirected graph,
  // so we always add edges in both directions
  addEdge(edge) {
    this.edges[edge.u].push(edge);
    this.edges[edge.v].push(edge.reversed());
  }

  // Add an edge using vertex indices (convenience method)
  addEdgeByIndices(u, v) {
    let edge = new Edge(u, v);
    this.addEdge(edge);
  }

  // Add an edge by looking up vertex indices (convenience method)
  addEdgeByVertices(first, second) {
    let u = this.vertices.indexOf(first);
    let v = this.vertices.indexOf(second);
    this.addEdgeByIndices(u, v);
  }

  // Find the vertex at a specific index
  vertexAt(index) {
    return this.vertices[index];
  }

  // Find the index of a vertex in the graph
  indexOf(vertex) {
    return this.vertices.indexOf(vertex);
  }

  // Find the vertices that a vertex at some index is connected to
  neighborsForIndex(index) {
    return this.edges[index].map((e) => this.vertexAt(e.v));
  }

  // Lookup a vertice's index and find its neighbors (convenience method)
  neighborsForVertex(vertex) {
    return this.neighborsForIndex(this.indexOf(vertex));
  }

  // Return all of the edges associated with a vertex at some index
  edgesForIndex(index) {
    return this.edges[index];
  }

  // Lookup the index of a vertex and return its edges (convenience method)
  edgesForVertex(vertex) {
    return this.edgesForIndex(this.indexOf(vertex));
  }

  // Make it easy to pretty-print a Graph
  toString() {
    let desc = "";
    for (let i = 0; i < this.vertexCount(); i++) {
      desc += this.vertexAt(i) + ' -> ' + this.neighborsForIndex(i) + "\n";
    }
    return desc;
  }
}

let _graphExports = {
  Edge: Edge,
  Graph: Graph
};

if (typeof window === 'undefined') {
  module.exports = _graphExports;
} else {
  graph = _graphExports;
}
