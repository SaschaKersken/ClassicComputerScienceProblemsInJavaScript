if (typeof window === 'undefined') {
  util = require(__dirname + '/../util.js');
}

function calculatePi(nTerms) {
  let numerator = 4.0;
  let denominator = 1.0;
  let operation = 1.0;
  let pi = 0.0;
  for (let i = 0; i < nTerms; i++) {
    pi += operation * (numerator / denominator);
    denominator += 2.0;
    operation *= -1.0;
  }
  return pi;
}

util.out(calculatePi(100000));
