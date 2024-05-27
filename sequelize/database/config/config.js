require('dotenv').config();	//localy, loads environment variables from a .env file into process.env 
//The .env file should never be committed to the source code repository. the file must be placed  into the .gitignore file. (When using git.)


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
use_env_variable: process.env.HEROKU_POSTGRESQL_ROSE_URL,

//local + env
module.exports = {
  development: {
    use_env_variable: process.env.DEV_DATABASE_URL,
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
