const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: true,
      field: "id",
      autoIncrement: true
    },
    note: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "note",
      autoIncrement: false
    },
    ideleves: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "ideleves",
      autoIncrement: false,
      references: {
        key: "id",
        model: "eleves_model"
      }
    }
  };
  const options = {
    tableName: "notes",
    comment: "",
    indexes: []
  };
  const NotesModel = sequelize.define("notes_model", attributes, options);
  return NotesModel;
};