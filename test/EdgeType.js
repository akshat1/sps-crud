const db     = require('../app/db');
const assert = require('assert');

const {
  EdgeType,
  sync,
} = db;

describe('EdgeType', function() {
  before(function() {
    return sync({ force: true });
  });

  it('Create', function() {
    return EdgeType
      .create({
        name: 'edgetype-0',
        metadata: {},
        isDirectional: true
      })
      .then(function(instance) {
        assert(!!instance, 'instance should be truthy');
      })
  });

  it('retrieve', function() {
    // Because we always force sync the db, the edgetype is always 1
    return EdgeType
      .findById(1)
      .then(function(instance) {
        assert(!!instance, 'instance should be truthy');
      });
  });

  it('Update', function() {
    return EdgeType
      .findById(1)
      .then(function(instance) {
        return instance.update({ name: 'updated-name' });
      })
      .then(function(updatedInstance) {
        assert(updatedInstance.name === 'updated-name', 'name should have been updated');
      });
  });

  it('delete', function() {
    return EdgeType
      .findById(1)
      .then(function(instance) {
        return instance.destroy();
      });
  });
});
