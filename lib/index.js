const Sequelize = require('sequelize');
const { config } = require('simian-server-common');
const { getModel } = require('./model');

const connectionString = config.get('db.connectionString');
const sequelize = new Sequelize(connectionString);
const Model = getModel(sequelize);
console.log(Model);
