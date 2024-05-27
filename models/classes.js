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
    classe: {
      type: DataTypes.CHAR(10),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "classe",
      autoIncrement: false
    }
  };
  const options = {
    tableName: "classes",
    comment: "",
    indexes: []
  };
  const ClassesModel = sequelize.define("classes_model", attributes, options);
  return ClassesModel;
};