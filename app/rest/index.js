const db = require('../db');
const express = require('express');
const HTTPCodes = require('./http-codes');
const bodyParser = require('body-parser');

/**
 * Sets up CRUD api for a sequelize model to the server.
 *
 * @param {Object} server - The server instance.
 * @param {Object} model - The sequelize model.
 */
function link(server, model) {
  console.log(`link ${model.name}`);
  server
    .route(`/${model.name}`)
    // Create, replace
    .put(createUpdate)
    .post(retrieve)
    .delete(del);
}

function createUpdate(req, res, next) {
  // req.body is a json object.
  res
    .status(HTTPCodes.ok)
    .send(req.body);
  return next(false);
}

function retrieve() {}
function del() {}

db
  .sync()
  .then(function() {
    const server = express();
    server.use(bodyParser.urlencoded({ extended: true }));
    server.use(bodyParser.json());
    // TODO this in a for-each for all models
    link(server, db.Vertex);
    server.listen(8080, function() {
      console.log('%s listening at %s', server.name, server.url);
    });
  });
