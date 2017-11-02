/**
 * Starts the REST api.
 *
 * @module app/rest
 */
// Non HATEOS; Less than perfect REST.
const bodyParser    = require('body-parser');
const express       = require('express');
const db            = require('../db');
const { getLogger } = require('../util');
const link          = require('./link');

const logger = getLogger();

db
  .sync()
  .then(function() {
    const server = express();
    server.use(bodyParser.urlencoded({ extended: true }));
    server.use(bodyParser.json());
    link(server, db.Edge);
    link(server, db.EdgeType);
    link(server, db.Vertex);
    server.listen(8080, function() {
      logger.debug('Server up!');
    });
  });
