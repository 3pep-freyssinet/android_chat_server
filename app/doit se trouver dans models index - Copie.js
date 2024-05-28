/*
'config.js' file content.
---------------------
module.exports = {
  development: {
    db: 'mongodb://localhost/noobjs_dev',
    root: rootPath,
    // ...
  },
  test: {
    db: 'mongodb://localhost/noobjs_test',
    root: rootPath,
    // ...
  },
  production: {}
}
--------------------
Looking at their 'config.js' example (above), that file exports an JSON object with keys ('development', 'test' and 'production')
each environment as keys:

The square brackets will select only the configs related to the environment defined in your NODE_ENV variable.

Assuming NODE_ENV holds the value development, this would be the same as doing this:

var config = require('./config/config').development;
Which is the same as this:

var config = require('./config/config')['development'];
The advantage of square brackets it that they allow you to select the key on the object dynamically.
*/

'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename); 
//const env = process.env.NODE_ENV || 'development'; //look in system environment variable a 'NODE_ENV' value. If it doesn' exist then 'env' is set to 'development'
													//we can set a variable by 'SET' like 'SET NODE_ENV = "...."'
													// we can get all the environment variable by the command : SET (without parameter).
													
//test
const env = 'development';

console.log("process.env : : see 'database/models/index.js' = " + Object.keys(process.env)); //all the environment variaba of the system.
console.log("process.env.NODE_ENV : : see 'database/models/index.js' = " + env);

//const config = require(__dirname + '/../config/config.js')[env];	//See above line 29 the purpose of [].
//Here, we pick from 'config.js' the key associated to the 'env'. Since 'env' it assigned to 'development' or what holds 'process.env.NODE_ENV' see line 38.
//then, we pick from 'config.js' what is associated to the 'development' key or what is associated to 'process.env.NODE_ENV'.

/* the key 'development' in 'config.js'
module.exports = {
  development: {
    use_env_variable: process.env.DEV_DATABASE_URL,
    dialect: 'postgres',
  },
*/


const db = {};

console.log(" ************process.env.DEV_DATABASE_URL see 'database/models/index.js'= " + process.env.DEV_DATABASE_URL)
//'config' renvoie la cle 'development' dans 'config.js'. 'config.use_env_variable' renvoie la clé 'use_env_variable' de la cle 'development' dans 'config.js' qui contient 'process.env.DEV_DATABASE_URL'
//'process.env.DEV_DATABASE_URL' est le contenu du parametre 'DEV_DATABASE_URL' qui se trouve soit dand le fichier '.env' soit dans les variables d'environment.
//console.log(" ************config.use_env_variable : see 'database/models/index.js' = " + config.use_env_variable); //config[env]); //[use_env_variable]);

/*
let sequelize;
if (config.use_env_variable) {
	console.log("using environment variable : see 'database/models/index.js'");
	//sequelize = new Sequelize(process.env[config.use_env_variable], config);	//original
	sequelize = new Sequelize(config.use_env_variable, config);
	console.log("using environment variable, sequelize = "+sequelize);
} else {
	console.log("not using environment variable : : see 'database/models/index.js");
	sequelize = new Sequelize(config.database, config.username, config.password, config);	//original
	//sequelize = new Sequelize(config.url, config);
}
*/

//Connection string
//let sequelize = new Sequelize(config.use_env_variable);
//console.log("using environment variable. see 'database/models/index.js' sequelize = " + sequelize);

//Separated parameters
//console.log("using environment variable. see 'database/models/index.js' config = " + JSON.stringify(config))
//const sequelize = new Sequelize(config.database, config.username, config.password, config.options);
  
/*
fs
  .readdirSync(__dirname)
  .filter(file => {
	return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
	console.log("model.name = "+model.name);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! export db : config.js = " + Object.keys(db));
*/

module.exports = db;
