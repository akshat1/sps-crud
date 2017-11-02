const _             = require('lodash');
const { getLogger } = require('../../util');
const sendData      = require('./send-data');
const sendError     = require('./send-error');

const logger = getLogger();

module.exports = function delAll(model, req, res) {
  logger.debug('delAll', req.body);
  const {
    query,
    limit
  } = req.body;
  
  const destroyArgs = {
    limit,
    where: query
  };
  
  return model
    .destroy(destroyArgs)
    .then(deleted => sendData(res, { deleted }))
    .catch(_.curry(sendError, 2)(res));
}
