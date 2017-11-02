const { getLogger } = require('../../util');
const HTTPCodes = require('../http-codes');

const logger = getLogger();

module.exports = function sendError(res, error) {
  logger.error('Error occurred', error);
  return res
    .status(error.statusCode || HTTPCodes.internalServerError)
    .send({
      success: false,
      error
    });
}
