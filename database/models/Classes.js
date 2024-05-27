const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Classes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
	  
    }
  }
  
  Classes.init(
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
    classe: {	//column 'classe', do not confuse with the object 'Classes'.
      type: DataTypes.CHAR(10),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "classe",
      autoIncrement: false
    }
  },
    {
      // options
      sequelize,
      modelName: 'Classes',
      tableName: 'classes',
	  timestamps: false,
      underscore: true
    },
  );
  
  Classes.associate = function(models) {
    // associations can be defined here
	Classes.hasMany(models.Eleves, {
      foreignKey: 'idclasses',
      as: 'eleve',
      onDelete: 'CASCADE',
    })
  }
  
  return Classes;
};