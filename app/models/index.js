'use strict';
require('dotenv').config();

const fs 		= require('fs');
const path 		= require('path');
const Sequelize = require('sequelize');
const basename 	= path.basename(__filename);
const env 		= process.env.NODE_ENV || 'development';


//const config = require(__dirname + '/../config/config.json')[env]; //original
console.log(" models.index *************process.env.NODE_ENV = " + process.env.NODE_ENV);
console.log(" models.index *****************process.env.PORT = " + process.env.PORT);
console.log(" models.index ******************************env = " + env);
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
console.log("'process.env.DATABASE = '" + process.env.DATABASE + "\n" +
            "'process.env.USER     = '" + process.env.USER     + "\n" +
			"'process.env.PASSWORD = '" + process.env.PASSWORD + "\n" +
			"'process.env.HOST     = '" + process.env.HOST     + "\n" +
			"'process.env.PORT     = '" + process.env.PORT     
			);

/*		
sequelize = new Sequelize(
							process.env.DATABASE, 
							process.env.USER, 
							process.env.PASSWORD, 
							{ "host":process.env.HOST,
							  "port":process.env.PORT,
							  "dialect":'postgres',   
							  "client_encoding": 'utf8',
							  dialectOptions: {
								ssl: {
									require: true, //seule, marche bd render
									"ca": fs.readFileSync("./ca.pem").toString(), //require=true, ca et port=5000: error : Port scan timeout reached, failed to detect open port 25884 from PORT environment variable. Bind your service to port 25884 or update the PORT environment variable to the correct port
																					//require=true, ca et port=PORT=25884 : marche
								}
							  }
							});
*/

sequelize = new Sequelize(process.env[config.database], 
							process.env[config.user], 
							process.env[config.password], 
							config.options); //original : use the values in 'config.js'

/*
//sequelize = new Sequelize(process.env[config.use_env_variable], config);
if(config.use_env_variable) {
 console.log("********* 'connection string' *************");
 console.log("********* 'model/index.js' : process.env[config.use_env_variable] = " + process.env[config.use_env_variable]);
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  console.log("********* 'connection parameter' *************config.options = " +  Object.keys(config.options));
  console.log("********* 'connection parameter' *************config.options.dialect = " +  config.options.dialect);
  sequelize = new Sequelize(process.env[config.database], 
							process.env[config.username], 
							process.env[config.password], 
							config.options); //original : use the values in 'config.js'
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
*/

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