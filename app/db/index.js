/**
 * Model for a simple graph. Initializes the DB and exports the models.
 * @module app/db
 */
const Sequelize  = require('sequelize');
const { config } = require('simian-server-common');

const connectionStringKey = typeof it === 'function' ? 'db.testConnectionString' : 'db.connectionString';
const connectionString = config.get(connectionStringKey);
if (!connectionString) {
  throw new Error(`No value defined for connection string >${connectionStringKey}<`);
}
const sequelize        = new Sequelize(connectionString);

const db = {};
const EdgeType = db['EdgeType'] = sequelize.import('./EdgeType.js');
const Edge     = db['Edge']     = sequelize.import('./Edge.js');
const Vertex   = db['Vertex']   = sequelize.import('./Vertex.js');

Edge.belongsTo(EdgeType);
Edge.belongsTo(Vertex, {as: 'from'});
Edge.belongsTo(Vertex, {as: 'to'});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.sync = function sync(opts) {
  if (process._simianDbSynced) return;
  return sequelize
    .sync(opts)
    .then(function(x) {
      process._simianDbSynced = true;
      return x;
    });
}

// sequelize.sync({ force: true });
module.exports = db;
