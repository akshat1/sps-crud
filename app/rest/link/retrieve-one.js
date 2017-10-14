const sendError = require('./send-error');
const sendData  = require('./send-data');
const SSCommon  = require('simian-server-common');
const _         = require('lodash');

const logger = SSCommon.logger.getLogger({ level: 'debug' });

module.exports = function retrieveOne(model, req, res) {
  const { id } = req.params;
  logger.debug(`retrieveOne(${id})`);
  return model
    .findById(id)
    .then(_.curry(sendData, 2)(res))
    .catch(_.curry(sendError, 2)(res));
}
