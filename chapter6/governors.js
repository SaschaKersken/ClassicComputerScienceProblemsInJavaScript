if (typeof window === 'undefined') {
  util = require(__dirname + '/../util.js');
  km = require(__dirname + '/kmeans.js');
}

class Governor extends km.DataPoint {
  constructor(longitude, age, state) {
    super([longitude, age]);
    this.longitude = longitude;
    this.age = age;
    this.state = state;
  }
}

let governors = [new Governor(-86.79113, 72, "Alabama"), new Governor(-152.404419, 66, "Alaska"),
                 new Governor(-111.431221, 53, "Arizona"), new Governor(-92.373123, 66, "Arkansas"),
                 new Governor(-119.681564, 79, "California"), new Governor(-105.311104, 65, "Colorado"),
                 new Governor(-72.755371, 61, "Connecticut"), new Governor(-75.507141, 61, "Delaware"),
                 new Governor(-81.686783, 64, "Florida"), new Governor(-83.643074, 74, "Georgia"),
                 new Governor(-157.498337, 60, "Hawaii"), new Governor(-114.478828, 75, "Idaho"),
                 new Governor(-88.986137, 60, "Illinois"), new Governor(-86.258278, 49, "Indiana"),
                 new Governor(-93.210526, 57, "Iowa"), new Governor(-96.726486, 60, "Kansas"),
                 new Governor(-84.670067, 50, "Kentucky"), new Governor(-91.867805, 50, "Louisiana"),
                 new Governor(-69.381927, 68, "Maine"), new Governor(-76.802101, 61, "Maryland"),
                 new Governor(-71.530106, 60, "Massachusetts"), new Governor(-84.536095, 58, "Michigan"),
                 new Governor(-93.900192, 70, "Minnesota"), new Governor(-89.678696, 62, "Mississippi"),
                 new Governor(-92.288368, 43, "Missouri"), new Governor(-110.454353, 51, "Montana"),
                 new Governor(-98.268082, 52, "Nebraska"), new Governor(-117.055374, 53, "Nevada"),
                 new Governor(-71.563896, 42, "New Hampshire"), new Governor(-74.521011, 54, "New Jersey"),
                 new Governor(-106.248482, 57, "New Mexico"), new Governor(-74.948051, 59, "New York"),
                 new Governor(-79.806419, 60, "North Carolina"), new Governor(-99.784012, 60, "North Dakota"),
                 new Governor(-82.764915, 65, "Ohio"), new Governor(-96.928917, 62, "Oklahoma"),
                 new Governor(-122.070938, 56, "Oregon"), new Governor(-77.209755, 68, "Pennsylvania"),
                 new Governor(-71.51178, 46, "Rhode Island"), new Governor(-80.945007, 70, "South Carolina"),
                 new Governor(-99.438828, 64, "South Dakota"), new Governor(-86.692345, 58, "Tennessee"),
new Governor(-97.563461, 59, "Texas"), new Governor(-111.862434, 70, "Utah"),
                 new Governor(-72.710686, 58, "Vermont"), new Governor(-78.169968, 60, "Virginia"),
                 new Governor(-121.490494, 66, "Washington"), new Governor(-80.954453, 66, "West Virginia"),
                 new Governor(-89.616508, 49, "Wisconsin"), new Governor(-107.30249, 55, "Wyoming")];
let kmeans = new km.KMeans(2, governors);
let govClusters = kmeans.run();
for (let [index, cluster] of Object.entries(govClusters)) {
  util.out("Cluster " + index + ": " + cluster.points.map((p) => "\n[" + 'State: ' + p.state + ', Longitude: ' + p.longitude + ', Age: ' + p.age + ']'));
}
