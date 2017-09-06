const {
  JSONB,
  STRING,
} = require('sequelize');

/**
 * A single item in the database, as identified by an adapter.
 * @memberof module:lib/model
 * @property {string} adapterName    - Package name of the adapter that identified this file.
 * @property {string} id             - A unique id (not db generated). e.g. for files, this could
 *                                     be a hash of the path. PrimaryKey.
 * @property {Object} metadata       - The metadata about the file provided by the adapter.
 *                                     Adapters should include versioning to account for
 *                                     changing metadata format in future.
 * @property {string} name           - Name of the item; maximum 1024 characters long.
 */
const Item = {
  adapterName: STRING(128),
  id: {
    type: STRING,
    primaryKey: true
  },
  metadata: JSONB,
  name: STRING(1024),
};

module.exports = Item;
