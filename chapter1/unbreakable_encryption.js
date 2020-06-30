if (typeof window === 'undefined') {
  util = require(__dirname + '/../util.js');
}

function randomKey(length) {
  // Generate length random bytes and return them
  let result = '';
  for (let i = 0; i < length; i++) {
    result += String.fromCharCode(Math.floor(Math.random() * 256));
  }
  return result;
}

function encrypt(original) {
  let dummy = randomKey(original.length);
  let encrypted = '';
  for (let i = 0; i < original.length; i++) {
    encrypted += String.fromCharCode(original.charCodeAt(i) ^ dummy.charCodeAt(i)); // XOR
  }
  return [dummy, encrypted];
}

function decrypt(key1, key2) {
  let decrypted = '';
  for (let i = 0; i < key1.length; i++) {
    decrypted += String.fromCharCode(key1.charCodeAt(i) ^ key2.charCodeAt(i)); // XOR
  }
  return decrypted;
}

let keys = encrypt('One Time Pad!');
let result = decrypt(keys[0], keys[1]);
util.out(result);
