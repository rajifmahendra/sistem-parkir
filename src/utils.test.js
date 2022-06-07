const assert = require("chai").assert;

const { isNumber } = require("./utils");

describe("utils -> isNumber", () => {
  it("when valid numbers are passed as strings, expect to return true", () => {
    const testCases = ["1234", "09834", "274563294587230", "1", "0"];
    testCases.forEach((c) => assert.isTrue(isNumber(c)));
  });

  it("when valid alphabets, special chars are passed as strings, expect to return false", () => {
    const testCases = ["a", "abc", "a123", "1234abc", "a-132", "123.2"];
    testCases.forEach((c) => assert.isFalse(isNumber(c)));
  });
});
