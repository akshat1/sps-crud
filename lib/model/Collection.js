const {
  STRING,
} = require('sequelize');

/**
 * A collection of items.
 * @memberof module:lib/model
 * @property {string} id   - A unique id (not db generated). PrimaryKey.
 * @property {string} name - The collection name; maximum 1024 characters in length.
 */
const Collection = {
  id: {
    type: STRING,
    primaryKey: true
  },
  name: STRING(1024),
};

module.exports = Collection;
