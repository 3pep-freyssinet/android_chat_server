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

/*
const express = require('express')
//const path = require('path')
const PORT = process.env.PORT || 5000
http   = require('http'),
app    = express(),
server = http.createServer(app),

//io   = require('socket.io').listen(server); //socket.io version 2.
io     = require('socket.io')(server);	//socket.io version 4.4.1 cf 'package.json'
server.listen(PORT, () => console.log(`Listening on ${ PORT }`)) //socket.io version 2.

//var sequelize = require('socket.io-sequelize');
*/

const express          = require("express");
const { createServer } = require("http");
var https              = require('https');
const { Server }       = require("socket.io");
//const cors             = require("cors");
//const Sequelize        = require("sequelize");
//const bodyParser       = require("body-parser");
//const validator        = require("express-validator");

const app        = express();
const PORT       = process.env.PORT || 5000

//*http and hhtps
// he WebSocket connection will use ws:// in development (plain HTTP) but will automatically upgrade 
// to wss:// in production on Render because the platform provides SSL termination.
const httpServer  = createServer(app);
const io          = new Server(httpServer, { /* options */ });
httpServer.listen(PORT, () => console.log(`   Listening on ${ PORT }`));

const pgsqldb  = require('./queries')
const fs       = require("fs");
const url      = require('url');
const utf8     = require('utf8');
const crypto   = require('crypto');
const route      = require('./routes') // an 'index.js' is expected in folder 'routes'

//module.exports = io;

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
// dont forget 'D:\Postgresql15\data\pg_hba.conf'. move the entry 'all all 127.0.0.1/32' to the first place
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
//'192.168.43.57' dont forget to ad 'host    all        all        192.168.43.57/32 	    scram-sha-256' in 'D:\Postgresql15\data\pg_hba.conf'
// this entry must be the unique entry in 'IPv4 local connections' or preceed 'all all 127.0.0.1/32'
const pool = new Pool({
  user: 'postgres',
  host: '192.168.43.57',
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

/*
//Render
const pool = new Pool({
  //connectionString: DATABASE_URL,
   connectionString:process.env.DATABASE_URL,
  ssl: {
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
})
*/


//Render + Aiven + env
const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
  client_encoding: 'utf8',
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync("./ca.pem").toString(),
  },
  max: 20,
  min: 1,
  idleTimeoutMillis: 1000,
});


/*
//Render + Heliohost + env
const pool = new Pool({
  user: process.env.USER1,
  host: process.env.HOST1,
  database: process.env.DATABASE1,
  password: process.env.PASSWORD1,
  port: process.env.PORT1,
  client_encoding: 'utf8',
  max: 20,
  min: 1,
  idleTimeoutMillis: 1000,
});
*/

//console.log('process.env.DATABASE_URL = ' + process.env.DATABASE_URL);
console.log('pool = ' + pool);

var ip = require("ip");
console.log("////////////////////////////////////: ip address //////////////////////////////////" +ip.address());
console.log("");
console.log("");

console.log("////////////////////////////////////: Testing db //////////////////////////////////");

pool.connect(function(err){
	if(err)throw err;
	pool.query("SELECT VERSION()", [], function(err, result){
		if(err)throw err;
		console.log('version = ' + JSON.stringify(result.rows[0]));
		//pool.end(function(err){
		//	if(err)throw err;
		//});
	});
});

/////////////////////////////////////////////////////////////////////////////////////////////////
//convert map to array
let map = new Map([['one', 1], ['ten', 10], ['hundred', 100]]);
console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! = " + JSON.stringify(map) + " !!!!!!!!!!!!!!!!!!!!!!!!!!!");
// "{}"
//It’s very inelegant but I convert to an array-of-arrays on the server-side, transmit that, and recreate the map on the client:

let users_ = JSON.stringify(Array.from(map));
let users = Array.from(map);
console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! = " + users + " !!!!!!!!!!!!!!!!!!!!!!!!!!!");
console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! = " + users[0] + " !!!!!!!!!!!!!!!!!!!!!!!!!!!");
console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! = " + users[1] + " !!!!!!!!!!!!!!!!!!!!!!!!!!!");
console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! = " + users[0][0] + " !!!!!!!!!!!!!!!!!!!!!!!!!!!");
console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! = " + users[0][1] + " !!!!!!!!!!!!!!!!!!!!!!!!!!!");

for (let user of users) {
       console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! id = " + user[0] + " name = " + user[1] + " !!!!!!!!!!!!!!!!");
}

//convert array to map
var usersMap = new Map(users)
console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! = " + usersMap + " !!!!!!!!!!!!!!!!!!!!!!!!!!!");
for (let user of usersMap) {
       //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! user " + user + " !!!!!!!!!!!!!!!!");
	   console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! id = " + user[0] + " name = " + user[1] + " !!!!!!!!!!!!!!!!");
}
/////////////////////////////////////////////////////////////////////////////////////////////////
// Variable to be monitored
let variable = 10;

// Handler for the proxy
const variableHandler = {
  set(target, property, value) {
    console.log(`Variable "${property}" changed from ${target[property]} to ${value}`);
    target[property] = value;
    return true;
  },
};

// Create a proxy for the variable
const monitoredVariable = new Proxy({ value: variable }, variableHandler);

// Access the variable through the proxy
console.log("---------------------Access the variable through the proxy 'monitoredVariable.value' = " + monitoredVariable.value); // Output: 10

// Modify the variable through the proxy
monitoredVariable.value = 20; // Output: Variable "value" changed from 10 to 20

// Access the variable directly
console.log("------------ Access the variable directly : variable = " + variable); // Output: 20        

console.log("/////////////////////////////////////////////////////////////////////////////////////////////////");

function watchVariable(obj, propName, callback) {
  let value = obj[propName];

  Object.defineProperty(obj, propName, {
    get() {
      return value;
    },
    set(newValue) {
      if (newValue !== value) {
        const oldValue = value;
        value = newValue;
        callback(newValue, oldValue);
      }
    },
  });
}

// Example usage
const data = {
  variable: 10,
};

watchVariable(data, 'variable', (newValue, oldValue) => {
  console.log(`§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§ Variable changed from ${oldValue} to ${newValue} §§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§`);
});

data.variable = 20;
// Output: Variable changed from 10 to 20

data.variable = 20; // No output, value didn't change   
console.log("/////////////////////////////////////////////////////////////////////////////////////////////////");

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Testing db
/////////////////////////////////////////////////////////////////////////////////////////////////

var query = "SELECT COUNT(filedata) FROM images";
pool.query(query,[], async(error, results) =>{
		
			const promise = new Promise((resolve, reject) => {
				 resolve(results); 
			});
			
			//if(error)(reject("promise error "+error)); 
			let res = await promise;
			promise.then((value) => {	// value et result la même chose
			  console.log("///////////////// promise then 'SELECT COUNT(filedata) FROM images'  results = " + results + " count = " + results.rows[0].count); //JSON.stringify(results.rowCount));
				
			  var res = (results.rowCount == 1) ? "success" : "failure" ;
			  console.log("/////////////// Testing db : status = " + res);
			  
			}).catch((error) =>{
				console.log("promise 'SELECT COUNT(filedata) FROM images' error : " + error.message);
				console.log("promise 'SELECT COUNT(filedata) FROM images' error : " + error.stack);
				console.error(error);
			});
		});
		
/////////////////////////////////////////////////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////////////////////////////////////////////////
//Test
	/*
	 var name = 'ramzi88';
	 var pwd  = 'raNZi88@';
	 
	console.log("register_user_in_db:  username= %s  pwd = %s", name, pwd);
	
	pool.connect(async (err, connection, release) => {
		
		var date = 0;
		
		
		var query_   = "SELECT EXTRACT (EPOCH from now()) AS dateregister";
		var query__  = "SELECT pwdhistory, datehistory FROM credentials where username = $1";
		//var query   = "INSERT INTO credentials (username, password, date, pwdhistory, datehistory) VALUES($1, $2, $3, $4, $5, $6)";
		
		
		//var query = "INSERT INTO credentials (username, password, date, pwdhistory, datehistory)" 			+
		//	" VALUES($1, $2, $3, $4, $5)"										    						+    					
		//	" ON CONFLICT (username) DO"										+ 
			
		//	" UPDATE SET        date    = EXCLUDED.date, "						+
		//				  "	password    = EXCLUDED.password, " 					+			
		//				  "	pwdhistory  = ARRAY_APPEND(EXCLUDED.pwdhistory, $6),"		+
		//				  "	datehistory = EXCLUDED.datehistory";
					  
		//
		var query = "INSERT INTO credentials AS d (username, password, date, pwdhistory, datehistory)" + 	
			" VALUES($1, $2, $3, $4, $5)"   +
			  
			 " ON CONFLICT (username) DO"   +
			
			 " UPDATE SET"                  +          								
						  	" password     = d.password,"                  +
							" date         = $3,"                          +
							" pwdhistory   = d.pwdhistory  || ARRAY[$2],"  +
							" datehistory  = d.datehistory || ARRAY[$3]"   +
						  	
			" WHERE d.username = $1";
		
		
		//var query = "UPDATE credentials set pwdhistory = ARRAY[$1] WHERE username = $2"	;//marche
		   
		//var query = "UPDATE credentials set pwdhistory = ARRAY_APPEND(pwdhistory, $1) WHERE username = $2"	; //marche 
		
		//get 'pwdhistory, datehistory' without 'release'
		let history  = await executeQuery(pool, query__, [name], release);  
		pwdhistory   = history.rows[0].pwdhistory;
	    console.log("promise 'register_user_in_db' : pwdhistory = %s ", pwdhistory);
		
		datehistory = history.rows[0].datehistory;
		console.log("promise 'register_user_in_db' : datehistory = %s ", datehistory);
		
		//get the object 'date__', without 'release'
		let date__  = await executeQuery(pool, query_, [], release);  
		
		//date now
		date     = date__.rows[0].dateregister;
	    console.log("promise 'register_user_in_db' : date register = %s ", date);
		
		var date_ = '{' + date + '}';
		//var date_ = ARRAY[date];
		
		//date_.push('0123456789');
		
		var pwd_  = '{' + pwd + '}';
		//pwd_.push('raLZi88@');
		//ARRAY['123', '456'] ou '{"123", "456"}' array_append(ARRAY[1,2],3)

	   console.log("promise 'register_user_in_db' : name = %s pwd = %s date = %s pwdhistory = %s datehistory = %s", name, pwd, date, pwd_, date_);
	   
	   
	   // with release
		let register  = await executeQuery_(pool, query, [name, pwd, date, pwd_, date_], release);  //username, password, date, pwdhistory, datehistory
	
	    var insert = false;
		var inserts = {"insert": insert};
		
	    if(register.rowCount == 0) {
			 console.log("promise 'register_user_in_db rowCount == 0 : " + inserts["insert"]); //valeur de la cle 'insert' du json 'inserts'.
			 inserts = {"insert": insert};
			 //callback(inserts);
			 return;
	    }
	    insert = true;
	    inserts = {"insert": insert};
	  
	    console.log("promise 'register_user_in_db : rowCount == 1 : " + inserts["insert"]); //valeur de la cle 'insert' du json 'inserts'.
	  
	    //callback(inserts);
		
		
		//without 'release' function.
		async function executeQuery(connection, query, parameters) {
			//console.log('connection = ' + connection);
			//console.log('query = ' + query);
			//console.log('parameters = ' + parameters);
			return new Promise((resolve, reject) => {
				connection.query(query, parameters, (error, response) => {
					if(error){
						console.log('error in "executeQuery" = ' + error.message);
						return reject(error);
					}
					//release();
					//connection.release()	//the next time, there is exception : "the pool had been released"
					//connection.destroy();	//exception = it is not a function
					return resolve(response);
				})
			});
		}
	
		//with 'release' function.
		async function executeQuery_(connection, query, parameters, release) {
			//console.log('connection = ' + connection);
			//console.log('query = ' + query);
			//console.log('parameters = ' + parameters);
			return new Promise((resolve, reject) => {
				connection.query(query, parameters, (error, response) => {
					if(error){
						console.log('error in "executeQuery_" = ' + error.message);
						return reject(error);
					}
					release();
					//connection.release()	//the next time, there is exception : "the pool had been released"
					//connection.destroy();	//exception = it is not a function
					return resolve(response);
				})
			});
		};
	});//end pool
	//end test
	*/

///////////////////////////////////////////////////

/*
//const controllers = require('D:/node-pg-sequelize/controllers');
const routes = require('D:/node-pg-sequelize/routes');
app.use(express.json()); //'server.use is not a function'
app.use('/api', routes);	//in browser type : http://localhost:3000/api "Welcome" will be displayed. It is defined in 'routes/index.js'
app
  .get('/', (req, res) => {
	res.send('Hello World from express listening on '+PORT)
  });
*/

// insert into pgsql table : insert into users (nickname, status, notseenmessages, connectedwith) values
//('mardi', CAST(000 AS bit(3)), 0, '{"xcv":123000}');
//
///////////////////////////////////////////////////////////////////////////////////////////
//select fromnickname from messages where seen=cast(0 AS bit(1));
//////////////////////////////////////////////////////////////////////////////////////////
//var query  = "SELECT * FROM users";
/*
var userNickname ="ter";
var imageProfile = "";
var statuss = 1;
var connectionTime = 0;
var lastConnectionTime = 0
var disconnectionTime = 0;
var notSeenMessages = 100;
var blacklistAuthor = null;

var query = "INSERT INTO users (nickname, imageprofile, status, connected, lastconnected, disconnected, notseenmessages, blacklistauthor)"+
 		" VALUES($1, $2, cast(" + statuss + " AS bit(3)), $3, $4, $5, $6, $7)" +
		" ON CONFLICT (nickname) DO " +
		" UPDATE SET  status = EXCLUDED.status, "						+
					  "	connected = EXCLUDED.connected, " 				+ 
					  " lastconnected = EXCLUDED.lastconnected, " 		+
					  " disconnected = EXCLUDED.disconnected, " 		+
					  " notseenmessages = EXCLUDED.notseenmessages, " 	+
					  " blacklistauthor = EXCLUDED.blacklistauthor"; 
					  
	
		pool.query(query,[userNickname, imageProfile, connectionTime, lastConnectionTime, disconnectionTime, notSeenMessages, blacklistAuthor], async(error, results) =>{
		
			const promise = new Promise((resolve, reject) => {
				 resolve(results); 
			});
			
			//if(error)(reject("promise error "+error)); 
			let res = await promise;
			promise.then((value) => {	// value et result la même chose
			  console.log("promise then 'INSERT into users'  results = " + results.rowCount); //JSON.stringify(results.rowCount));
				*/
				/*
				console.log('value keys = '+Object.keys(value));
				console.log('rowAsArray = '+value.rowAsArray); //value keys = command,rowCount,oid,rows,fields,_parsers,_types,RowCtor,rowAsArray
				console.log('rowCount = '+value.rowCount);
				
				console.log('value keys = '+Object.keys(results));
				console.log('rowAsArray = '+results.rowAsArray); //value keys = command,rowCount,oid,rows,fields,_parsers,_types,RowCtor,rowAsArray
				console.log('rowCount = '+results.rowCount);
				*/
				/*
				console.log('ref = '+value.rows[0].ref +
						' fromnickname = '+value.rows[0].fromnickname +
						' tonickname = '+value.rows[0].tonickname +
						' message = '+value.rows[0].message +
						' time = '+value.rows[0].time);
				*/
				/*
			  var res = (results.rowCount == 1) ? "success" : "failure" ;
			  //callback(res);
			  
			}).catch((error) =>{
				console.log("promise 'INSERT into users' error : " + error.message);
				console.log("promise 'INSERT into users' error : " + error.stack);
				console.error(error);
			});
		});
		*/
//////////////////////////////////////////////////////////////////////////////////////////

//testing db
query = "SELECT name, owner, ref, time  FROM images WHERE id=1";
pool.query(query, (error, results, fields) => {
	if (error) {
		//throw error
		//console.log("error in 'SELECT COUNT(filedata) FROM images' : "+error); 
	}
	//console.log("results of 'SELECT COUNT(filedata) FROM images': "+JSON.stringify(results)); 
	//console.log("results of 'SELECT COUNT(filedata) FROM images': "+JSON.stringify(results.rows));			//[{"name":"tartar","owner":"tartar","ref":"0","time":"0"}]
	//console.log("results of 'SELECT COUNT(filedata) FROM images': "+JSON.stringify((results.rows)[0]));		//{"name":"tartar","owner":"tartar","ref":"0","time":"0"}
	//console.log("results of 'SELECT COUNT(filedata) FROM images': "+(results.rows)[0].name);				// tartar
	//console.log("results of 'SELECT COUNT(filedata) FROM images': "+JSON.stringify(results.fields[0].name));//name of 'images'table field n° 0
	//console.log("results of 'SELECT COUNT(filedata) FROM images': "+JSON.stringify(results.fields[1].name));//name of 'images'table field n° 1
	//console.log("results of 'SELECT COUNT(filedata) FROM images': "+JSON.stringify(results.fields[2].name));//name of 'images'table field n° 2
	//console.log("results of 'SELECT COUNT(filedata) FROM images': "+JSON.stringify(results.fields[3].name));//name of 'images'table field n° 3
})

//testing db
query = "SELECT name, owner, ref, time  FROM images WHERE id <= 1000";
pool.query(query, (error, results, fields) => {
	if (error) {
		//throw error
		//console.log("error in 'SELECT COUNT(filedata) FROM images' : "+error); 
	}
	//console.log("results of 'SELECT ... FROM images <= ...' rowCount : "+results.rowCount); 
	//console.log("results of 'SELECT COUNT(filedata) FROM images': "+JSON.stringify(results.rows));			//[{"name":"tartar","owner":"tartar","ref":"0","time":"0"}]
	//console.log("results of 'SELECT COUNT(filedata) FROM images': "+JSON.stringify((results.rows)[0]));		//{"name":"tartar","owner":"tartar","ref":"0","time":"0"}
	//console.log("results of 'SELECT COUNT(filedata) FROM images': "+(results.rows)[0].name);				// tartar
	
})

//testing db
		var ref			 = '0';
		var fromNickname = 'dimanche';
		var toNickname 	 = 'xcv2';
		var messageContent = 'Hello the world dimanche';
		var time 		 = Date.now();
		var extra        = null;
		var extraName    = null;
		var mimeType	 = null;
		var seen		 = 0;
		var deletedFrom  = 0;
		var deletedTo    = 0;
		
	    var query  = "INSERT into messages (ref, fromnickname, tonickname, message, time, extra, extraname, mime, seen, deletedfrom, deletedto) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)"; //The id is automatically added if it is auto increment
		
		/*
		console.log('query : INSERT into messages' 		 +	"\n" +
					' ref = ' 			+ ref_ 			 + 	"\n" +
					' fromnickname = ' 	+ fromNickname_  +	"\n" +
					' tonickname = ' 	+ toNickname_ 	 +	"\n" +
					' message = ' 		+ messageContent +	"\n" +
					' time = ' 			+ time_ 		 +	"\n" +
					' extra = ' 		+ extra_ 		 +	"\n" +
					' extraname = ' 	+ extraName_ 	 +	"\n" +
					' mime = ' 			+ mimeType 		 +	"\n" +
					' seen = ' 			+ seen 			 +	"\n" +
					' deleted = ' 		+ deleted
					);
			
		*/
		
		/*
		pool.query(query, [ref, fromNickname, toNickname, messageContent, time, extra, extraName, mimeType, seen, deletedFrom, deletedTo], async(error, results) =>{
		//pool.query(query, [ref_, fromNickname_, toNickname_, messageContent, time_, extra_, extraName_, 'pdf'], async(error, results) =>{
			const promise = new Promise((resolve, reject) => {
				 resolve(results); 
			});
			
			//if(error)(reject("promise error "+error)); 
			let res = await promise;
			promise.then((value) => {	// value et result la même chose
			  console.log('promise then INSERT into messages  results = '+JSON.stringify(results.rowCount));
			  
			}).catch((error) =>{
				console.log("promise insert into messages "+error.message); 
			});
		});
		*/
////////////////////////////////////////////////////////////////////////////////////////////
////Get all not seen messages using join 
/*
	select 
		messages.fromnickname,
		count(messages.fromnickname) AS nb,
		users.imageprofile
	from messages 
	LEFT JOIN users 
		ON messages.fromnickname = users.nickname
	where messages.tonickname = 'xcv2' AND messages.seen = cast(0 AS bit(1)) 
	group by messages.fromnickname, users.imageprofile;
*/
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/*
	insert into users (nickname, imageprofile, status, connected, lastconnected, 
					   disconnected, blacklistauthor, notseenmessages, connectedwith) 
	values ('vendredi', null, cast(0 AS bit(3)), 1000, 2000, 3000, null, 10, '{"ase":4000}');
	*/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
var nickname_ = 'xcv2';
console.log('testing, testing :  nickname_ = ' + nickname_);
pool.connect(async (err, connection) => {
		console.log('nickname_ = ' + nickname_);
		var query1 = "SELECT " + 
		' messages.fromnickname as "fromNickname", messages.tonickname as "toNickname",  messages.message, messages.time, messages.extra, ' + 
		' messages.extraname as "extraName", messages.ref, messages.mime as "mimeType", messages.seen, messages.deletedto as "deletedTo", messages.deletedfrom as "deletedFrom" ' +
		' FROM messages ' +
		' WHERE messages.tonickname = $1' + 
		' AND messages.seen = cast(0 as bit(1))';
		
		var query2 = "SELECT" + 
		" count(messages.fromnickname) AS nb, users.nickname, users.imageprofile" + //, users.status " + //, users.connected, users.lastconnected, users.disconnected " + 
		" FROM messages " +
		" LEFT JOIN users " +
		" ON messages.fromnickname = users.nickname " + 
		" WHERE messages.tonickname = $1" + 
		" AND messages.seen = cast(0 AS bit(1))" +
		" GROUP BY messages.fromnickname, users.nickname, users.imageprofile"; //, users.status"; //, users.connected, users.lastconnected, users.disconnected ";

		var query3 = 'SELECT ' + 
		 ' fromnickname, tonickname, MAX(time)' +    // la fonction MAX(time) prend la plus grande valeur de time pour distinguer les valeur de time à garder, car il peut y avoir plusieurs valeurs.
		 ' FROM messages  ' + 
		 ' WHERE messages.tonickname = $1' + 
		 ' AND messages.seen = cast(0 as bit(1)) ' + 
		 ' group by fromnickname, tonickname';
		
		var query4 = "SELECT" + 
		' messages.fromnickname as "fromNickname", users.nickname, users.imageprofile AS "imageProfile", users.status, users.connected AS "connectedAt", users.lastconnected AS "lastConnectedAt",' + 
		' users.disconnected AS "disconnectedAt", users.blacklistauthor AS "blacklistAuthor", users.notseenmessages AS "notSeenMessagesNumber", users.connectedwith AS "connectedWith"' +    
		' FROM messages ' +
		' JOIN users ' +
		' ON messages.fromnickname = users.nickname  ' +
		' WHERE messages.tonickname = $1 ';
		' AND messages.seen = cast(0 AS bit(1))';
		
		console.log('*******query1 = ' + query1);
		console.log('nickname_ = ' + nickname_);
		
		let messages = await executeQuery(pool, query1, [nickname_]); 
		//console.log('messages.rowCount = ' + messages.rowCount + ' extra = ' + messages.rows[0].extra + ' ' + messages.rows[1].extra);
		
		let result = {};
		if (messages.rowCount > 0) {
			let notSeenMessages = await executeQuery(pool, query2, [nickname_]);
			let lastContacts    = await executeQuery(pool, query3, [nickname_]);
			//let users 		= await executeQuery(pool, query4, [nickname_]);
			
			result["messages"] 		  = messages.rows;
			result["notSeenMessages"] = notSeenMessages.rows;
			result["lastContacts"]    = lastContacts.rows;
			
			//result["users"]    	  = users.rows;
			
			//console.log('************************************************ Object.keys(result) = ' + Object.keys(result.messages));
			console.log('******************** result.messages = ' + result.messages + ' result.lastContacts = ' + result.lastContacts);
			
			//send the result to client
		    //io.to(socket.id).emit('get_all_not_seen_messages_res', result);	
			
		} else {
			console.log('nickname_ = ' + nickname_);
			console.log({
				status: false,
				message: "Messages are not not found for : " + nickname_,
			});
			//io.to(socket.id).emit('get_all_not_seen_messages_res', null);
		}
		//io.to(socket.id).emit('get_all_not_seen_messages_res', result);
    });
	

	async function executeQuery(connection, query, parameters) {
		return new Promise((resolve, reject) => {
			connection.query(query, parameters, (error, response) => {
				if(error){
					console.log('error = ' + error.message);
					return reject(error);
				}
				return resolve(response);
            })
        });
    }
	*/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   
   /*
   var nickname = 'xcv2';
   var query1 = "SELECT " + 
    " messages.fromnickname as fromNickname, messages.tonickname as toNickname,  messages.message, messages.time, messages.extra, " + 
	" messages.extraname as extraName, messages.ref, messages.mime as mimeType, messages.seen, messages.deletedto as deletedTo, messages.deletedfrom as deletedFrom " +
	//" users.nickname, users.imageprofile as imageProfile, users.status, users.connected as connectedAt, users.lastconnected as lastConnectedAt, users.disconnected as disconnectedAt" +
    " FROM messages "   +
	" LEFT JOIN users " +
	" ON messages.fromnickname = users.nickname " + 
	" WHERE messages.tonickname = $1" + 
	" AND messages.seen = cast(0 as bit(1))";
	
	var query2 = "SELECT" + 
	" count(messages.fromnickname) AS nb, users.nickname, users.imageprofile, users.status, users.connected, users.lastconnected, users.disconnected " + 
	" FROM messages " +
	" LEFT JOIN users " +
	" ON messages.fromnickname = users.nickname " + 
	" WHERE messages.tonickname = $1" + 
	" AND messages.seen = cast(0 AS bit(1))" +
	" GROUP BY messages.fromnickname, users.nickname, users.imageprofile, users.status, users.connected, users.lastconnected, users.disconnected ";
	
	console.log('query1 = ' + query1);
	 
	 pool.query(query1, [nickname], async(error, results) => { 
		  
		const promise = new Promise((resolve, reject) => {
			if(error)(reject("promise error " + error));
			resolve(results);
		});
		// 
		await promise;
		promise.then((results) => {
		  //console.log('**************promise in get_all_not_seen_messages. results.rows = ' + results.rows + '(results.rowCount == 0) = ' + (results.rowCount == 0));
		  //console.log('**************promise in get_all_not_seen_messages. results = '+results+' count = '+results.rowCount+' length = '+results.rows.length+' fields length = '+results.fields.length);
		  //console.log('**************value keys = '+Object.keys(results));
		  //console.log('**************rowAsArray = '+results.rowAsArray);
		 
		 for(let f of results.fields){
			console.log('field = ' + f.name);  
		 }
		  
		  if(results.length)
			res.end(JSON.stringify({
			"status": 200, 
			"response": 'SUCCESS',
			"data": results.map(({ fromnickname, tonickname }) => ({
            fromNickname: fromnickname,
            toNickname: tonickname
          }))
        }));
		  
		  if(results.rowCount != 0){
			  for (let i = 0; i <= results.rows.length - 1; i++){
				  for(let f of results.fields)
				  console.log(
							' *fromnickname = ' + results.rows[i].fromNickname + "\n" +
							' *imageprofile = ' + results.rows[i].imageprofile  
				  );
			  }  
		  }	
		  
		  //send the result to client
		  //io.to(socket.id).emit('get_all_not_seen_messages_res', results);	
		  
		}).catch((error) =>{
			console.log("************get_all_not_seen_messages_res, promise 'SELECT ref ... from messages' " + error.message);
			//io.to(socket.id).emit('get_all_not_seen_messages_res', []);			
		});
	 });//end pool
	 */

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   
   var nickname = 'xcv2';

   var query3 = "SELECT" + 
	" messages.fromnickname, count(messages.fromnickname) AS nb, users.imageprofile" + 
	" FROM messages " +
	" LEFT JOIN users " +
	" ON messages.fromnickname = users.nickname " + 
	" WHERE messages.tonickname = $1"             + 
	" AND messages.seen = cast(0 AS bit(1))"      +
	" GROUP BY messages.fromnickname, users.imageprofile";
	
	console.log('query3 = ' + query3);
	 
	 pool.query(query3, [nickname], async(error, results) => { 
		  
		const promise = new Promise((resolve, reject) => {
			if(error)(reject("promise error " + error));
			resolve(results);
		});
		// 
		await promise;
		promise.then((results) => {
		  //console.log('**************promise in get_all_not_seen_messages. results.rows = ' + results.rows + '(results.rowCount == 0) = ' + (results.rowCount == 0));
		  //console.log('**************promise in get_all_not_seen_messages. results = '+results+' count = '+results.rowCount+' length = '+results.rows.length+' fields length = '+results.fields.length);
		  //console.log('**************value keys = '+Object.keys(results));
		  //console.log('**************rowAsArray = '+results.rowAsArray);
		  
		  
		  if(results.rowCount != 0){
			  for (let i = 0; i <= results.rows.length - 1; i++){
				  console.log(
							' *fromnickname = ' + results.rows[i].fromnickname + "\n" +
							' *nb = '           + results.rows[i].nb           + "\n" +
							' *imageprofile = ' + results.rows[i].imageprofile  
				  );
			  }  
		  }	
		  
		  //send the result to client
		  //io.to(socket.id).emit('get_all_not_seen_messages_res', results);	
		  
		}).catch((error) =>{
			console.log("************get_all_not_seen_messages_res, promise 'SELECT ref ... from messages' " + error.message);
			//io.to(socket.id).emit('get_all_not_seen_messages_res', []);			
		});
	 });//end pool
     
////////////////////////////////////////////////////////////////////////////////////////////   
   //Get all not seen messages for the user 'nickname'
      //socket.on('get_all_not_seen_messages', function(nickname){	
	 var nickname = 'xcv2';
	 var res = [];
	 res.push(nickname);
	 
	// console.log('get_all_not_seen_messages, nickname : %s ', nickname);
	 //var query  = "SELECT ref, fromnickname, tonickname, message, time, extra, extraname, mime, seen, deletedfrom, deletedto FROM messages"; // WHERE" + 
	 //var query1  = "SELECT fromnickname, count(fromnickname) AS nb FROM messages WHERE tonickname = $1 AND seen = $2 group by fromnickname";
	 
	 const query1  = "SELECT fromnickname, count(fromnickname) AS nb FROM messages WHERE tonickname IN ('azerty', 'mono', 'bis', 'ter') group by fromnickname";
	 
	 //console.log('query1 = ' + query1);
	 
	 //pool.query(query1, [nickname, 0], async(error1, results1) => { 
	 pool.query(query1, [], async(error1, results1) => { 
		  
		const promise1 = new Promise((resolve, reject) => {
			resolve(results1);
		});
		//if(error)(reject("promise error "+error)); 
		let res1 = await promise1;
		promise1.then((value) => {
		  //console.log('promise in get_all_not_seen_messages. value.rows = ' + value.rows + '(value.rowCount == 0) = ' + (value.rowCount == 0));
		  //console.log('promise in get_all_not_seen_messages. value = '+value+' count = '+value.rowCount+' length = '+value.rows.length+' fields length = '+value.fields.length);
		  //console.log('value keys = '+Object.keys(value));
		  //console.log('rowAsArray = '+value.rowAsArray);
		  
		  if(value.rows.length != 0){
			  /*
			  console.log(
							' fromnickname = ' + value.rows[0].fromnickname +
							' nb = '           + value.rows[0].nb 
			  );
			  */
		  }	
		  
		  // le nom des champs de la table
		  //console.log('select get_all_not_seen_messages ref = '+value.fields[0].name +' fromnickname = '+value.fields[1].name+' tonickname = '+value.fields[2].name);
						
		  if (error1) {
			//console.log('*** error  in get_all_not_seen_messages ****' + error1);
		  }
		  
		  //console.log('*************************************************************************************')
		  
		  
		  for(let row of results1.rows){
				console.log('fromnickname = ' + row.fromnickname + ' nb = ' + row.nb);
		  }
			
		  var users = [];
		  for(let x of results1.rows){
			users.push(x.fromnickname);
		  }
		  
		  //for test only
		  //users.push('mono');
		  //users.push('bis');
		  //users.push('ter');
		  
		   for(var i = 0; i <= users.length - 1; i++){
			 console.log('fromnickname = ' + users[i] + '\n');
		   }
		   
		    /*
		   var params = [];
		   for(var i = 1; i <= yy.length; i++) {
			 params.push('$' + i); //like params.push('$1')
		   }
		   
		   //concatenate all parts of the array separated by ','    
		  var param = params.join(',') //convert array params[$0, $1, $2, ...] to string like '$1, $2, $3, ...'
			*/
			
			async function displayContent() {
				try{
					
					var promiseArray = [];
					
					//for (let i = 0; i <= y.length - 1; i++){ 
					  var query2  = "SELECT imageprofile FROM users WHERE nickname = $1" ;    // IN ($1) ne marche pas  // //(" + param + ")"; // = $1";
				  
					  console.log('query2 = ' + query2 + ' users = ' + users); //users[5]);
					  
					  //run over all users to get 'imageprofile'
					  for(let user of users){
						  var promise = await pool.query(query2, [user]);
						  promiseArray.push(promise);
					  }
					
					let results = Promise.all(promiseArray).then((results) => {
						console.log("promiseArray query2 results = " + results);
					}).catch((error)=> {console.log(error);})
					
					console.log("promiseArray query2 results = " + JSON.stringify(results));
					
					var copy = [];
					let pp = await Promise.all([promiseArray]).then((arrList)=>{
					  arrList.forEach(item =>{ 
						  //console.log(item);
						  copy.push(item);
					  });
					  
					  //console.log('in Promise.all  copy.length ' + copy[0][4].rowCount);
					});
					
					//console.log('out Promise.all  copy.length ' + copy.length);
					
					return new Promise((resolve, reject) => {
					  setTimeout(() => {
						resolve(copy);
					  }, 300);
					});
					
				}catch(error){
					console.log("displayContent : " + error.message);	
				}
			};//end displayContent
			
			displayContent(); //defined above
			
			async function app() {
				var row2 = await displayContent().then((result) =>{  //wait the return of 'new Promise' inside 'displayContent'. 
					console.log("############################## result[0].length = " + result[0].length  + " result[0][0].rows[0].imageprofile.length = " + result[0][0].rows[0].imageprofile.length);
					
					//console.log("############################## result = " + result );
					
					//resumé
					var result_ = [];
					console.log(" results1.rows.length = " + results1.rows.length + " results1.rows[0] = " + results1.rows[0].fromnickname); //Object.keys(results1.rows[0]));
					
					//console.log(" users.length = " + users.length);
					
					for(let i = 0; i <= results1.rows.length - 1; i++){//'result1' est associé à 'query1' = 'select fromnickname, count(fromnickname)'
					
						var temp ={};
					
						temp["fromnickname"] = results1.rows[i].fromnickname;
						temp["nb"]           = results1.rows[i].nb;
						//'result' attend le retour de tous les 'results' associé à 'query2'= 'SELECT imageprofile'
						//const test = (result[0][i].rows[0] == null);
						
						//console.log('test = ' + test);
						
						//if(test)console.log('(result[0][i].rows[0] == null) = ' + JSON.stringify(result[0][i].rows[0]) + ' temp["fromnickname"] = ' + temp["fromnickname"]);
						//if(i == 0)console.log('(result[0][i].rows[0] == null) = ' + JSON.stringify(result[0][i].rows[0]));
						
						//console.log('(result[0][i].rows[0] == null) = ' + (result[0][i].rows[0] == null));
						
						//console.log('KKKKKKKKKKKKKKKKKKKKKKKKKKK result[0][i]rows[0].imageprofile.length = %s', (result[0][i].rows[0] == null) ? 0 : result[0][i].rows[0].imageprofile.length);
						
						//const leng = 0;
						//if(!test)result[0][i].rows[0].imageprofile.length;
						
						temp["imageprofile"] = (result[0][i].rows[0] == null) ? null : result[0][i].rows[0].imageprofile;
						//console.log('KKKKKKKKKKKKKKKKKKKKKKKKKKK');
						result_.push(temp);
					}
					
					console.log("résumé : result_.length = " + result_.length); 
					for(let row of result_){
						
						//console.log('fromnickname = ' + row.fromnickname + ' nb = ' + row.nb + ' imageprofile.length = ' + row.imageprofile.length);
					}
					console.log(' fin résumé');
					
					//send back the result to android client
				
				}).catch(); 
				
			}//end app()
			
			//call to app() above
			app();
			
		  ///////////////////////////////////////////////////////////////////////
		  
		  
		  /*
		  var json = [];
		  for(var i = 0; i < value.rows.length; i++){
			  //console.log('i = '+i);
			  var json_ = {};
			  json_ = { 'ref' 			: value.rows[i].ref, 
						'fromNickname'	: value.rows[i].fromnickname, 
						'toNickname'	: value.rows[i].tonickname,
						'message'		: value.rows[i].message,
						'time'			: value.rows[i].time,
						'extra'			: (value.rows[i].extra == null) ? null : value.rows[i].extra.toString(),
						'extraName'		: (value.rows[i].extraname == null) ? null : value.rows[i].extraname,
						'mimeType'		: (value.rows[i].mime == null) ? null : value.rows[i].mime,
						'seen'		    : value.rows[i].seen,
						'deletedFrom'	: value.rows[i].deletedfrom, 
						'deletedTo'		: value.rows[i].deletedto
					  };
					  
			  //console.log('ref = %s, message = %s, time = %d', value.rows[i].ref, value.rows[i].message, value.rows[i].time);
			json.push(json_);
		  }// end for loop
		  */
		  //send result to android client
		  //io.to(socket.id).emit('get_all_not_seen_messages_res', value.rows);
		}).catch((error1) =>{
			//console.log("get_all_not_seen_messages_res, promise 'SELECT ref ... from messages' " + error1.message);
			//io.to(socket.id).emit('get_all_not_seen_messages_res', []);			
		});
	});//end pool
    
////////////////////////////////////////////////////////////////////////////////////////////
// Dans le navigateur les commandes sont les suivantes: localhost:3000/users, localhost:3000/users/:id=1; ...
app.get('/users',        pgsqldb.getUsers)
app.get('/users/:id',    pgsqldb.getUserById)
app.post('/users',       pgsqldb.createUser)
app.put('/users/:id',    pgsqldb.updateUser)
app.delete('/users/:id', pgsqldb.deleteUser)

////////////////////////////////////////////////////////

const path = require('path');
app
  .get('/', (req, res) => {
	  const options = {
        root: path.join(__dirname)
    };
	const response = 'Hello World from express listening on ' + PORT;
	const fileName = 'index.html';
	res.send(response);
	//res.sendFile(__dirname, 'index.html');
	
    res.sendFile(fileName, options, function (err) {
        if (err) {
            console.error('Error sending file:', err);
        } else {
            console.log('Sent:', fileName);
        }
    });
  })
  
  .get('/db', async (req, res) => {
    const response = 'Hello World from express listening on ' + PORT;
	
	
	try {
      const client  = await pool.connect();
      const result  = await client.query('SELECT * FROM eleves WHERE id = 1');
	  
      const results = { 'results': (result) ? result.rows : null};
	  var obj       = JSON.stringify(results);	//--->{"results":[{"id":1,"name":"hello database"}]}
	  //var obj_ = JSON.parse(obj);
																				// Simple quote is same as double quote
	  console.log(" results obj = " + JSON.stringify(results));					//[object Object] --> results obj = {"results":[{"id":1,"nom":"tata\n","prenom":"tartar\n","adresse":"10, rue verte","ville":"bordeaux","codepostal":"33000\n","tel":"0456789012","idclasses":1}]}
	  //console.log("obj['results'] = "+results["results"]);					//[object Object] --> [{"id":1,"name":"hello database"}]
	  //console.log("obj['results'][0] = "+results["results"][0]);				//[object Object] --> {"id":1,"name":"hello database"}
	  //console.log("obj['results'][0]['id'] = "+results["results"][0]["id"]);	// 1
	  
	  //ou
	  
	  //console.log("results.results[0].id = "+results.results[0].id);			// même chose que ci-dessus.
				  
	  //res.send(response + obj);
	  res.send("results : " + JSON.stringify(results));
	  
	  //res.send("results obj = "+obj);	
	  //res.send("obj.['results'] = "+obj['results']);	
	  //res.send("obj.results id = "+obj.results);
	  
	  
      client.release();
    } catch (err) {
      //console.error(err);
      res.send("Error : " + err);
    }
	
  })
  .get('/usersmap', async (req, res) => {
    const users = listeners.mapWatch();
	console.log(" 'usersmap' users = " + users);
	res.send("users : " + JSON.stringify(users));
	
	/*
	try {
      const client  = await pool.connect();
      const result  = await client.query('SELECT * FROM eleves WHERE id = 1');
	  
      const results = { 'results': (result) ? result.rows : null};
	  var obj       = JSON.stringify(results);	//--->{"results":[{"id":1,"name":"hello database"}]}
	  //var obj_ = JSON.parse(obj);
																				// Simple quote is same as double quote
	  console.log(" results obj = " + JSON.stringify(results));					//[object Object] --> results obj = {"results":[{"id":1,"nom":"tata\n","prenom":"tartar\n","adresse":"10, rue verte","ville":"bordeaux","codepostal":"33000\n","tel":"0456789012","idclasses":1}]}
	  //console.log("obj['results'] = "+results["results"]);					//[object Object] --> [{"id":1,"name":"hello database"}]
	  //console.log("obj['results'][0] = "+results["results"][0]);				//[object Object] --> {"id":1,"name":"hello database"}
	  //console.log("obj['results'][0]['id'] = "+results["results"][0]["id"]);	// 1
	  
	  //ou
	  
	  //console.log("results.results[0].id = "+results.results[0].id);			// même chose que ci-dessus.
				  
	  //res.send(response + obj);
	  res.send("users : " + JSON.stringify(users));
	  
	  //res.send("results obj = "+obj);	
	  //res.send("obj.['results'] = "+obj['results']);	
	  //res.send("obj.results id = "+obj.results);
	  
      client.release();
	  
    } catch (err) {
      //console.error(err);
      res.send("Error : " + err);
    }
	*/
  });
  
  //const routes = require('../routes');
  
  //const routes    = require('./routes');
  
  console.log("");
  console.log("*******************************************************************************************************");
  //console.log("routes : routes = " + JSON.stringify(routes));
  console.log("*******************************************************************************************************");
  console.log("");
  
  //const server = express();
  //app.use(cors());
  //app.use((req, resp, next) =>{
  //	req.Op = Op;
  // 	  res.io = io;
  //	  next();
  //});
  //app.use(bodyParser.json());
  //app.use(validator());
  app.use(express.json());
  app.use(route)
  app.use(express.static("./public"));
  //app.use('/api', routes);	//in browser type : http://localhost:3000/api
  
  //server.listen(process.env.PORT || 5000, () => console.log(`Listening on ${ PORT }`))
  
  //app.get('/', (req, res) => {
//  res.send('Hello World from express!')
//})

var myMap 		= new Map();	//contains connected users and id
//var peopleMap = new Map();	//contains current users and selected users
var n = 0;						// number of connected users 
var i = 0;						//loop index in chunks
var people0		= {};			//json to store the connected pair : current user and selected user like people0[current]=selected. It is an object with keys accessed like : Object.keys(people0)
var people 		= {};			//json to store id and nickname like people[id]=nickname where id=socket.id
var profile 	= {};			//profile image
//var peopleId  = {};			//json to store id and nickname like people[nickname]=id.

function crypt() {
	var current_date = (new Date()).valueOf().toString();
	var random = Math.random().toString();
	return crypto.createHash('sha1').update(current_date + random).digest('hex');
}
//console.log("crypt = %s", crypt());

//var id = crypto.randomBytes(20).toString('hex');
//

//'require' est placé ici pour acceder à 'socket' dans 'module.export' ce n"est pas vrai
const listeners = require('./event_listeners'); //'index.js' expected in folder './queries_'. Il y a un autre file 'queries.js' à la racine.
//import * as data from './queries_';
const state     = require("./common-modules");

//handle io and sockets
const jwt = require('jsonwebtoken');
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("No token"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.user = decoded; // trust established
    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
});


//detect the user first connection
io.on('connection', (socket) => {
	
	console.log("************************ io connection  ********************************* socket.id = " + socket.id);
	console.log("A client has connected, socket.connected = " + socket.connected + " socket.disconnected = " + socket.disconnected);
	console.log("");
	console.log("");
	
	socket.on('test_socket', (msg, callback) =>{
		console.log("*********************received test_socket *************************************************************");
		console.log("msg = ", msg);
		callback("socket success");
		//listeners.testSocket1(pool, socket, msg, callback);
	});
});// end io.on('connection', (socket) => {
