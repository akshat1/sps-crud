const db = require('../lib');
const assert = require('assert');

const {
  Vertex,
  sync,
} = db;

describe('Vertex', function() {
  before(function() {
    return sync({ force: true });
  });

  it('create', function() {
    return Vertex
      .create({
        name: 'text-vertex-0',
        metadata: {}
      })
      .then(function(instance) {
        assert(!!instance, 'instance should be truthy');
      });
  });

  it('retrieve', function() {
    // Because we always force sync the db, the id is always 1
    return Vertex
      .findById(1)
      .then(function(instance) {
        assert(!!instance, 'instance should be truthy');
      });
  });

  it('update', function() {
    return Vertex
      .findById(1)
      .then(function(instance) {
        return instance.update({ name: 'updated-name' });
      })
      .then(function(updatedInstance) {
        assert(updatedInstance.name === 'updated-name', 'name should have been updated');
      });
  });

  it('delete', function() {
    return Vertex
      .findById(1)
      .then(function(instance) {
        return instance.destroy();
      });
  });
});
