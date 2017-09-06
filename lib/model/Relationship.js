const {
  JSONB,
  INTEGER,
} = require('sequelize');

/**
 * A general purpose relationship object.
 * @memberof module:lib/model
 * @property {Object} attributes
 * @property {number} id
 */
const Relationship = {
  attributes: JSONB,
  id: {
    type: INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
};

module.exports = Relationship;
