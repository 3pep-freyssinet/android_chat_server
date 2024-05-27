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
    nom: {
      type: DataTypes.CHAR(20),
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "nom",
      autoIncrement: false
    },
    prenom: {
      type: DataTypes.CHAR(20),
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "prenom",
      autoIncrement: false
    },
    adresse: {
      type: DataTypes.CHAR(100),
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "adresse",
      autoIncrement: false
    },
    ville: {
      type: DataTypes.CHAR(20),
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "ville",
      autoIncrement: false
    },
    codepostal: {
      type: DataTypes.CHAR(10),
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "codepostal",
      autoIncrement: false
    },
    tel: {
      type: DataTypes.CHAR(10),
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "tel",
      autoIncrement: false
    },
    idclasses: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "idclasses",
      autoIncrement: false,
      references: {
        key: "id",
        model: "classes_model"
      }
    }
  };
  const options = {
    tableName: "eleves",
    comment: "",
    indexes: []
  };
  const ElevesModel = sequelize.define("eleves_model", attributes, options);
  return ElevesModel;
};