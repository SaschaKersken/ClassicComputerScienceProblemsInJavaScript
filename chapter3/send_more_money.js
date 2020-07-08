if (typeof window === 'undefined') {
  csp = require(__dirname + '/csp.js');
  util = require(__dirname + '/../util.js');
}

class SendMoreMoneyConstraint extends csp.Constraint {
  constructor(letters) {
    super(letters);
    this.letters = letters;
  }

  satisfied(assignment) {
    // if there are duplicate values then it's not a solution
    if (Object.values(assignment).filter((value, index, self) => self.indexOf(value) === index).length < Object.keys(assignment).length) {
      return false;
    }

    // if all variables have been assigned, check if it adds correctly
    if (Object.keys(assignment).length == this.letters.length) {
      let s = assignment["S"];
      let e = assignment["E"];
      let n = assignment["N"];
      let d = assignment["D"];
      let m = assignment["M"];
      let o = assignment["O"];
      let r = assignment["R"];
      let y = assignment["Y"];
      let send = s * 1000 + e * 100 + n * 10 + d;
      let more = m * 1000 + o * 100 + r * 10 + e;
      let money = m * 10000 + o * 1000 + n * 100 + e * 10 + y;
      return send + more == money;
    }
    return true; // no conflict
  }
}

let letters = ["S", "E", "N", "D", "M", "O", "R", "Y"];
let possibleDigits = {};
for (let letter of letters) {
  possibleDigits[letter] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
}
possibleDigits["M"] = [1]; // so we don't get answers starting with a 0
let sCsp = new csp.CSP(letters, possibleDigits);
sCsp.addConstraint(new SendMoreMoneyConstraint(letters));
let solution = sCsp.backtrackingSearch();
if (solution == null) {
  util.out("No solution found!");
} else {
  util.out(solution);
}
