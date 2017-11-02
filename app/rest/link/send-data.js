const { getLogger } = require('../../util');
const HTTPCodes = require('../http-codes');

const logger = getLogger();

module.exports = function sendData(res, data) {
  logger.debug('Sending data', data);
  return res
    .status(HTTPCodes.ok)
    .json({
      success: true,
      data
    });
}
