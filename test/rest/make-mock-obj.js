const sinon = require('sinon');

module.exports = function makeMockModel(returnValues = {}) {
  const model = {};
  for(let key in returnValues)
    model[key] = sinon.spy(function(...args) {
      return typeof returnValues[key] === 'function' ? returnValues[key].apply(null, args) : returnValues[key];
    });
  return model;
}
