if (typeof window === 'undefined') {
  util = require(__dirname + '/../util.js');
}

class DataPoint {
  constructor(initial) {
    this._originals = initial.slice();
    this.dimensions = initial.slice();
  }

  numDimensions() {
    return this.dimensions.length;
  }

  distance(other) {
    let combined = this.dimensions.map((value, index) => [value, other.dimensions[index]]);
    let differences = combined.map((e) => (e[0] - e[1]) ** 2);
    return Math.sqrt(differences.reduce((s, value) => s + value));
  }

  toString() {
    return this._originals.join(', ');
  }
}

// Statistic helper function: mean
function mean(data) {
  if (data.length == 0) {
    return 0;
  }
  return data.reduce((s, value) => s + value) / data.length;
}

// Statistic helper function: standard deviation
function stdev(data) {
  if (data.length == 0) {
    return 0;
  }
  let mu = mean(data);
  let diffs = data.map((x) => (x - mu) ** 2);
  return Math.sqrt(diffs.reduce((s, value) => s + value) / data.length);
}

function zscores(original) {
  let avg = mean(original);
  let std = stdev(original);
  if (std == 0) { // return all zeros if there is no variation
    return original.map((v) => 0);
  }
  return original.map((x) => (x - avg) / std);
}

class Cluster {
  constructor(points, centroid) {
    this.points = points;
    this.centroid = centroid;
  }
}

class KMeans {
  constructor(k, points) {
    if (k < 1) { // k-means can't do negative or zero clusters
      throw "k must be >= 1";
    }
    this.points = points;
    this.zscoreNormalize();
    // initialize empty clusters with random centroids
    this.clusters = [];
    for (let i = 0; i < k; i++) {
      let randPoint = this.randomPoint();
      let cluster = new Cluster([], randPoint);
      this.clusters.push(cluster);
    }
  }

  centroids() {
    return this.clusters.map((x) => x.centroid);
  }

  dimensionSlice(dimension) {
    return this.points.map((x) => x.dimensions[dimension]);
  }

  zscoreNormalize() {
    let zscored = this.points.map((x) => []);
    for (let dimension = 0; dimension < this.points[0].numDimensions(); dimension++) {
      let dimensionSlice = this.dimensionSlice(dimension);
      for (let [index, zscore] of Object.entries(zscores(dimensionSlice))) {
        zscored[index].push(zscore);
      }
    }
    for (let i = 0; i < this.points.length; i++) {
      this.points[i].dimensions = zscored[i];
    }
  }

  randomPoint() {
    let randDimensions = [];
    for (let dimension = 0; dimension < this.points[0].numDimensions(); dimension++) {
      let values = this.dimensionSlice(dimension);
      let min = Math.min(...values);
      let max = Math.max(...values);
      let randValue = Math.random() * (max - min) + min;
      randDimensions.push(randValue);
    }
    return new DataPoint(randDimensions);
  }

  // Find the closest cluster centroid to each point and assign the point to that cluster
  assignClusters() {
    for (let point of this.points) {
      let lCentroids = this.centroids().slice();
      lCentroids.sort((c1, c2) => c1.distance(point) - c2.distance(point));
      let closest = lCentroids[0];
      let idx = this.centroids().indexOf(closest);
      let cluster = this.clusters[idx];
      cluster.points.push(point);
    }
  }

  // Find the center of each cluster and move the centroid to there
  generateCentroids() {
    for (let cluster of this.clusters) {
      if (cluster.points.length == 0) { // keep the same centroid if no points
        continue;
      }
      let means = [];
      for (let dimension = 0; dimension < cluster.points[0].numDimensions(); dimension++) {
        let dimensionSlice = cluster.points.map((p) => p.dimensions[dimension]);
        means.push(mean(dimensionSlice));
      }
      cluster.centroid = new DataPoint(means);
    }
  }

  run(maxIterations) {
    if (!maxIterations) {
      maxIterations = 100;
    }
    for (let iteration = 0; iteration < maxIterations; iteration++) {
      for (let cluster of this.clusters) { // clear all clusters
        cluster.points = [];
      }
      this.assignClusters(); // find cluster each point is closest to
      let oldCentroids = this.centroids().slice(); // record
      this.generateCentroids(); // find new centroids
      if (oldCentroids == this.centroids) { // have centroids moved?
        util.out("Converged after " + iteration + " iterations");
        return this.clusters;
      }
    }
    return this.clusters;
  }
}

let _kmExports = {
  DataPoint: DataPoint,
  mean: mean,
  stdev: stdev,
  zscores: zscores,
  KMeans: KMeans
};

if (typeof window === 'undefined') {
  module.exports = _kmExports;
} else {
  km = _kmExports;
}
