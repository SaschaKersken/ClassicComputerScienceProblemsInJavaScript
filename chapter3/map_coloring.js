if (typeof window === 'undefined') {
  csp = require(__dirname + '/csp.js');
  util = require(__dirname + '/../util.js');
}

class MapColoringConstraint extends csp.Constraint {
  constructor(place1, place2) {
    super([place1, place2]);
    this.place1 = place1;
    this.place2 = place2;
  }

  satisfied(assignment) {
    // If either place is not in the assignment then it is not
    // yet possible for their colors to be conflicting
    if (Object.keys(assignment).indexOf(this.place1) == -1 || Object.keys(assignment).indexOf(this.place2) == -1) {
      return true;
    }
    // check the color assigned to place1 is not the same as the
    // color assigned to place2
    return assignment[this.place1] != assignment[this.place2];
  }
}

let variables = ["Western Australia", "Northern Territory", "South Australia",
  "Queensland", "New South Wales", "Victoria", "Tasmania"
];
let domains = {};
for (variable of variables) {
  domains[variable] = ["red", "green", "blue"];
}
let mCsp = new csp.CSP(variables, domains);
mCsp.addConstraint(new MapColoringConstraint("Western Australia", "Northern Territory"))
mCsp.addConstraint(new MapColoringConstraint("Western Australia", "South Australia"))
mCsp.addConstraint(new MapColoringConstraint("South Australia", "Northern Territory"))
mCsp.addConstraint(new MapColoringConstraint("Queensland", "Northern Territory"))
mCsp.addConstraint(new MapColoringConstraint("Queensland", "South Australia"))
mCsp.addConstraint(new MapColoringConstraint("Queensland", "New South Wales"))
mCsp.addConstraint(new MapColoringConstraint("New South Wales", "South Australia"))
mCsp.addConstraint(new MapColoringConstraint("Victoria", "South Australia"))
mCsp.addConstraint(new MapColoringConstraint("Victoria", "New South Wales"))
mCsp.addConstraint(new MapColoringConstraint("Victoria", "Tasmania"))
let solution = mCsp.backtrackingSearch();
if (solution == null) {
  util.out("No solution found!");
} else {
  util.out(solution);
}
