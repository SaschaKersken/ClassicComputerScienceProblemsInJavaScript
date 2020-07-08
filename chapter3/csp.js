// Base class for all constraints
class Constraint {
  // The variables that the constraint is between
  constructor(variables) {
    this.variables = variables;
  }

  // Must be overridden by subclasses
  satisfied(assignment) {
    return false;
  }
}

// A constraint satisfaction problem consists of variables of type V
// that have ranges of values known as domains of type D and constraints
// that determine whether a particular variable's domain selection is valid
class CSP {
  constructor(variables, domains) {
    this.variables = variables; // variables to be constrained
    this.domains = domains; // domain of each variable
    this.constraints = {};
    for (let variable of this.variables) {
      this.constraints[variable] = [];
      if (!member(Object.keys(this.domains), variable)) {
        throw "Every variable should have a domain assigned to it.";
      }
    }
  }

  addConstraint(constraint) {
    for (let variable of constraint.variables) {
      if (!member(this.variables, variable)) {
        throw "Variable in constraint not in CSP";
      } else {
        this.constraints[variable].push(constraint);
      }
    }
  }

  // Check if the value assignment is consistent by checking all constraints
  // for the given variable against it
  consistent(variable, assignment) {
    for (let constraint of this.constraints[variable]) {
      if (!constraint.satisfied(assignment)) {
        return false;
      }
    }
    return true;
  }

  backtrackingSearch(assignment) {
    if (!assignment) {
      assignment = {};
    }
    // assignment is complete if every variable is assigned (our base case)
    if (Object.keys(assignment).length == this.variables.length) {
      return assignment;
    }

    // get all variables in the CSP but not in the assignment
    let unassigned = this.variables.filter((v) => !member(Object.keys(assignment), v));
    // get every possible domain value of the first unassigned variable
    let first = unassigned[0];
    for (let value of this.domains[first]) {
      let localAssignment = JSON.parse(JSON.stringify(assignment));
      localAssignment[first] = value;
      // if we're still consistent, we recurse (continue)
      if (this.consistent(first, localAssignment)) {
        let result = this.backtrackingSearch(localAssignment);

        // if we didn't find the result, we will end up backtracking
        if (result != null) {
          return result;
        }
      }
    }
    return null;
  }
}

// array membership helper function
function member(array, element) {
  if (array.length == 0) {
    return false;
  }
  if (typeof array[0] == typeof element) {
    return array.indexOf(element) > -1;
  }
  if (typeof array[0] == 'string' && typeof element == 'number') {
    return array.indexOf(element.toString()) > -1;
  }
  for (let item of array) {
    if (element == item) {
      return true;
    }
  }
  return false;
}


let _exports = {
  Constraint: Constraint,
  CSP: CSP,
  member: member
};

if (typeof window === 'undefined') {
  module.exports = _exports;
} else {
  csp = _exports;
}

