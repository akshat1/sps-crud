const mockery = require('mockery');
const sinon = require('sinon');
const assert = require('assert');

const noop = function() {};
const FakeConfig = {
  'mongo.url': 'fake-mongo-url'
};

const FakeLogger = {
  log: noop,
  debug: noop,
  warn: noop,
  error: noop
};

const FakeCursor = {};
FakeCursor.skip = sinon.stub().returns(FakeCursor);
FakeCursor.limit = sinon.stub().returns(FakeCursor);
FakeCursor.sort = sinon.stub().returns(FakeCursor);
FakeCursor.toArray = sinon.stub().returns(Promise.resolve(['foo', 'bar', 'baz']));

const FakeMongoCollection = {
  find: sinon.stub().returns(FakeCursor)
};
// This is what you will get from mongodb.client.connect
const FakeMongoDatabase = {
  collection: sinon.stub().returns(FakeMongoCollection)
};
const FakeMongoClient = { connect: sinon.stub().returns(Promise.resolve(FakeMongoDatabase)) };

const ConfigMock = { get: key => FakeConfig[key] };
const LoggerMock = { getLogger: () => FakeLogger };
const MongoMock = { MongoClient: FakeMongoClient };

describe('simian-store', function() {
  let Store;

  before(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    mockery.registerMock('simian-server-common/lib/config', ConfigMock);
    mockery.registerMock('simian-server-common/lib/logger', LoggerMock);
    mockery.registerMock('mongodb', MongoMock);
    Store = require('../lib');
  });

  afterEach(function() {
    FakeMongoDatabase.collection.reset();
    FakeMongoClient.connect.reset();
  });

  it('_getCollection', async function() {
    const actual0 = await Store._getCollection();
    assert.strictEqual(actual0, FakeMongoCollection);
    const actual1 = await Store._getCollection();
    assert.strictEqual(actual1, FakeMongoCollection);
    assert.equal(1, FakeMongoClient.connect.callCount, 'Should have called connect only once');
  });

  it('_makeVertex', function() {
    const src = {
      foo: 'foo',
      bar: 'bar'
    };
    const expected = Object.assign(src, { _type: Store.Type.Vertex });
    const actual = Store._makeVertex(src);
    assert.deepEqual(actual, expected, 'Should be the same as src, expected _type: vertex');
  });

  it('_makeEdge', function() {
    const src = {
      foo: 'foo',
      bar: 'bar'
    };
    const expected = Object.assign(src, { _type: Store.Type.Edge });
    const actual = Store._makeVertex(src);
    assert.deepEqual(actual, expected, 'Should be the same as src, expected _type: edge');
  });

  it('get', async function() {
    const query = {};
    const sort = {};
    const args = {
      query,
      skip: 3,
      limit: 5,
      sort
    };
    const result = await Store.get(args);
    assert.ok(Array.isArray(result.data), 'result should have property data as []');
    assert.equal(result.skip, args.skip, 'result should have included skip');
    assert.equal(result.limit, args.limit, 'result should have included limit');
    assert.equal(result.sort, args.sort, 'result should have included sort');
    assert.deepEqual(result.data, ['foo', 'bar', 'baz'], 'result missing expected data');
  });

  it('put');
  it('remove');
  it('relate');
  it('unrelate');
});
