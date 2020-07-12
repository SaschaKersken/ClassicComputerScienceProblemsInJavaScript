if (typeof window === 'undefined') {
  wg = require(__dirname + '/weighted_graph.js');
  mst = require(__dirname + '/mst.js');
  dn = require(__dirname + '/dijkstra.js');
  util = require(__dirname + '/../util.js');
}

let cityGraph2 = new wg.WeightedGraph(["Seattle", "San Francisco", "Los Angeles", "Riverside", "Phoenix", "Chicago", "Boston", "New York", "Atlanta", "Miami", "Dallas", "Houston", "Detroit", "Philadelphia", "Washington"]);
cityGraph2.addEdgeByVertices("Seattle", "Chicago", 1737);
cityGraph2.addEdgeByVertices("Seattle", "San Francisco", 678);
cityGraph2.addEdgeByVertices("San Francisco", "Riverside", 386);
cityGraph2.addEdgeByVertices("San Francisco", "Los Angeles", 348);
cityGraph2.addEdgeByVertices("Los Angeles", "Riverside", 50);
cityGraph2.addEdgeByVertices("Los Angeles", "Phoenix", 357);
cityGraph2.addEdgeByVertices("Riverside", "Phoenix", 307);
cityGraph2.addEdgeByVertices("Riverside", "Chicago", 1704);
cityGraph2.addEdgeByVertices("Phoenix", "Dallas", 887);
cityGraph2.addEdgeByVertices("Phoenix", "Houston", 1015);
cityGraph2.addEdgeByVertices("Dallas", "Chicago", 805);
cityGraph2.addEdgeByVertices("Dallas", "Atlanta", 721);
cityGraph2.addEdgeByVertices("Dallas", "Houston", 225);
cityGraph2.addEdgeByVertices("Houston", "Atlanta", 702);
cityGraph2.addEdgeByVertices("Houston", "Miami", 968);
cityGraph2.addEdgeByVertices("Atlanta", "Chicago", 588);
cityGraph2.addEdgeByVertices("Atlanta", "Washington", 543);
cityGraph2.addEdgeByVertices("Atlanta", "Miami", 604);
cityGraph2.addEdgeByVertices("Miami", "Washington", 923);
cityGraph2.addEdgeByVertices("Chicago", "Detroit", 238);
cityGraph2.addEdgeByVertices("Detroit", "Boston", 613);
cityGraph2.addEdgeByVertices("Detroit", "Washington", 396);
cityGraph2.addEdgeByVertices("Detroit", "New York", 482);
cityGraph2.addEdgeByVertices("Boston", "New York", 190);
cityGraph2.addEdgeByVertices("New York", "Philadelphia", 81);
cityGraph2.addEdgeByVertices("Philadelphia", "Washington", 123);

let distances;
let pathDict;
[distances, pathDict] = dn.dijkstra(cityGraph2, "Los Angeles");
let nameDistance = dn.distanceArrayToVertexDict(cityGraph2, distances);
util.out("Distances from Los Angeles:");
let key;
let value;
for ([key, value] of Object.entries(nameDistance)) {
  util.out(key + ": " + value);
}

util.out("Shortest path from Los Angeles to Boston:");
let path = dn.pathDictToPath(cityGraph2.indexOf("Los Angeles"), cityGraph2.indexOf("Boston"), pathDict);
mst.printWeightedPath(cityGraph2, path);
