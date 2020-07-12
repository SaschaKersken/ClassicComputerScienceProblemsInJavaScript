if (typeof window === 'undefined') {
  graph = require(__dirname + '/graph.js');
  gs = require(__dirname + '/../chapter2/generic_search.js');
  util = require(__dirname + '/../util.js');
}

// test basic Graph construction;
let cityGraph = new graph.Graph(["Seattle", "San Francisco", "Los Angeles", "Riverside", "Phoenix", "Chicago", "Boston", "New York", "Atlanta", "Miami", "Dallas", "Houston", "Detroit", "Philadelphia", "Washington"]);
cityGraph.addEdgeByVertices("Seattle", "Chicago");
cityGraph.addEdgeByVertices("Seattle", "San Francisco");
cityGraph.addEdgeByVertices("San Francisco", "Riverside");
cityGraph.addEdgeByVertices("San Francisco", "Los Angeles");
cityGraph.addEdgeByVertices("Los Angeles", "Riverside");
cityGraph.addEdgeByVertices("Los Angeles", "Phoenix");
cityGraph.addEdgeByVertices("Riverside", "Phoenix");
cityGraph.addEdgeByVertices("Riverside", "Chicago");
cityGraph.addEdgeByVertices("Phoenix", "Dallas");
cityGraph.addEdgeByVertices("Phoenix", "Houston");
cityGraph.addEdgeByVertices("Dallas", "Chicago");
cityGraph.addEdgeByVertices("Dallas", "Atlanta");
cityGraph.addEdgeByVertices("Dallas", "Houston");
cityGraph.addEdgeByVertices("Houston", "Atlanta");
cityGraph.addEdgeByVertices("Houston", "Miami");
cityGraph.addEdgeByVertices("Atlanta", "Chicago");
cityGraph.addEdgeByVertices("Atlanta", "Washington");
cityGraph.addEdgeByVertices("Atlanta", "Miami");
cityGraph.addEdgeByVertices("Miami", "Washington");
cityGraph.addEdgeByVertices("Chicago", "Detroit");
cityGraph.addEdgeByVertices("Detroit", "Boston");
cityGraph.addEdgeByVertices("Detroit", "Washington");
cityGraph.addEdgeByVertices("Detroit", "New York");
cityGraph.addEdgeByVertices("Boston", "New York");
cityGraph.addEdgeByVertices("New York", "Philadelphia");
cityGraph.addEdgeByVertices("Philadelphia", "Washington");
util.out(cityGraph.toString());

// Reuse BFS from Chapter 2 on cityGraph
let bfsResult = gs.bfs("Boston", (x) => x == "Miami", (v) => cityGraph.neighborsForVertex(v));
if (bfsResult == null) {
  util.out("No solution found using breadth-first search!");
} else {
  let path = gs.nodeToPath(bfsResult);
  util.out("Path from Boston to Miami:");
  util.out(path);
}
