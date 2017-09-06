/**
 * Model for the Simian-Store.
 * @module lib/model
 */

function getModel(sequelize) {
  const Collection = sequelize.define('collection', require('./Collection'), {
    paranoid: true,
    version: true,
    indexes: [{
      unique: true,
      fields: ['id']
    }]
  });

  const Item = sequelize.define('item', require('./Item'), {
    paranoid: true,
    version: true,
    indexes: [{
      unique: true,
      fields: ['id']
    }]
  });

  /*const Relationship = sequelize.define('relationship', require('./Relationship'), {
    paranoid: true,
    version: true,
    indexes: [{
      unique: true,
      fields: ['id']
    }]
  });*/

  Item.belongsToMany(Collection, { through: 'ItemCollection' });
  Collection.belongsToMany(Item, { through: 'ItemCollection' });

  return sequelize.sync()
    .then(() => ({
      Collection,
      Item,
    }))
    .catch(console.error.bind(console));
}

module.exports = { getModel };
