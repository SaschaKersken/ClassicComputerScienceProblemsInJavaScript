if (typeof window === 'undefined') {
  util = require(__dirname + '/../util.js');
}

class CompressedGene {
  constructor(gene) {
    this.bitString = '';
    // Bit counter to keep track of where we are in each compressed byte
    let bc = 0;
    // Length of last segment (needs to be stored because it might not be a full byte)
    let lengthLast = 0;
    let byte = '';
    for (let i = 0; i < gene.length; i++) {
      if (bc == 0) {
        byte = '';
      }
      let c = gene.charAt(i);
      // Add two-bit sequence representing current nucleotide
      switch (c) {
        case 'A':
          byte += '00';
          break;
        case 'C':
          byte += '01';
          break;
        case 'G':
          byte += '10';
          break;
        case 'T':
          byte += '11';
          break;
      }
      // Increase bit counter
      bc += 2;
      // If byte is full or if this is the last round
      if (bc == 8 || i == gene.length - 1) {
        // ASCII-encode current byte and add it to bit string
        this.bitString += String.fromCharCode(parseInt(byte, 2));
        // Store current counter  value because it might be the last one
        lengthLast = bc;
        // Reset bit counter
        bc = 0;
      }
    }
    // Add length of last sequence to the bit string
    this.bitString += lengthLast;
  }

  // Decompress the current gene and return it
  decompress() {
    let gene = '';
    // Retrieve length of last segment from end of bit string
    let lengthLast = this.bitString.substr(-1);

    // -1 to exclude stored segment length
    for (let i = 0; i < this.bitString.length - 1; i++) {
      // Recreate bits from character
      let currentByte = this.bitString.charCodeAt(i).toString(2);
      // Normally left-pad the byte with zeros to 8 bits
      let padTo = 8;
      // If we're at the last item of the bit string
      if (i == this.bitString.length - 2) {
        // Only pad to the length of the last sequence
        padTo = lengthLast;
      }
      // Perform the actual left-padding
      currentByte = currentByte.padStart(padTo, '0');
      // Recreate the original nucleotides of the current byte and add them
      for (let j = 0; j < currentByte.length - 1; j += 2) {
        let c = currentByte.charAt(j) + currentByte.charAt(j + 1);
        switch (c) {
          case '00':
            gene += 'A';
            break;
          case '01':
            gene += 'C';
            break;
          case '10':
            gene += 'G';
            break;
          case '11':
            gene += 'T';
            break;
        }
      }
    }
    return gene;
  }
}

let original = 'TAGGGATTAACCGTTATATATATATAGCCATGGATCGATTATATAGGGATTAACCGTTATATATATATAGCCATGGATCGATTATA'.repeat(100);
util.out('Original: ' + original.length);
compressed = new CompressedGene(original);
util.out('Compressed: ' + compressed.bitString.length);
if (original == compressed.decompress()) {
  util.out('Idential!');
} else {
  util.out('Different!');
}
