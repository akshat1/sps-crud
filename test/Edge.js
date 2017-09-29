const db = require('../lib');
// const assert = require('assert');

const {
  // Edge,
  sync,
} = db;

describe('Edge', function() {
  before(function() {
    return sync({ force: true });
  });

  it('Create');
  it('Retrieve');
  it('Update');
  it('Delete');
});
