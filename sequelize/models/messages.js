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
    fromnickname: {
      type: DataTypes.CHAR(50),
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "fromnickname",
      autoIncrement: false
    },
    tonickname: {
      type: DataTypes.CHAR(50),
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "tonickname",
      autoIncrement: false
    },
    message: {
      type: DataTypes.CHAR(1000),
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "message",
      autoIncrement: false
    },
    time: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "time",
      autoIncrement: false
    },
    extra: {
      type: bytea,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "extra",
      autoIncrement: false
    },
    extraname: {
      type: DataTypes.CHAR(100),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "extraname",
      autoIncrement: false
    },
    ref: {
      type: DataTypes.CHAR(100),
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "ref",
      autoIncrement: false
    }
  };
  const options = {
    tableName: "messages",
    comment: "",
    indexes: []
  };
  const MessagesModel = sequelize.define("messages_model", attributes, options);
  return MessagesModel;
};