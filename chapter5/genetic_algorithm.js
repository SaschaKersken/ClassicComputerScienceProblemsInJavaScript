if (typeof window === 'undefined') {
  util = require(__dirname + '/../util.js');
}

function choices(population, weights, k) {
  if (!weights) {
    weights = [];
    for (let i = 0; i < population.length; i++) {
      weights.push(1);
    }
  }
  if (!k) {
    k = 1;
  }
  let keysToChooseFrom = Object.keys(population);
  let max = weights.reduce((s, e) => s + e);
  let picks = [];
  for (let i = 0; i < k; i++) {
    let r = Math.random() * max;
    let counter = 0;
    while (r > 0) {
      r -= weights[counter];
      if (r <= 0) {
        break;
      }
      counter++;
      if (counter >= weights.length || counter >= population.length) {
        counter = 0;
      }
    }
    picks.push(population[keysToChooseFrom[counter]]);
  }
  return picks;
}

const SelectionType = {
  ROULETTE: "roulette",
  TOURNAMENT: "tournament"
};

class GeneticAlgorithm {
  constructor(initialPopulation, threshold, maxGenerations, mutationChance, crossoverChance, selectionType) {
    this.population = initialPopulation;
    this.threshold = threshold;
    this.maxGenerations = maxGenerations ? maxGenerations : 100;
    this.mutationChance = mutationChance ? mutationChance : 0.01;
    this.crossoverChance = crossoverChance ? crossoverChance : 0.7;
    this.selectionType = selectionType ? selectionType : SelectionType.TOURNAMENT;
    this.fitnessKey = this.population[0].fitness;
  }

  // Use the probability distribution wheel to pick 2 parents
  // Note: will not work with negative fitness results
  pickRoulette(wheel) {
    return choices(this.population, wheel, 2);
  }

  // Choose numParticipants at random and take the best 2
  pickTournament(numParticipants) {
    let participants = choices(this.population, null, numParticipants);
    participants.sort((a, b) => b.fitness() - a.fitness());
    return [participants[0], participants[1]];
  }

  // Replace the population with a new generation of individuals
  _reproduceAndReplace() {
    let newPopulation = [];
    // keep going until we've filled the new generation
    while (newPopulation.length < this.population.length) {
      // pick the 2 parents
      let parents;
      if (this.selectionType == SelectionType.ROULETTE) {
        parents = this.pickRoulette(this.population.map((x) => x.fitness()));
      } else {
        parents = this.pickTournament(Math.floor(this.population.length / 2));
      }
      // potentially crossover the 2 parents
      if (Math.random() < this.crossoverChance) {
        let newIndividuals = parents[0].crossover(parents[1]);
        newPopulation.push(newIndividuals[0]);
        newPopulation.push(newIndividuals[1]);
      } else {
        newPopulation.push(parents[0]);
        newPopulation.push(parents[1]);
      }
    }
    // if we had an odd number, we'll have 1 extra, so we remove it
    if (newPopulation.lenth > this.population.length) {
      newPopulation.pop();
    }
    this.population = newPopulation; // replace reference
  }

  // With mutationChance probability mutate each individual
  mutate() {
    for (let individual of this.population) {
      if (Math.random() < this.mutationChance) {
        individual.mutate();
      }
    }
  }

  // Helper function to find the best individual (highest fitness)
  _best() {
    let result = this.population[0];
    for (let individual of this.population) {
      if (individual.fitness() > result.fitness()) {
        result = individual;
      }
    }
    return result;
  }

  // Helper function to find the average fitness of a generation
  _average() {
    let sum = 0;
    for (let individual of this.population) {
      sum += individual.fitness();
    }
    return sum / this.population.length;
  }

  // Run the genetic algorithm for maxGenerations iterations
  // and return the best individual found
  run() {
    let best = this._best();
    for (let generation = 0; generation < this.maxGenerations; generation++) {
      // early exit if we beat threshold
      if (best.fitness() >= this.threshold) {
        return best;
      }
      util.out('Generation ' + generation + ' Best ' + best.fitness() + ' Average ' + this._average()); 
      this._reproduceAndReplace();
      this.mutate();
      let highest = this._best();
      if (highest.fitness() > best.fitness()) {
        best = highest; // found a new best
      }
    }
    return best; // best we found in maxGenerations
  }
}

let _gaExports = {
  choices: choices,
  SelectionType: SelectionType,
  GeneticAlgorithm: GeneticAlgorithm
};

if (typeof window === 'undefined') {
  module.exports = _gaExports;
} else {
  ga = _gaExports;
}
