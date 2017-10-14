const sinon = require('sinon');

module.exports = function makeMockResponse() {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.send = sinon.stub();
  res.json = sinon.stub();
  return res; 
}
