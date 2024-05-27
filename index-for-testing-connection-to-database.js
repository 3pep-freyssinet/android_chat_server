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
/*

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


//postgres://tomcaty_tomatish:tomcat14200@johnny.heliohost.org:5432/tomcaty_Supabase_pgsql

/*
//Render
const pool = new Pool({
  //connectionString: DATABASE_URL,
   connectionString:process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  tls: {
  rejectUnauthorized: false
  }
});
*/

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
});
*/


//Aiven + env
const pool = new Pool({
  user: 'avnadmin',
  host: 'pg-6b221ac-android-chat.e.aivencloud.com',
  database: 'defaultdb',
  password: process.env.PASSWORD,
  port: 25884,
  client_encoding: 'utf8',
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync("./ca.pem").toString(),
  },
  max: 20,
  min: 1,
  idleTimeoutMillis: 1000,
});

console.log('process.env.DATABASE_URL = ' + process.env.DATABASE_URL);
console.log('process.env.USER = ' + process.env.PASSWORD);
console.log('pool = ' + pool + ' +Object.keys(pool) = ' + Object.keys(pool));

pool.connect(function(err){
	if(err)throw err;
	pool.query("SELECT VERSION()", [], function(err, result){
		if(err)throw err;
		console.log('version = ' + JSON.stringify(result.rows[0]));
		pool.end(function(err){
			if(err)throw err;
		});
	});
});

/////////////////////////////////////////////////////////////////////////////////////////////////
//Testing db

console.log("*********** Testing db *****************");
var query = "SELECT COUNT(filedata) FROM images";
pool.query(query,[], async(error, results) =>{
		
			const promise = new Promise((resolve, reject) => {
				 resolve(results); 
			});
			
			//if(error)(reject("promise error "+error)); 
			let res = await promise;
			promise.then((value) => {	// value et result la même chose
			  console.log("promise then 'UPDATE users'  results = " + results); //JSON.stringify(results.rowCount));
				
			  var res = (results.rowCount == 1) ? "success" : "failure" ;
			  console.log("Testing db : " + res);
			  
			}).catch((error) =>{
				console.log("promise 'IUPDATE users' error : " + error.message);
				console.log("promise 'IUPDATE users' error : " + error.stack);
				console.error(error);
			});
		});
