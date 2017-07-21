/**
 * @module simian-store
 * @type {Object}
 */
const { MongoClient } = require('mongodb');
const config          = require('simian-server-common/lib/config');
const { getLogger }   = require('simian-server-common/lib/logger');

const logger = getLogger({
  level: config.get('store.log.level') || 'debug'
});

const Mod = {};

const Type = Mod.Type = {
  Vertex : 'Vertex',
  Edge   : 'Edge'
};

/**
 * Get and cache the only collection in our DB.
 *
 * @alias module:simian-store~_getCollection
 * @return {Promise} -  A promise that resolves into a collection.
 */
Mod._getCollection = async function _getCollection() {
  if (!exports._collection) {
    const dbURL = config.get('mongo.url');
    logger.debug(`dbURL: ${dbURL}`);
    const db = await MongoClient.connect(dbURL);
    exports._collection = db.collection('highlander');
  }

  return exports._collection;
}

/**
 * Make a vertex as stored in the db.
 * 
 * @alias module:simian-store~_makeVertex
 * @param {Object} dataObj - whatever data is to be stored in the vertex.
 * @return {Object} - a vertex object.
 */
Mod._makeVertex = function _makeVertex(dataObj) {
  return Object.assign(dataObj, { _type: Type.Vertex });
}

/**
 * Make an edge as stored in the db.
 * 
 * @alias module:simian-store~_makeEdge
 * @param {Mongo.ObjectId} fromId - _id of the relationship source object.
 * @param {Mongo.ObjectId} toId - _id of the relationship target object.
 * @param {Object} relationship - whatever data is to be store in the edge.
 * @return {Object} - an edge object.
 */
Mod._makeEdge = function _makeEdge(fromId, toId, relationship) {
  return Object.assign({
    _from: fromId,
    _to: toId,
    _type: Type.Edge,
  }, relationship);
}

/**
 * Execute `query` on the db. Consider same as mongo:find. It will find vertices as well as edges. Use _type: Type to filter.
 *
 * @alias module:simian-store.get
 * @param {Object} args - arguments object.
 * @param {Object} args.query - the query.
 * @param {number} [args.skip] - number of records to skip.
 * @param {number} [args.limit] - number of records to return.
 * @param {Object} [args.sort] - sort options (See Mongo docs for `cursor.sort`).
 * @param {Object} [args.projection] - Specifies the fields to return. (See Mongo docs for `collection.find`).
 * @return {Promise} - a promise that resolves into an object containing array of objects, along with count and pagination data.
 * @see https://docs.mongodb.com/manual/reference/method/db.collection.find/
 * @see https://docs.mongodb.com/manual/reference/method/cursor.skip/
 * @see https://docs.mongodb.com/manual/reference/method/cursor.limit/
 * @see https://docs.mongodb.com/manual/reference/method/cursor.sort/
 */
Mod.get = async function get(args) {
  logger.debug('get', args);
  const {
    query,
    skip,
    limit,
    sort,
    projection
  } = args;

  const collection = await Mod._getCollection();
  const cursor = collection.find(query, projection);

  if (sort) cursor.sort(sort);
  if (typeof skip === 'number') cursor.skip(skip);
  if (typeof limit === 'number') cursor.limit(limit);

  return {
    data: await cursor.toArray(),
    skip,
    limit,
    sort
  };
}

/**
 * Puts the supplied objects into the db as vertices. Uses mongo `collection.remove` & `collection.insert`.
 *
 * @alias module:simian-store.put
 * @param  {Object[]} objects - an array of objects to be stored.
 * @return {Promise} - a promise that resolves when we are done storing objects.
 * @see https://docs.mongodb.com/manual/reference/method/db.collection.remove/
 * @see https://docs.mongodb.com/manual/reference/method/db.collection.insert/
 */
Mod.put = async function put(objects = []) {
  const collection = await Mod._getCollection();
  // Remove existing vertices.
  await Promise.all(objects.map(function(item) {
    return collection.remove(item, { justOne: true });
  }));

  // And insert.
  return collection.insert(objects.map(Mod._makeVertex));
}

/**
 * Delete all the objects that match the given query.
 *
 * @alias module:simian-store.remove
 * @param  {Object} query - search query.
 * @return {Promise} - a promise that resolves when we are done deleting.
 * @see https://docs.mongodb.com/manual/reference/method/db.collection.remove/
 */
Mod.remove = async function remove(query) {
  const collection = await Mod._getCollection();
  return collection.remove(query);
}

/**
 * Associate object found by `srcQuery` with the object found by `targetQuery` using the `relationship` object.
 *
 * @alias module:simian-store.relate
 * @param  {Object} srcQuery     - a query to find the source object. The first object that matches this query will be used.
 * @param  {Object} targetQuery  - a query to find the target object. The first object that matches this query will be used.
 * @param  {Object} relationship - the relationship object. Must have a `name` property that would be shared by similar relationships.
 * @return {Promise} - A promise that resolves when we are done linking.
 */
Mod.relate = async function relate(srcQuery, targetQuery, relationship) {
  const collection = await Mod._getCollection();
  const fromObject = (await Mod.get(srcQuery))[0];
  const toObject = (await Mod.get(targetQuery))[0];
  if (fromObject && toObject) {
    return collection.insertOne(Mod._makeEdge(fromObject._id, toObject._id, relationship));
  } else {
    throw new Error('Did not find source or destination object.');
  }
}

/**
 * Remove the association between objects found by `srcQuery` and `targetQuery` using relationship found by `relationshipQuery`.
 *
 * @alias module:simian-store.unrelate
 * @param  {Object} srcQuery          - a query to find the source object. The first object that matches this query will be used.
 * @param  {Object} targetQuery       - a query to find the target object. The first object that matches this query will be used.
 * @param  {Object} relationshipQuery - a query to find the relevant relationship.
 * @return {Promise} - A Promise that is resolved when we are done.
 */
Mod.unrelate = async function unrelate(srcQuery, targetQuery, relationshipQuery) {
  const collection = await Mod._getCollection();
  const fromObject = (await Mod.get(srcQuery))[0];
  const toObject = (await Mod.get(targetQuery))[0];
  if (fromObject && toObject)
    return collection.remove(Mod._makeEdge(fromObject._id, toObject._id, relationshipQuery));
  else
    throw new Error('Did not find source or destination object.');
};

module.exports = Mod;
