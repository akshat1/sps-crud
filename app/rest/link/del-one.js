const _         = require('lodash');
const SSCommon  = require('simian-server-common');
const sendData  = require('./send-data');
const sendError = require('./send-error');

const logger = SSCommon.logger.getLogger({ level: 'debug' });

module.exports = function delOne(model, req, res) {
  const { id } = req.params;
  logger.debug(`del(${id})`);
  return model
    .destroy({
      where: {
        id
      }
    })
    .then(deleted => sendData(res, { deleted })) // send number of deleted records. Should be 1 
    .catch(_.curry(sendError, 2)(res));
}
