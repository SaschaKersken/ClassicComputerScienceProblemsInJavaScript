if (typeof window === 'undefined') {
  fs = require('fs');
  nn = require(__dirname + '/neural_network.js');
  tools = require(__dirname + '/../chapter5/tools.js');
  util = require(__dirname + '/../util.js');
}

function wineInterpretOutput(output) {
  if (Math.max(...output) == output[0]) {
    return 1;
  } else if (Math.max(...output) == output[1]) {
    return 2;
  } else {
    return 3;
  }
}

function process(wines) {
  let wineParameters = [];
  let wineClassifications = [];
  let wineSpecies = [];
  wines = tools.shuffle(wines); // get our lines of data in random order
  for (let wine of wines) {
    let parameters = wine.slice(1, 13);
    wineParameters.push(parameters);
    let species = wine[0];
    if (species == 1) {
      wineClassifications.push([1.0, 0.0, 0.0]);
    } else if (species == 2) {
      wineClassifications.push([0.0, 1.0, 0.0]);
    } else {
      wineClassifications.push([0.0, 0.0, 1.0]);
    }
    wineSpecies.push(species);
  }
  nn.normalizeByFeatureScaling(wineParameters);

  let wineNetwork = new nn.Network([13, 7, 3], 0.9);

  // train over the first 150 irises in the data set 10 times
  let wineTrainers = wineParameters.slice(0, 150);
  let wineTrainersCorrects = wineClassifications.slice(0, 150);
  for (let i = 0; i < 10; i++) {
    wineNetwork.train(wineTrainers, wineTrainersCorrects);
  }

  // test over the last 28 of the wines in the data set
  let wineTesters = wineParameters.slice(150);
  let wineTestersCorrects = wineSpecies.slice(150);
  let wineResults = wineNetwork.validate(wineTesters, wineTestersCorrects, wineInterpretOutput);
  let wineResultsPercent = wineResults[2] * 100;
  util.out(wineResults[0] + ' correct of ' + wineResults[1] + ' = ' + wineResultsPercent + '%');
}

if (typeof window === 'undefined') {
  fs.readFile(__dirname + '/wine.csv', {encoding: 'utf-8'}, function(err, csv) {
    if (!err) {
      let lines = csv.split("\n");
      wines = [];
      lines.map((line) => {
        if (line) {
          wines.push(line.split(','));
        }
      });
      process(wines);
    } else {
      util.out(err);
    }
  });
}

