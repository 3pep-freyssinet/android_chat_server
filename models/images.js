const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    name: {
      type: DataTypes.CHAR(50),
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "name",
      autoIncrement: false
    },
    filedata: {
      type: bytea,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "filedata",
      autoIncrement: false
    },
    owner: {
      type: DataTypes.CHAR(50),
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "owner",
      autoIncrement: false
    },
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: true,
      field: "id",
      autoIncrement: true
    },
    ref: {
      type: DataTypes.CHAR(50),
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "ref",
      autoIncrement: false
    },
    time: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: "0",
      comment: null,
      primaryKey: false,
      field: "time",
      autoIncrement: false
    }
  };
  const options = {
    tableName: "images",
    comment: "",
    indexes: []
  };
  const ImagesModel = sequelize.define("images_model", attributes, options);
  return ImagesModel;
};