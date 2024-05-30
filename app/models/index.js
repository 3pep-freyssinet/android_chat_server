'use strict';
require('dotenv').config();

const fs 		= require('fs');
const path 		= require('path');
const Sequelize = require('sequelize');
const basename 	= path.basename(__filename);
const env 		= process.env.NODE_ENV || 'development';


//const config = require(__dirname + '/../config/config.json')[env]; //original
console.log(" models.index *************env = " + env)
const config = require(__dirname + '/../config/config.js')[env]; //moi

const db = {};

console.log("********* config = " + Object.keys(config));
console.log("********* 'model/index.js' : process.env = " + Object.keys(process.env));
console.log("********* 'model/index.js' : process.env.DATABASE_URL = " + process.env.DATABASE_URL);

console.log("********* 'model/index.js' : config = " + Object.keys(config));
console.log("********* 'model/index.js' : config.use_env_variable = " + config.use_env_variable);
console.log("********* 'model/index.js' : process.env[config.use_env_variable] = " + process.env['config.use_env_variable']);
console.log("********* 'model/index.js' : config.use_env_variable] = " + process.env[config.use_env_variable]);

let sequelize;
sequelize = new Sequelize(process.env[config.use_env_variable], config);
if(config.use_env_variable) {
  console.log("********* 'model/index.js' : process.env[config.use_env_variable] = " + process.env[config.use_env_variable]);
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  console.log("********* ici " + config.use_env_variable);
  //sequelize = new Sequelize(config.database, config.username, config.password, config.options); //original : use the values in 'config.js'
}


//test connection
async function testDbConnection() {
	try{
		return await sequelize.authenticate();
		//return "hello the world";
		console.log("'models/index.js' : connection success");
	}catch(error){
		console.error("'models/index.js' : connection fail : ", error);
		throw error;
	}
}

testDbConnection().then(res => console.log("test connection : " + res));;


fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
	  console.log(" models.index *************FILE IS ",file)
	  //*** error : require is not a function
	  // if one of your files in the /models directory is not defining a model correctly. Eg a completely commented out file in this directory will cause this error to occur.
      // You can debug which file is causing the issue by adding a console.log in the forEach loop:
	  // the last "FILE IS" statement before the crash is the problem.
      //***
    //const model = sequelize['import'](path.join(__dirname, file)); //error 'sequelize.import' is not a function
	const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes); //require is not a function
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;