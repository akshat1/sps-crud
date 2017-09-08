/**
 * A Vertex in the graph.
 * @typedef {Object} Vertex
 * @name module:lib/model.Vertex
 * @property {number} id - auto-incrementing, primary-key
 * @property {string} name - max 255 characters
 * @property {Object} metadata
 * @property {Edge} relationships
 */

/**
 * The sequelize define function.
 * @param {Object} sequelize - the sequelize instant.
 * @param {Object} DataTypes - sequelize datatypes.
 * @returns {Object} - A defined sequelize model.
 */
module.exports = function(sequelize, DataTypes) {
  const {
    INTEGER,
    STRING,
    JSONB
  } = DataTypes;
  return sequelize.define('vertex', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: STRING(255)
    },
    metadata: {
      type: JSONB
    }
  });
}
