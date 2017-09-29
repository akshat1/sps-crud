const db = require('../db');
const restify = require('restify');

db
  .sync()
  .then(function() {
    const server = restify.createServer();

    // Vertices
    server.put('/vertex', function(req, res, next) {
      console.log('C/U vertex');
      res.send({
        data: []
      });
      next();
    });

    server.post('/vertex', function(req, res, next) {
      console.log('R vertex');
      res.send({
        data: []
      });
      next();
    });

    server.del('/vertex', function(req, res, next) {
      console.log('D vertex');
      res.send({
        deleted: 0
      });
      next();
    });

    server.listen(8080, function() {
      console.log('%s listening at %s', server.name, server.url);
    });
  });
