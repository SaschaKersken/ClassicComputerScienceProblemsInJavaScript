if (typeof window === 'undefined') {
  util = require(__dirname + '/../util.js');
}

class Item {
  constructor(name, weight, value) {
    this.name = name;
    this.weight = weight;
    this.value = value;
  }
}

function knapsack(items, maxCapacity) {
  // build up dynamic programming table
  let table = [];
  for (let i = 0; i <= items.length; i++) {
    table[i] = [];
    for (let j = 0; j <= maxCapacity; j++) {
      table[i][j] = 0.0;
    }
  }
  for (let [i, item] of Object.entries(items)) {
    for (let capacity = 1; capacity <= maxCapacity; capacity++) {
      let previousItemsValue = table[i][capacity];
      if (capacity >= item.weight) { // item fits in knapsack
        let valueFreeingWeightForItem = table[i][capacity - item.weight];
        // only take if more valuable than previous item
        table[parseInt(i) + 1][capacity] = Math.max(valueFreeingWeightForItem + item.value, previousItemsValue);
      } else { // no room for this item
        table[parseInt(i) + 1][capacity] = previousItemsValue;
      }
    }
  }
  // figure out solution from table
  let solution = [];
  let capacity = maxCapacity;
  for (let i = items.length; i > 0; i--) { // work backwards
    // was this item used?
    if (table[i - 1][capacity] != table[i][capacity]) {
      solution.push(items[i - 1]);
      // if the ite was used, remove its weight
      capacity -= items[i - 1].weight;
    }
  }
  return solution;
}

let items = [
  new Item("television", 50, 500),
  new Item("candlesticks", 2, 300),
  new Item("stereo", 35, 400),
  new Item("laptop", 3, 1000),
  new Item("food", 15, 50),
  new Item("clothing", 20, 800),
  new Item("jewelry", 1, 4000),
  new Item("books", 100, 300),
  new Item("printer", 18, 30),
  new Item("refrigerator", 200, 700),
  new Item("painting", 10, 1000)
];
util.out(knapsack(items, 75));
