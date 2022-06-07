const NUMBER_RE = new RegExp("^[0-9]+$");

const isNumber = (value) => NUMBER_RE.test(value);

module.exports = {
  isNumber,
};
