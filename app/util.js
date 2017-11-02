const {
  config,
  logger
}  = require('simian-server-common');

function getLogger(levelOverride) {
  return logger.getLogger({ level: levelOverride || config.get('global.logging.level') || 'info' });
}

module.exports = {
  getLogger
};