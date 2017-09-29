/**
 * As the name suggests, describes an Edge "Type".
 * @typedef {Object} EdgeType
 * @name module:lib.EdgeType
 * @property {number} id - auto-incrementing, primary-key
 * @property {Object} metadata
 * @property {string} name
 * @property {boolean} isDirectional
 */

/**
 * The sequelize define function.
 * @param {Object} sequelize - the sequelize instant.
 * @param {Object} DataTypes - sequelize datatypes.
 * @returns {Object} - A defined sequelize model.
 */
module.exports = function(sequelize, DataTypes) {
  const {
    BOOLEAN,
    INTEGER,
    JSONB,
    STRING,
  } = DataTypes;
  return sequelize.define('edge_type', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    metadata: {
      type: JSONB
    },
    name: {
      type: STRING(255)
    },
    isDirectional: {
      type: BOOLEAN
    }
  });
}
