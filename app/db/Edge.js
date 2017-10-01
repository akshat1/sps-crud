/**
 * An Edge in the graph.
 * @typedef {Object} Edge
 * @name module:app/db.Edge
 * @property {number} id - auto-incrementing, primary-key
 * @property {Object} metadata
 * @property {Vertex} from
 * @property {Vertex} to
 * @property {EdgeType} type
 * @property {number} strength
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
    JSONB
  } = DataTypes;
  return sequelize.define('edge', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    metadata: {
      type: JSONB
    },
    strength: {
      type: INTEGER
    }
  });
}
