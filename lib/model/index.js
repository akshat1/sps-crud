/**
 * Model for a simple graph. Initializes the DB and exports the models.
 * @module lib/model
 */
const Sequelize  = require('sequelize');
const { config } = require('simian-server-common');

const connectionString = config.get('db.connectionString');
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

sequelize.sync({ force: true });

module.exports = db;
