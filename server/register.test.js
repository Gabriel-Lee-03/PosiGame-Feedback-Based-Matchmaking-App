const {ahead, isRegistered} = require("./stringParse");

test('dog is ahead of doge', () => {
  expect(ahead('dog', 'doge')).toBe(true);
})

test('docs is not ahead of crust', () => {
  expect(ahead('docs', 'crust')).toBe(false);
})

const sortedNames = ["cats", "docs", "quest", "rats"];

test('docs is list of names', () => {
  expect(isRegistered('docs', sortedNames) === -1).toBe(false);
})

test('annie is not list of names', () => {
  expect(isRegistered('annie', sortedNames)).toBe(-1);
})

test('zebra is not list of names', () => {
  expect(isRegistered('zebra', sortedNames)).toBe(-1);
})