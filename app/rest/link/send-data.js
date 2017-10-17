const SSCommon  = require('simian-server-common');
const HTTPCodes = require('../http-codes');

const logger = SSCommon.logger.getLogger({ level: 'debug' });

module.exports = function sendData(res, data) {
  logger.debug('Sending data', data);
  return res
    .status(HTTPCodes.ok)
    .json({
      success: true,
      data
    });
}
