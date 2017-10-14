const HTTPCodes = require('../http-codes');
const SSCommon  = require('simian-server-common');

const logger = SSCommon.logger.getLogger({ level: 'debug' });

module.exports = function sendError(res, error) {
  logger.error('Error occurred', error);
  return res
    .status(error.statusCode || HTTPCodes.internalServerError)
    .send({
      success: false,
      error
    });
}
