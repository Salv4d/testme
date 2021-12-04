const assert = require("assert");
const { forEach } = require("../index");

let numbers;
beforeEach(() => {
  numbers = [3, 5, 7];
});

it("Sum array", () => {
  let total = 0;
  forEach(numbers, (num) => {
    total += num;
  });

  assert.strictEqual(total, 15);
  numbers = 0;
});

it("beforeEach is ran each time", () => {
  assert.strictEqual(numbers.length, 3);
});
