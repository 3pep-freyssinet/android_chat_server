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
      autoIncrement: false
    },
    name: {
      type: DataTypes.CHAR(40),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "name",
      autoIncrement: false
    }
  };
  const options = {
    tableName: "rest_db_access",
    comment: "",
    indexes: []
  };
  const RestDbAccessModel = sequelize.define("rest_db_access_model", attributes, options);
  return RestDbAccessModel;
};