/*
socket.emit('message', "this is a test"); //sending to sender-client only
socket.broadcast.emit('message', "this is a test"); //sending to all clients except sender
socket.broadcast.to('game').emit('message', 'nice game'); //sending to all clients in 'game' room(channel) except sender
socket.to('game').emit('message', 'enjoy the game'); //sending to sender client, only if they are in 'game' room(channel)
socket.broadcast.to(socketid).emit('message', 'for your eyes only'); //sending to individual socketid
io.emit('message', "this is a test"); //sending to all clients, include sender
io.in('game').emit('message', 'cool game'); //sending to all clients in 'game' room(channel), include sender
io.of('myNamespace').emit('message', 'gg'); //sending to all clients in namespace 'myNamespace', include sender
socket.emit(); //send to all connected clients
socket.broadcast.emit(); //send to all connected clients except the one that sent the message
socket.on(); //event listener, can be called on client to execute on server
io.sockets.socket(); //for emiting to specific clients
io.sockets.emit(); //send to all connected clients (same as socket.emit)
io.sockets.on() ; //initial connection from a client.
*/
require('dotenv').config();
const express = require('express')
//const path = require('path')
const PORT = process.env.PORT || 5000
http   = require('http'),
app    = express(),
server = http.createServer(app),

//io   = require('socket.io').listen(server); //socket.io version 2.
io     = require('socket.io')(server);	//socket.io version 4.4.
server.listen(PORT, () => console.log(`Listening on ${ PORT }`)) //socket.io version 2.

//var sequelize = require('socket.io-sequelize');

const pgsqldb  = require('./queries')
const fs       = require("fs");
const url      = require('url');
const utf8     = require('utf8');
const crypto   = require('crypto');


///const mysql = require('mysql2')
//console.log('process.env.DATABASE_URL = ' + process.env.DATABASE_URL)
//const connection = mysql.createConnection(process.env.DATABASE_URL)
//console.log('Connected to PlanetScale!')
//connection.end();

//Sequelize-pgsql
//io.use(sequelize('pgsql', 'postgres', 'tomcat14200', { host: 'localhost' }, 'D:\node-pg-sequelize\models'));

const { Pool } = require('pg');

/*
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
*/
//const Pool = require('pg').Pool

/*
//localhost
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'tomcat@14200',
  port: 5432,
  client_encoding: 'utf8',
  //ssl: true,
  max: 20,
  min: 1,
  idleTimeoutMillis: 1000,
})
*/

/*
//Heroku
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
*/

/*
//Heroku other color db qui marche au 21-05-22
const pool = new Pool({
  connectionString: process.env.HEROKU_POSTGRESQL_PURPLE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
*/


//Render
const pool = new Pool({
  //connectionString: DATABASE_URL,
   connectionString:process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


/*
//HelioHost
const pool = new Pool({
  user: 'tomcaty_tomatish',
  host: 'johnny.heliohost.org',
  database: 'tomcaty_Supabase_pgsql',
  password: 'tomcat14200',
  port: 5432,
  client_encoding: 'utf8',
  //ssl: true,
  max: 20,
  min: 1,
  idleTimeoutMillis: 1000,
})
*/

//console.log('process.env.DATABASE_URL = ' + process.env.DATABASE_URL);
console.log('pool = ' + pool);

/////////////////////////////////////////////////////////////////////////////////////////////////
//Testing db
console.log("*********** Testing db *****************");
var query = "SELECT COUNT(filedata) FROM images";
pool.query(query, (error, results, fields) => {
	if (error) {
		throw error
		console.log("error in 'SELECT COUNT(filedata) FROM images' : " + error); 
	}
	//console.log("results of 'SELECT COUNT(filedata) FROM images': "+JSON.stringify(results)); 
	//console.log("results of 'SELECT COUNT(filedata) FROM images': "+JSON.stringify(results.rows));			//array containing the number of rows in the result of query
	//console.log("results of 'SELECT COUNT(filedata) FROM images': "+JSON.stringify((results.rows)[0]));		//first element of array (first row), it a json. 
	console.log("results of 'SELECT COUNT(filedata) FROM images': "+(results.rows)[0].count);				    //the value of json key "count". the result of 'select count(filedata) FROM images";
	//console.log("results of 'SELECT COUNT(filedata) FROM images': "+JSON.stringify(results.fields[0].name));  //name of table field 'images'
	console.log("***********************************************************************************");
})