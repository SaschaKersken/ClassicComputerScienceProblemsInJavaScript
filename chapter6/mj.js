if (typeof window === 'undefined') {
  util = require(__dirname + '/../util.js');
  km = require(__dirname + '/kmeans.js');
}

class Album extends km.DataPoint {
  constructor(name, year, length, tracks) {
    super([length, tracks]);
    this.name = name;
    this.year = year;
    this.length = length;
    this.tracks = tracks;
  }
}

let albums = [new Album("Got to Be There", 1972, 35.45, 10), new Album("Ben", 1972, 31.31, 10),
  new Album("Music & Me", 1973, 32.09, 10), new Album("Forever, Michael", 1975, 33.36, 10),
  new Album("Off the Wall", 1979, 42.28, 10), new Album("Thriller", 1982, 42.19, 9),
  new Album("Bad", 1987, 48.16, 10), new Album("Dangerous", 1991, 77.03, 14),
  new Album("HIStory: Past, Present and Future, Book I", 1995, 148.58, 30), new Album("Invincible", 2001, 77.05, 16)];
let kmeans = new km.KMeans(2, albums);
let clusters = kmeans.run();
for (let [index, cluster] of Object.entries(clusters)) {
  util.out("Cluster " + index + " Avg length " + cluster.centroid.dimensions[0] + " Avg tracks " + cluster.centroid.dimensions[1] + cluster.points.map((p) => "\n" + p.name + " (year " + p.year + ", length " + p.length + ", tracks: " + p.tracks + ")"));
}
