if (typeof window === 'undefined') {
  util = require(__dirname + '/../util.js');
}

class Nucleotide {
  constructor(n) {
    if (['A', 'C', 'G', 'T'].indexOf(n) > -1) {
      this.nucleotide = n;
    } else {
      throw "Nucleotide must be 'A', 'C', 'G', or 'T'.";
    }
  }

  toString() {
    return this.nucleotide;
  }
}

class Codon {
  constructor(data) {
    if (data.length != 3) {
      throw "A codon must have exactly three nucleotides.";
    }
    this.nucleotides = [];
    for (let n of data) {
      this.nucleotides.push(new Nucleotide(n));
    }
  }

  equal(codon) {
    return this.toString() == codon.toString();
  }

  toString() {
    let result = '';
    for (let n of this.nucleotides) {
      result += n.toString();
    }
    return result;
  }
}

function stringToGene(s) {
  let gene = [];
  for (let i = 0; i < s.length; i += 3) {
    if (i + 2 >= s.length) { // Don't run off end
      return gene;
    }
    // Initialize codon out of three nucleotides
    let codon = new Codon([s[i], s[i + 1], s[i + 2]]);
    gene.push(codon);
  }
  return gene;
}

// Linear search for a codon
function linearContains(gene, keyCodon) {
  for (let codon of gene) {
    if (codon.equal(keyCodon)) {
      return true;
    }
  }
  return false;
}

// Binary search for a codon
function binaryContains(gene, keyCodon) {
  let low = 0;
  let high = gene.length - 1;
  while (low <= high) { // While there is still a search space
    let mid = Math.floor((low + high) / 2);
    if (gene[mid] < keyCodon) {
      low = mid + 1;
    } else if (gene[mid] > keyCodon) {
      high = mid - 1;
    } else {
      return true;
    }
  }
  return false;
}

let geneStr = "ACGTGGCTCTCTAACGTACGTACGTACGGGGTTTATATATACCCTAGGACTCCCTTT";
let myGene = stringToGene(geneStr);
let acg = new Codon(['A', 'C', 'G']);
let gat = new Codon(['G', 'A', 'T']);
util.out('Linear contains:');
util.out('ACG: ' + (linearContains(myGene, acg) ? 'yes' : 'no')); // yes
util.out('GAT: ' + (linearContains(myGene, gat) ? 'yes' : 'no')); // no
myGene.sort();
util.out('Binary contains:');
util.out('ACG: ' + (binaryContains(myGene, acg) ? 'yes' : 'no')); // yes
util.out('GAT: ' + (binaryContains(myGene, gat) ? 'yes' : 'no')); // no
