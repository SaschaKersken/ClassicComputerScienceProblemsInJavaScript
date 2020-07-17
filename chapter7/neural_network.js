// dot product of two vectors
function dotProduct(vector1, vector2) {
  let p = [];
  for (let index in vector1) {
    p.push(vector1[index] * vector2[index]);
  }
  return p.reduce((s, e) => s + e);
}

// the classic sigmoid activation function
function sigmoid(x) {
  return 1.0 / (1.0 + Math.exp(-x));
}

function derivativeSigmoid(x) {
  let sig = sigmoid(x);
  return sig * (1 - sig);
}

// assume all rows are of equal length
// and feature scale each column to be in the range 0 - 1
function normalizeByFeatureScaling(dataset) {
  for (let colNum = 0; colNum < dataset[0].length; colNum++) {
    let column = dataset.map((row) => row[colNum]);
    let maximum = Math.max(...column);
    let minimum = Math.min(...column);
    for (let rowNum = 0; rowNum < dataset.length; rowNum++) {
      dataset[rowNum][colNum] = (dataset[rowNum][colNum] - minimum) / (maximum - minimum);
    }
  }
}

class Neuron {
  constructor(weights, learningRate, activationFunction, derivativeActivationFunction) {
    this.weights = weights;
    this.activationFunction = activationFunction;
    this.derivativeActivationFunction = derivativeActivationFunction;
    this.learningRate = learningRate;
    this.outputCache = 0.0;
    this.delta = 0.0;
  }

  output(inputs) {
    this.outputCache = dotProduct(inputs, this.weights);
    return this.activationFunction(this.outputCache);
  }
}

class Layer {
  constructor(previousLayer, numNeurons, learningRate, activationFunction, derivativeActivationFunction) {
    this.previousLayer = previousLayer ? previousLayer : null;
    this.neurons = [];
    for (let i = 0; i < numNeurons; i++) {
      let randomWeights;
      if (previousLayer == null) {
        randomWeights = [];
      } else {
        randomWeights = previousLayer.neurons.map(() => Math.random());
      }
      let neuron = new Neuron(randomWeights, learningRate, activationFunction, derivativeActivationFunction);
      this.neurons.push(neuron);
    }
    this.outputCache = Array(numNeurons).fill().map(() => 0.0);
  }

  outputs(inputs) {
    if (this.previousLayer == null) {
      this.outputCache = inputs;
    } else {
      this.outputCache = this.neurons.map((n) => n.output(inputs));
    }
    return this.outputCache;
  }

  // should only be called on output layer
  calculateDeltasForOutputLayer(expected) {
    for (let n = 0; n < this.neurons.length; n++) {
      this.neurons[n].delta = this.neurons[n].derivativeActivationFunction(this.neurons[n].outputCache) * (expected[n] - this.outputCache[n]);
    }
  }

  // should not be called on an output layer      
  calculateDeltasForHiddenLayer(nextLayer) {
    for (let [index, neuron] of Object.entries(this.neurons)) {
      let nextWeights = nextLayer.neurons.map((n) => n.weights[index]);
      let nextDeltas = nextLayer.neurons.map((n) => n.delta);
      let sumWeightsAndDeltas = dotProduct(nextWeights, nextDeltas);
      neuron.delta = neuron.derivativeActivationFunction(neuron.outputCache) * sumWeightsAndDeltas;
    }
  }
}

class Network {
  constructor(layerStructure, learningRate, activationFunction, derivativeActivationFunction) {
    if (activationFunction == null) {
      activationFunction = sigmoid;
    }
    if (derivativeActivationFunction == null) {
      derivativeActivationFunction = derivativeSigmoid;
    }
    if (layerStructure.length < 3) {
      throw "Error: Should be at least 3 layers (1 input, 1 hidden, 1 output)";
    }
    this.layers = [];
    // input layer
    let inputLayer = new Layer(null, layerStructure[0], learningRate, activationFunction, derivativeActivationFunction);
    this.layers.push(inputLayer);
    // hidden layers and output layer
    for (let [previous, numNeurons] of Object.entries(layerStructure.slice(1))) {
      let nextLayer = new Layer(this.layers[previous], numNeurons, learningRate, activationFunction, derivativeActivationFunction);
      this.layers.push(nextLayer);
    }
  }

  // Pushes input data to the first layer, then output from the first
  // as input to the second, second to the third, etc.
  outputs(input) {
    let outputs = input;
    for (let layer of this.layers) {
      outputs = layer.outputs(outputs);
    }
    return outputs;
    // return this.layers.reduce((inputs, layer) => layer.outputs(inputs), input);
  }

  // Figure out each neuron's change based ob the errors of the output
  // versus the expected outcome
  backpropagate(expected) {
    // calculate delta for output layer neurons
    let lastLayer = this.layers.length - 1;
    this.layers[lastLayer].calculateDeltasForOutputLayer(expected);
    // calculate delta for hidden layers in reverse order
    for (let l = lastLayer - 1; l > 0; l--) {
      this.layers[l].calculateDeltasForHiddenLayer(this.layers[l + 1]);
    }
  }

  // backpropagate() doesn't actually change any weights
  // this function uses the deltas calculated in backpropagate() to
  // actually make changes to the weights
  updateWeights() {
    for (let layer of this.layers.slice(1)) { // skip input layer
      for (let neuron of layer.neurons) {
        for (let w in neuron.weights) {
          neuron.weights[w] = neuron.weights[w] + (neuron.learningRate * (layer.previousLayer.outputCache[w]) * neuron.delta);
        }
      }
    }
  }

  // train() uses the results of outputs() run over many inputs and compared
  // against expecteds to feed backpropagate() und updateWeights()
  train(inputs, expecteds) {
    for (let [location, xs] of Object.entries(inputs)) {
      let ys = expecteds[location];
      let outs = this.outputs(xs);
      this.backpropagate(ys);
      this.updateWeights();
    }
  }

  // for generalized results that require classification this function will return
  // the correct number of trials and the percentage correct out of the total
  validate(inputs, expecteds, interpretOutput) {
    let correct = 0;
    for (let i = 0; i < inputs.length; i++) {
      let input = inputs[i];
      let expected = expecteds[i];
      let result = interpretOutput(this.outputs(input));
      if (result == expected) {
        correct++;
      }
    }
    let percentage = correct / inputs.length;
    return [correct, inputs.length, percentage];
  }
}

let _nnExports = {
  dotProduct: dotProduct,
  sigmoid: sigmoid,
  derivativeSigmoid: derivativeSigmoid,
  normalizeByFeatureScaling: normalizeByFeatureScaling,
  Neuron: Neuron,
  Layer: Layer,
  Network: Network
};

if (typeof window === 'undefined') {
  module.exports = _nnExports;
} else {
  nn = _nnExports;
}
