const Errors   = require('../errors');
const SSCommon = require('simian-server-common');

const logger = SSCommon.logger.getLogger({ level: 'debug' });

module.exports = async function updateOne(model, itemData) {
  const item = await model.findById(itemData.id);
  if (!item) {
    logger.warn(`no item found for id ${itemData.id}`);
    throw new Errors.NotFound();
  }

  item.set(itemData);
  return item.save();
}
