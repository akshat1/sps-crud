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

const FakeMongoCollection = {};
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

  it('_makeVertex');
  it('_makeEdge');
  it('get');
  it('put');
  it('remove');
  it('relate');
  it('unrelate');
});
