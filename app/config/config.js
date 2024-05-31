require('dotenv').config();	//localy, loads environment variables from a .env file into process.env 
//The .env file should never be committed to the source code repository. the file must be placed  into the .gitignore file. (When using git.)
const fs       = require("fs");

/*
//local
module.exports = {
	development: {
		"username": "postgres",
		"password": 'tomcat@14200',
		"database": "postgres",
		"host": "127.0.0.1",
		"dialect": "postgres"
	}
};
*/

/*
//local + env + connection String
module.exports = {
  development: {
    "use_env_variable": 'DATABASE_URL',
    "dialect": 'postgres',
	dialectOptions: {
			ssl: {
				require: true, // This will help you. But you will see nwe error
				rejectUnauthorized: false, // This line will fix new error
			    ca: fs.readFileSync("./ca.pem").toString(),
			}
	},
	max: 20,
	min: 1,
	idleTimeoutMillis: 1000
  },
  test: {
    "url": 'DATABASE_URL',
    "dialect": 'postgres',
  },
  production: {
    "use_env_variable": 'DATABASE_URL',
	"options":{
	    "dialect": 'postgres',
	    dialectOptions: {
			ssl: {
				require: true, // This will help you. But you will see nwe error
				rejectUnauthorized: false, // This line will fix new error
				ca: fs.readFileSync("./ca.pem").toString(),
			}
		},
		max: 20,
		min: 1,
		idleTimeoutMillis: 1000
    }
  }
};
*/


//local + env + parameters
module.exports = {
  development: {
    "username": 'USER',     // USERNAME is used by windows in system environment variable //, 'postgres',
    "password": 'PASSWORD', //'', 
    "database": 'DATABASE', //'postgres', 
    "options":{
		"host": 'HOST',     //'127.0.0.1',
		//"port": 5432,
		"dialect": 'postgres',
		"ssl": true
	}
  },
  test: {
    url: process.env.TEST_DATABASE_URL,
    dialect: 'postgres',
  },
  production: {
    "username": 'USER3',     // USERNAME is used by windows in system environment variable  //, 'postgres',
    "password": 'PASSWORD3', //'', 
    "database": 'DATABASE3', //'postgres', 
    "options":{
		"host": process.env.HOST3,     //'127.0.0.1', 'localhost'
		//"port": 'PORT',     //5432
	    "dialect": 'postgres',
	    dialectOptions: {
			ssl: {
				require: true, // This will help you. But you will see nwe error
				rejectUnauthorized: false, // This line will fix new error
				ca: fs.readFileSync("./ca.pem").toString(),
			}
		},
		max: 20,
		min: 1,
		idleTimeoutMillis: 1000
    }
  }
};

/*
//local + url
module.exports = {
  development: {
    url: process.env.DEV_DATABASE_URL,
    dialect: 'postgres',
  },
  test: {
    url: process.env.TEST_DATABASE_URL,
    dialect: 'postgres',
  },
  production: {
    use_env_variable: process.env.DEV_DATABASE_URL,
    dialect: 'postgres',
	ssl: true,
	dialectOptions: {
    ssl: {
      require: true, 			// This will help you. But you will see new error ****************************************
      rejectUnauthorized: false // This line will fix new error **********************************************************
    }
  },
  }
};
/*

/*
//heroku
module.exports = {
  development: {
    url: process.env.DEV_DATABASE_URL,
    dialect: 'postgres',
  },
  test: {
    url: process.env.TEST_DATABASE_URL,
    dialect: 'postgres',
  },
  production: {
    use_env_variable: process.env.HEROKU_POSTGRESQL_ROSE_URL,
    dialect: 'postgres',
	ssl: true,
	dialectOptions: {
    ssl: {
      require: true, 			// This will help you. But you will see new error ****************************************
      rejectUnauthorized: false // This line will fix new error **********************************************************
    }
  },
  }
};
*/

/*
{
  "development": {
    "username": "root",
    "password": null,
    "database": "database_development",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
*/
