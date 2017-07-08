/**
 * @module simian-store
 * @type {Object}
 */

/**
 * Execute `query` on the db. Consider same as mongo:find.
 *
 * @param  {Object} query - the query.
 * @return {Promise} - a promise that resolves into an array of objects.
 */
exports.get = function get(query) {
  return Promise.resolve(query);
}

/**
 * Puts the supplied objects into the db.
 *
 * @param  {Object[]} objects - an array of objects to be stored.
 * @return {Promise} - a promise that resolves when we are done storing objects.
 */
exports.put = function put(objects) {
  return Promise.resolve(objects);
}

/**
 * Delete all the objects that match the given query.
 *
 * @param  {Object} query - search query.
 * @return {Promise} - a promise that resolves when we are done deleting.
 */
exports.remove = function remove(query) {
  return Promise.resolve(query);
}

/**
 * Associate object found by `srcQuery` with the object found by `targetQuery` using the `relationship` object.
 *
 * @param  {Object} srcQuery     - a query to find the source object. The first object that matches this query will be used.
 * @param  {Object} targetQuery  - a query to find the target object. The first object that matches this query will be used.
 * @param  {Object} relationship - the relationship object. Must have a `name` property that would be shared by similar relationships.
 * @return {Promise} - A promise that resolves when we are done linking.
 */
exports.relate = function relate(srcQuery, targetQuery, relationship) {
  return Promise.resolve({srcQuery, targetQuery, relationship});
}

/**
 * Remove the association between objects found by `srcQuery` and `targetQuery` using relationship found by `relationshipQuery`.
 *
 * @param  {Object} srcQuery          - a query to find the source object. The first object that matches this query will be used.
 * @param  {Object} targetQuery       - a query to find the target object. The first object that matches this query will be used.
 * @param  {Object} relationshipQuery - a query to find the relevant relationship.
 * @return {Promise} - A Promise that is resolved when we are done.
 */
exports.unrelate = function unrelate(srcQuery, targetQuery, relationshipQuery) {
  return Promise.resolve({srcQuery, targetQuery, relationshipQuery});
};
