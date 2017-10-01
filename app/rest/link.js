const HTTPCodes = require('./http-codes');
const Errors    = require('./errors');
const SSCommon  = require('simian-server-common');
const _         = require('lodash');

const logger = SSCommon.logger.getLogger({ level: 'debug' });

function sendError(res, error) {
  logger.error('Error occurred', error);
  return res
    .status(error.statusCode || HTTPCodes.internalServerError)
    .send({
      success: false,
      error
    });
}

function sendData(res, data) {
  logger.debug('Sending data', data);
  return res
    .status(HTTPCodes.ok)
    .json({
      success: true,
      data
    });
}

function createOne(model, createArgs) {
  return model.create(createArgs);
}

function retrieveOne(model, req, res) {
  const { id } = req.params;
  logger.debug(`retrieveOne(${id})`);
  return model
    .findById(id)
    .then(_.curry(sendData)(res))
    .catch(_.curry(sendError)(res));
}

function retrieveAll(model, req, res) {
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
    .catch(_.curry(sendError)(res))
}

async function updateOne(model, itemData) {
  const item = await model.findOne(itemData.id);
  if (!item) {
    throw Errors.NotFound();
  }

  item.set(itemData);
  return item.save();
}

function createUpdateAll(model, req, res) {
  logger.debug('createUpdateAll', req.body);
  // req.body is a json object.
  const { items } = req.body;
  if (!items) {
    return sendError(res, new Errors.MissingArgs('items'));
  }
  
  Promise
    .all(items.map(createArgs => createArgs.hasOwnProperty('id') ? updateOne(model, createArgs) : createOne(model, createArgs)))
    .then(_.curry(sendData)(res))
    .catch(_.curry(sendError)(res));
}

function delOne(model, req, res) {
  const { id } = req.params;
  logger.debug(`del(${id})`);
  return model
    .destroy({
      where: {
        id
      }
    })
    .then(deleted => sendData(res, { deleted })) // send number of deleted records. Should be 1 
    .catch(_.curry(sendError)(res));
}

function delAll(model, req, res) {
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
    .catch(_.curry(sendError)(res));
}

/**
 * Sets up CRUD api for a sequelize model to the server.
 *
 * @memberof module:app/rest
 * @param {Object} server - The server instance.
 * @param {Object} model - The sequelize model.
 */
function link(server, model) {
  logger.debug(`link ${model.name}`);

  // Finally, wire things up.
  server.route(`/${model.name}`)
    .put(_.curry(createUpdateAll)(model))
    .post(_.curry(retrieveAll)(model))
    .delete(_.curry(delAll)(model));
  
  server.route(`/${model.name}/:id`)
    .get(_.curry(retrieveOne)(model))
    .put(_.curry(updateOne)(model))
    .delete(_.curry(delOne)(model));
}

module.exports = {
  // This is the only function that needs to be called
  link,

  // The following are only exported so that they may be tested
  sendError,
  sendData,
  createOne,
  retrieveOne,
  retrieveAll,
  updateOne,
  createUpdateAll,
  delOne,
  delAll
};