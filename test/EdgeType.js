const db = require('../app/db');
// const assert = require('assert');

const {
  // EdgeType,
  sync,
} = db;

describe('EdgeType', function() {
  before(function() {
    return sync({ force: true });
  });

  it('Create');
  it('Retrieve');
  it('Update');
  it('Delete');
});
