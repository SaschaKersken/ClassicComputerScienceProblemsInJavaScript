document.getElementById('okButton').addEventListener(
  'click',
  function() {
    let phoneNumber = document.getElementById('number').value;
    document.getElementById('number').value = '';
    let result = "Here are the potential mnemonics for " + phoneNumber + ":\n";
    let mnemonics = pm.possibleMnemonics(phoneNumber);
    for (let mnemonic of mnemonics) {
      result += mnemonic.join('') + "\n";
    }
    document.getElementById('result').innerHTML = '<pre>' + result + '</pre>';
  }
);
