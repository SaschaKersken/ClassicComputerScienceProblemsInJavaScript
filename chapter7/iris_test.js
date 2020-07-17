if (typeof window === 'undefined') {
  fs = require('fs');
  nn = require(__dirname + '/neural_network.js');
  tools = require(__dirname + '/../chapter5/tools.js');
  util = require(__dirname + '/../util.js');
}

function irisInterpretOutput(output) {
  if (Math.max(...output) == output[0]) {
    return 'Iris-setosa';
  } else if (Math.max(...output) == output[1]) {
    return 'Iris-versicolor';
  } else {
    return 'Iris-virginica';
  }
}

function process(irises) {
  let irisParameters = [];
  let irisClassifications = [];
  let irisSpecies = [];
  irises = tools.shuffle(irises); // get our lines of data in random order
  for (let iris of irises) {
    let parameters = iris.slice(0, 4);
    irisParameters.push(parameters);
    let species = iris[4];
    if (species == 'Iris-setosa') {
      irisClassifications.push([1.0, 0.0, 0.0]);
    } else if (species == 'Iris-versicolor') {
      irisClassifications.push([0.0, 1.0, 0.0]);
    } else {
      irisClassifications.push([0.0, 0.0, 1.0]);
    }
    irisSpecies.push(species);
  }
  nn.normalizeByFeatureScaling(irisParameters);

  let irisNetwork = new nn.Network([4, 6, 3], 0.3);

  // train over the first 140 irises in the data set 50 times
  let irisTrainers = irisParameters.slice(0, 140);
  let irisTrainersCorrects = irisClassifications.slice(0, 140);
  for (let i = 0; i < 50; i++) {
    irisNetwork.train(irisTrainers, irisTrainersCorrects);
  }

  // test over the last 10 of the irises in the data set
  let irisTesters = irisParameters.slice(140);
  let irisTestersCorrects = irisSpecies.slice(140);
  let irisResults = irisNetwork.validate(irisTesters, irisTestersCorrects, irisInterpretOutput);
  let irisResultsPercent = irisResults[2] * 100;
  util.out(irisResults[0] + ' correct of ' + irisResults[1] + ' = ' + irisResultsPercent + '%');
}

if (typeof window === 'undefined') {
  fs.readFile(__dirname + '/iris.csv', {encoding: 'utf-8'}, function(err, csv) {
    if (!err) {
      let lines = csv.split("\n");
      irises = [];
      lines.map((line) => {
        if (line) {
          irises.push(line.split(','));
        }
      });
      process(irises);
    } else {
      util.out(err);
    }
  });
}

