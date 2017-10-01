/**
 * Various Error classes for our REST api. Contain appropriate status codes.
 *
 * @module app/rest/Errors
 */
const HTTPCodes = require('./http-codes');

/**
 * Use when or or more required arguments are missing.
 *
 * @extends Error
 */
class MissingArgs extends Error {
  constructor(...argNames) {
    super(`Missing required args [${argNames.join(', ')}]`);
    this.statusCode = HTTPCodes.badRequest;
  }
}

/**
 * Use when a requested resource is missing.
 *
 * @extends Error
 */
class NotFound extends Error {
  constructor() {
    super('Requested item not found');
    this.statusCode = HTTPCodes.notFound;
  }
}

module.exports = {
  MissingArgs,
  NotFound
};