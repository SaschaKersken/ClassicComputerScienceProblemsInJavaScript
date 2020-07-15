if (typeof window === 'undefined') {
  km = require(__dirname + '/kmeans.js');
  util = require(__dirname + '/../util.js');
}

let point1 = new km.DataPoint([2.0, 1.0, 1.0]);
let point2 = new km.DataPoint([2.0, 2.0, 5.0]);
let point3 = new km.DataPoint([3.0, 1.5, 2.5]);
let kMeansTest = new km.KMeans(2, [point1, point2, point3]);
let testClusters = kMeansTest.run();
for (let [index, cluster] of Object.entries(testClusters)) {
  util.out("Cluster " + index + ": " + cluster.points.map((p) => '[' + p._originals.join(', ') + ']'));
}
