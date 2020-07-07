if (typeof window === 'undefined') {
  gs = require(__dirname + '/generic_search.js');
  util = require(__dirname + '/../util.js');
}

const MAX_NUM = 3;

class MCState {
  constructor(missionaries, cannibals, boat) {
    this.wm = missionaries; // west bank missionaries
    this.wc = cannibals; // west bank cannibals
    this.em = MAX_NUM - this.wm; // east bank missionaries
    this.ec = MAX_NUM - this.wc; // east bank cannibals
    this.boat = boat; // Boat on west bank?
  }

  toString() {
    let result = "On the west bank there are " + this.wm + " missionaries ";
    result += "and " + this.wc + " cannibals.\n";
    result += "On the east bank there are " + this.em + " missionaries ";
    result += "and " + this.ec + " cannibals.\n";
    result += "The boat is on the " + (this.boat ? 'west' : 'east') + " bank.";
    return result;
  }

  goalTest() {
    return this.isLegal() && this.em === MAX_NUM && this.ec === MAX_NUM;
  }

  isLegal() {
    if (this.wm < this.wc && this.wm > 0) {
      return false;
    }
    if (this.em < this.ec && this.em > 0) {
      return false;
    }
    return true;
  }

  successors() {
    let sucs = [];
    if (this.boat) { // boat on west bank
      if (this.wm > 1) {
        sucs.push(new MCState(this.wm - 2, this.wc, !this.boat));
      }
      if (this.wm > 0) {
        sucs.push(new MCState(this.wm - 1, this.wc, !this.boat));
      }
      if (this.wc > 1) {
        sucs.push(new MCState(this.wm, this.wc - 2, !this.boat));
      }
      if (this.wc > 0) {
        sucs.push(new MCState(this.wm, this.wc - 1, !this.boat));
      }
      if (this.wc > 0 && this.wm > 0) {
        sucs.push(new MCState(this.wm - 1, this.wc - 1, !this.boat));
      }
    } else { // boat on east bank
      if (this.em > 1) {
        sucs.push(new MCState(this.wm + 2, this.wc, !this.boat));
      }
      if (this.em > 0) {
        sucs.push(new MCState(this.wm + 1, this.wc, !this.boat));
      }
      if (this.ec > 1) {
        sucs.push(new MCState(this.wm, this.wc + 2, !this.boat));
      }
      if (this.ec > 0) {
        sucs.push(new MCState(this.wm, this.wc + 1, !this.boat));
      }
      if (this.ec > 0 && this.em > 0) {
        sucs.push(new MCState(this.wm + 1, this.wc + 1, !this.boat));
      }
    }
    return sucs.filter((x) => x.isLegal());
  }
}

function displaySolution(path) {
  if (path.length == 0) { // sanity check
    return;
  }
  let oldState = path.shift();
  util.out(oldState.toString());
  for (currentState of path) {
    if (currentState.boat) {
      let mDiff = oldState.em - currentState.em;
      let cDiff = oldState.ec - currentState.ec;
      util.out(mDiff + " missionaries and " + cDiff + " cannibals moved from the east bank to the west bank.");
    } else {
      let mDiff = oldState.wm - currentState.wm;
      let cDiff = oldState.wc - currentState.wc;
      util.out(mDiff + " missionaries and " + cDiff + " cannibals moved from the west bank to the east bank.");
    }
    util.out(currentState.toString());
    oldState = currentState;
  }
}

let start = new MCState(MAX_NUM, MAX_NUM, true);
let solution = gs.bfs(start, (mc) => mc.goalTest(), (mc) => mc.successors());
if (solution == null) {
  util.out("No solution found!");
} else {
  let path = gs.nodeToPath(solution);
  displaySolution(path);
}
