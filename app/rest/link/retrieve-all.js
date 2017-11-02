const _             = require('lodash');
const { getLogger } = require('../../util');
const sendData      = require('./send-data');
const sendError     = require('./send-error');

const logger = getLogger('debug');

module.exports =  function retrieveAll(model, req, res) {
  logger.debug('retrieveAll', req.body);
  const {
    limit,
    offset,
    order,
    query
  } = req.body;

  const findAllArgs = {
    limit,
    offset,
    order,
    where: query
  };

  return model
    .findAll(findAllArgs)
    .then(items => sendData(res, {
      count: items.length,
      items,
      offset,
      order
    }))
    .catch(_.curry(sendError, 2)(res))
}

