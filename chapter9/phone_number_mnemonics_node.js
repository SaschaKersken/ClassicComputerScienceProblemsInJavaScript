util = require(__dirname + '/../util.js');
pm = require(__dirname + '/phone_number_mnemonics_lib.js');
const readline = require('readline');
  
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter a phone number: ', function(phoneNumber) {
  util.out("Here are the potential mnemonics:");
  let mnemonics = pm.possibleMnemonics(phoneNumber);
  for (let mnemonic of mnemonics) {
    util.out(mnemonic.join(''));
  }
  rl.close();
  return;
});
