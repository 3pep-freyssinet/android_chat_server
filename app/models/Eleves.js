const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Eleves extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
	  
    }
  }
  
  Eleves.init(
  {
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
      /*
	  references: {
        key: "id",
        model: "Classes"
      }
	  */
    }
	 //createdAt: false,	//remove these statements if there are no corresponding columns in the original table. Put 'timestamps: false below.
     //updatedAt: false
  },
  {
      // options
      sequelize,
      modelName: 'Eleves',
      tableName: 'eleves',
	  timestamps: false,
      underscore: true
    },
  );
  
  Eleves.associate = function(models) {
    // associations can be defined here
	Eleves.hasMany(models.Notes, {
      foreignKey: 'ideleves',
      as: 'notes',
      onDelete: 'CASCADE',
    });
	
	Eleves.belongsTo(models.Classes, {
      foreignKey: 'idclasses',
      as: 'section',
      onDelete: 'CASCADE',
    });
	
  }
  return Eleves;
};