/**
 * Starts the REST api.
 *
 * @module app/rest
 */
// Non HATEOS; Less than perfect REST.
const bodyParser = require('body-parser');
const express    = require('express');
const SSCommon   = require('simian-server-common');
const db         = require('../db');
const link       = require('./link');

const logger = SSCommon.logger.getLogger({ level: 'debug' });

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
