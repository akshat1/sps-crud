const sendError = require('./send-error');
const sendData  = require('./send-data');
const SSCommon  = require('simian-server-common');
const _         = require('lodash');

const logger = SSCommon.logger.getLogger({ level: 'debug' });

module.exports = function delAll(model, req, res) {
  logger.debug('retrieveAll', req.body);
  const {
    query,
    limit
  } = req.body;
  return model
    .destroy({
      limit,
      where: query
    })
    .then(deleted => sendData(res, { deleted }))
    .catch(_.curry(sendError, 2)(res));
}
