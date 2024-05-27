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
    author: {
      type: DataTypes.CHAR(40),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "author",
      autoIncrement: false
    },
    isbn: {
      type: DataTypes.CHAR(40),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "isbn",
      autoIncrement: false
    }
  };
  const options = {
    tableName: "restdbaccess",
    comment: "",
    indexes: []
  };
  const RestdbaccessModel = sequelize.define("restdbaccess_model", attributes, options);
  return RestdbaccessModel;
};