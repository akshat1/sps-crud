const Errors      = require('../errors');
const sendError   = require('./send-error');
const sendData    = require('./send-data');
const updateOne   = require('./update-one');
const createOne   = require('./create-one');
const SSCommon    = require('simian-server-common');
const _           = require('lodash');

const logger = SSCommon.logger.getLogger({ level: 'debug' });

module.exports = function createUpdateAll(model, req, res) {
  logger.debug('createUpdateAll', req.body);
  // req.body is a json object.
  const { items } = req.body;
  if (!items) {
    return sendError(res, new Errors.MissingArgs('items'));
  }
  
  Promise
    .all(items.map(createArgs => createArgs.hasOwnProperty('id') ? updateOne(model, createArgs) : createOne(model, createArgs)))
    .then(_.curry(sendData, 2)(res))
    .catch(_.curry(sendError, 2)(res));
}
