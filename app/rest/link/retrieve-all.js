const sendError = require('./send-error');
const sendData  = require('./send-data');
const SSCommon  = require('simian-server-common');
const _         = require('lodash');

const logger = SSCommon.logger.getLogger({ level: 'debug' });

module.exports =  function retrieveAll(model, req, res) {
  logger.debug('retrieveAll', req.body);
  const {
    limit,
    offset,
    order,
    query
  } = req.params;

  // TODO: Understand query syntax better
  return model
    .findAll({
      limit,
      offset,
      order,
      where: query
    })
    .then(items => sendData(res, {
      count: items.length,
      items,
      offset,
      order
    }))
    .catch(_.curry(sendError, 2)(res))
}

