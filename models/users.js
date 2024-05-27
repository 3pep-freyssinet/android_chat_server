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
    firstName: {
      type: DataTypes.CHAR(255),
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "firstName",
      autoIncrement: false
    },
    lastName: {
      type: DataTypes.CHAR(255),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "lastName",
      autoIncrement: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "createdAt",
      autoIncrement: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "updatedAt",
      autoIncrement: false
    }
  };
  const options = {
    tableName: "users",
    comment: "",
    indexes: []
  };
  const UsersModel = sequelize.define("users_model", attributes, options);
  return UsersModel;
};