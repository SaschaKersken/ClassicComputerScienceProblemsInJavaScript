if (typeof window === 'undefined') {
  util = require(__dirname + '/../util.js');
}

function permutations(items, result, perms) {
  if (items.length == 0) {
    result.push(perms);
  } else {
    for (let i = items.length - 1; i >= 0; i--) {
      let newItems = items.slice();
      let newPermutations = perms.slice();
      let temp = newItems.splice(i, 1);
      newPermutations.unshift(temp[0]);
      permutations(newItems, result, newPermutations);
    }
  }
}

let vtDistances = {
  "Rutland":
    {"Burlington": 67,
     "White River Junction": 46,
     "Bennington": 55,
     "Brattleboro": 75},
  "Burlington":
    {"Rutland": 67,
     "White River Junction": 91,
     "Bennington": 122,
     "Brattleboro": 153},
  "White River Junction":
    {"Rutland": 46,
     "Burlington": 91,
     "Bennington": 98,
     "Brattleboro": 65},
  "Bennington":
    {"Rutland": 55,
     "Burlington": 122,
     "White River Junction": 98,
     "Brattleboro": 40},
  "Brattleboro":
    {"Rutland": 75,
     "Burlington": 153,
     "White River Junction": 65,
     "Bennington": 40}
};

let vtCities = Object.keys(vtDistances);
let cityPermutations = [];
permutations(vtCities, cityPermutations, []);
let tspPaths = [];
for (let i in cityPermutations) {
  tspPaths[i] = cityPermutations[i];
  tspPaths[i].push(cityPermutations[i][0]);
}

let bestPath = [];
let minDistance = 99999999; // arbitrarily high number
for (let path of tspPaths) {
  let distance = 0;
  let last = path[0];
  for (let next of path.slice(1)) {
    distance += vtDistances[last][next];
    last = next;
  }
  if (distance < minDistance) {
    minDistance = distance;
    bestPath = path;
  }
}

util.out('The shortest path is:');
util.out(bestPath);
util.out("in " + minDistance + " miles.");
