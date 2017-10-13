const db = require('../../app/db');
const assert = require('assert');

const {
  Edge,
  EdgeType,
  Vertex,
  sync,
} = db;

describe('Edge', function() {
  let fromId, toId;

  before(function() {
    return sync({ force: true });
  });

  it('Create', function() {
    return Promise
      .all([
        EdgeType.create({
          name: 'ET0',
          metadata: {},
          isDirectional: true
        }),
        Vertex.create({
          name: 'V0',
          metadata: {}
        }),
        Vertex.create({
          name: 'V1',
          metadata: {}
        })
      ])
      .then(function([edgeType, vertex0, vertex1]) {
        fromId = { vertex0 };
        toId = { vertex1 };
        return Edge.create({
          edgeTypeId: edgeType.id,
          fromId: vertex0.id,
          toId: vertex1.id,
          metadata: { foo: 'bar' },
          strength: 1
        });
      })
      .then(function(edge) {
        assert(!!edge, 'Edge should be truthy');
      });
  });

  it('Retrieve', function() {
    return Edge
      .findOne({
        fromId,
        toId
      })
      .then(function(edge) {
        assert(!!edge, 'Did not find edge');
      });
  });

  it('Update', function() {
    return Edge
      .findOne({
        fromId,
        toId
      })
      .then(function(edge) {
        assert(!!edge, 'Did not find edge to update it');
        return edge.update({ metadata: { baz: 'qux' } });
      })
      .then(function(updatedInstance) {
        assert(updatedInstance.metadata.baz === 'qux', 'name should have been updated');
      });
  });

  it('Delete', function() {
    return Edge
      .findById(1)
      .then(function(instance) { return instance.destroy(); })
      .then(function() { return Edge.findById(1); } )
      .then(function (instance) { return assert(!instance, 'instance should be falsy')});
  });
});
