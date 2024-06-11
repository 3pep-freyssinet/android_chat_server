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
const { Server }       = require("socket.io");
const cors             = require("cors");
const Sequelize        = require("sequelize");
const bodyParser       = require("body-parser");
const validator        = require("express-validator");

const app        = express();
const httpServer = createServer(app);
const io         = new Server(httpServer, { /* options */ });
const Op         = Sequelize.Op;

const PORT       = process.env.PORT || 5000
httpServer.listen(PORT);

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

/*
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
*/

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
app.get('/users', pgsqldb.getUsers)
app.get('/users/:id', pgsqldb.getUserById)
app.post('/users', pgsqldb.createUser)
app.put('/users/:id', pgsqldb.updateUser)
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
	
  });
  
  //const routes = require('../routes');
  
  const routes    = require('./routes');
  
  console.log("");
  console.log("*******************************************************************************************************");
  console.log("routes : routes = " + JSON.stringify(routes));
  console.log("*******************************************************************************************************");
  console.log("");
  
  //const server = express();
  app.use(cors());
  app.use((req, resp, next) =>{
	  req.Op = Op;
	  res.io = io;
	  next();
  });
  app.use(bodyParser.json());
  app.use(validator());
  app.use(express.json());
  
  app.use(express.static("./public"));
  app.use('/api', routes);	//in browser type : http://localhost:3000/api

  module.exports = app;
  
  
  
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
//console.log("id = %s", id);

//detect the user first connection
io.on('connection', (socket) => {
	console.log("************************ io connection  ********************************* socket.id = " + socket.id);
	console.log("A client has connected, socket.connected = " + socket.connected + " socket.disconnected = " + socket.disconnected);
	console.log("");
	console.log("");
	
	socket.on('test_socket', testSocket);
	function testSocket(msg){
		console.log("** test_socket ** : " + msg);
	}
	
	
	//test socket
	socket.on('test_socket_', (msg) => {
		console.log("************************" );
		console.log("*");
		console.log("** test_socket " + msg);
		console.log("*");
		console.log("************************" );
	});
	
	//test
	socket.on('chat message', async (msg, clientOffset, callback) => {
		console.log("chat message, msg = " + msg);
	});
	
	//test
	socket.on('chat_message', (msg) => {
		console.log("chat message, msg = " + msg);
	});
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	/*
	//The user no interaction is done in android
	// timeout() is a function in event 'connection'. It is available in all sub events like 'join', 'connect', 'more_time', ...
	var logoffTimer;
	var returnResponseTimer
	function timeout(){
		console.log("doing timeout");
		// clear the timer on activity
		// should also update activity timestamp in session
		clearTimeout(logoffTimer);
		clearTimeout(returnResponseTimer);
		// set a timer that will log off the user after 60 s
		logoffTimer = setTimeout(function(){//this function in executed after the delay
			console.log("emiting 'no activity' notification to client");
			// add log off logic here
			// you can also check session activity here
			// and perhaps emit a 'inactif' event to the client as mentioned
			socket.emit("no_activity", { reason: "inactivity after connection", socketId : socket.id });
			    // wait a response from client. set a timount
				returnResponseTimer = setTimeout(function(){
				// If the client does not respond after the delay, send him a disconnection notification
				console.log("no response from id " + socket.id);
				socket.emit("logoff", { reason: "logging off : no response from user", socketId : socket.id });
			}, 60 * 1000);
			
		}, 60 * 1000); // 60 ms * 1000 = 60 s.
	};
	
   //timeout();
   */
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	/*
	//session more time event
	socket.on('more_time', (moreTime)=>{
        console.log("session_more_time = " + moreTime);
		if(moreTime){
			//renew session
			timeout();
		}else{
			//logoff
			//socket.emit("logoff", { reason: "user gone", socketId : socket.id });
			//disconnection();
		}
    });
	*/
	//////////////////////////////////////////////////////////////////////////////////////////////////////
	
	//connection event -----> do nothing
	socket.on('connect', ()=>{
        console.log("A client has connected, id = " + socket.id + "##############################################################################");
		
    });
	
	
	//'disconnect' event	----> works
	socket.on('disconnect', ()=>{
		console.log("disconnect : socket.id = " + socket.id + " " + people[socket.id] + " has disconnected  ******************************************************");
		
		//get list of keys values of 'people'
		console.log("get people keys-values pair");
		for(var key_ in people) {
			console.log("disconnect : people keys : Key: " + key_ + " Value: " + people[key_]);
		}
		console.log("end get people key-value pairs");
		console.log("");
		console.log("");
		
		//pool.end().then(() => console.log('pool has ended'))
		
		//Notify all the connected users
		socket.broadcast.emit('userdisconnect', people[socket.id]);		//to all
		
		//update user status in db
		var query  = "UPDATE users SET " 						+ 
		" status = cast(0  AS bit(3))," 						+
		" disconnected = '" + Date.now() + "'"					+
		" WHERE nickname = '" + people[socket.id] + "'";
		
		pool.query(query,[], async(error, results) =>{
		
			const promise = new Promise((resolve, reject) => {
				 resolve(results); 
			});
			
			//if(error)(reject("promise error "+error)); 
			let res = await promise;
			promise.then((value) => {	// value et result la même chose
			  //console.log("promise then 'UPDATE users'  results = " + results.rowCount); //JSON.stringify(results.rowCount));
				
			  var res = (results.rowCount == 1) ? "success" : "failure" ;
			  
			}).catch((error) =>{
				//console.log("promise 'IUPDATE users' error : " + error.message);
				//console.log("promise 'IUPDATE users' error : " + error.stack);
				//console.error(error);
			});
		});
		
		//remove the disconnected user from the map
		myMap.delete		(socket.id);
		
		//update counter of connected users
		n--;	
		
		console.log(" keys of people0 = " +  Object.keys(people0) );
		
		var user = people[socket.id];
		
		//test if user is in people0 before delete
		console.log("test before delete");
		console.log(user + " in people0 " + (user in people0));
		console.log( people[socket.id] + " has disconnected, his associated is = " + people0[people[socket.id]]);
		
		//remove the disconnected user from arrays 'people' and 'profile'.
		delete 		people[socket.id];
		//delete 		profile[people[socket.id]]; // is not working since 'people[socket.id' is just deleted above.
		delete 		profile[user];
		//delete      people0[people[socket.id]];	//remove the association currentUser --> selectedUser
		delete 		people0[user];//the statement just above is not working because the 'people[socket.id]' which is using has been deleted in the statement 'delete 	people[socket.id];'
		
		//test if user is in people0 after delete
		console.log("test after delete");
		console.log(user + " in people0 after delete " + (user in people0));
		
		// test after delete
		console.log( people[socket.id] + " has disconnected, his associated is = " + people0[people[socket.id]]);
		
		console.log(" remaing keys of people0 = " +  Object.keys(people0) );
		
		//get map content
		console.log("Map -------------------------------------------------size = " + myMap.size);
		const keys = myMap.keys(); //iterator
		let key = keys.next();
		var nickname;
		while (!	key.done) {
			 console.log("map  value = " + myMap.get(key.value) + " key =  " + key.value); // key : value
			 key = keys.next();		 //next key
		}
		console.log("End Map-----------------------------------------------");
		console.log("array from map : "+Array.from(myMap));
		console.log("Remaining people : " + JSON.stringify(people));
		
		console.log("");
		console.log("");
		console.log("people-----------------------------------------------");
		
		//get people content
		for(var key_ in people) {
			console.log("disconnect : people keys : Key: " + key_ + " Value: " + people[key_]);
		}
		console.log("end people-----------------------------------------------");
		console.log("");
		console.log("");
		
		//if(myMap.size == 0)socket.disconnect(0); //;
		//socket.destroy(); //error socket.destroy is not a function
		//socket.close(); //error socket.close is not a function
    });
	
	//test ack
	socket.on('update_item', (payload, callback) => {
		console.log("update_item paylod = %s", payload);
		callback("success");
	});
	
	
	//nb userss connected
	n++;
	
	//socket.on('join', (chatUserInfos, callback) => {
	socket.on('join', (chatUserInfos) => {
		//timeout();
		console.log("'join' chat_user_infos chatUserInfos socketid = "+socket.id + " chatUserInfos = " + chatUserInfos.length);
		
		//Conversion string -> JSON
		const obj 					= JSON.parse(chatUserInfos);
		//const obj 				= JSON.stringify(chatUserInfos);
		console.log('chat_user_infos : ' + obj);
		
		//console.log('chat_user_infos ' + JSON.stringify(chatUserInfos));
		//console.log("'join' blacklistAuthor " + chatUserInfos["BlacklistAuthor"] + " " + chatUserInfos.BlacklistAuthor);
		//console.log("'chatUserInfos' keys = "+Object.keys(chatUserInfos));
		
		var userNickname 		= obj.Nickname;
		var imageProfile 		= obj.Profile == null ? null : obj.Profile; 
		//console.log('imageProfile = ' + imageProfile + ' (imageProfile == null) = ' + (imageProfile == null) + ' length = ' + imageProfile.length);
		
		//si c'est 'undefined', l'image profil n'a pas été envoyée. il y a donc 'update' de toutes les valeurs sauf l'image qui existe déja.
		// si c'est different de 'undefined', l'image a été envoyée, donc 'insert'
		//ici, on la met à "" dans le cas 'undefined' pour la cohérence de insert plus bas.
		var imageProfileUri 	= obj.ProfileUri == null ? null : obj.ProfileUri; 
		var status 				= obj.Status;
		var connectionTime		= obj.ConnectionTime;
		var lastConnectionTime	= obj.LastConnectionTime;
		var disconnectionTime	= obj.DisconnectionTime;
		var notSeenMessages		= obj.NotSeenMessages;   
		var blacklistAuthor		= obj.BlacklistAuthor;	
		var connectedWith		= '{}'; //only, first time in join. after that in reconnection, it is not used in update. It is updated in 'messagedetection'
		
		//peopleId[userNickname]  =  socket.id;  //people[nickname]=id
		
		
		const imageProfileLength   = (imageProfile    == null) ? 'null' : imageProfile.length;
		const imageProfileUriValue = (imageProfileUri == null) ? 'null' : imageProfileUri;
		
		
		console.log('join user_infos'                               +   "\n"	+
     		'userNickname : '           + userNickname              +   "\n"	+
			'imageProfile : ' 		    + imageProfileLength 	    + 	"\n"	+
			'imageProfileUri : ' 	    + imageProfileUriValue   	+ 	"\n"	+
			'status : ' 				+ status 					+ 	"\n"	+   
			'connectionTime : ' 		+ connectionTime			+ 	"\n"	+
			'lastCnnectionTime : ' 		+ lastConnectionTime		+ 	"\n"	+	
			'disonnectionTime : ' 		+ disconnectionTime			+ 	"\n"	+	
			'notSeenMessages : ' 		+ notSeenMessages			+ 	"\n"	+	
			'blacklistAuthor : ' 	    + blacklistAuthor			+ 	"\n"	+
			'connectedWith : ' 	    	+ connectedWith			     + 	"\n"		
		);
		
		////////////////////////////////////////////////////////////////////////////////////////////////////
		
		//store the current user and his associated selected user. In this step, it is null. It will be updated in 'current_selected_user'.
		people0[userNickname] = null;
		
		socket.username = userNickname;
        console.log(socket.username + " : has joined the chat, id = " + socket.id +" , image profile length = " + (imageProfile == null) ? 'null' : imageProfile.length + " , time = " + connectionTime + ", last = " + lastConnectionTime);
		
		//Store the nickname and id in people json
		//people[userNickname] =  socket.id;
		
		//update or put a new key in people for the joining user.
		//remind : people{} : json to store id and nickname like people[id]=nickname where id=socket.id
		var found = false;
		if(Object.keys(people).length != 0){
			for(var key in people) {
			//console.log("join : people keys : Key: " + key + " Value: " + people[key]);
			if(people[key] == userNickname){
				//the user exist already. It is reconnecting. Remove the previous key and put a new one.
				if(delete people[key]){
					// the key is deleted, put a new one
					people[socket.id]   =  userNickname; // a new id is assigned
					found = true;
					break;
				}else{
					return console.error('join : Error deleting key', err.stack) 
				}						
			}else{
				//first join. There are persons in 'people' before him.
				people[socket.id]   =  userNickname;
			}
		}
		}else{
			//first join. It is the first person in 'people'
				people[socket.id]   =  userNickname;
		}
		
		
		//done above in 'else'
		//if (found == false)people[socket.id]   =  userNickname; // new user is connecting
		
		console.log(" ** people **");
		console.log("")
		for(var key in people) {
			console.log("join : people keys : Key: " + key + " Value: " + people[key]);
		}
		console.log("");
		console.log("")

		//Store the image profile of the nickname
		profile[userNickname] =  imageProfile;
		
		//Add to object 'profile' a new object ' imageProfile' 
		const returnedTarget = Object.assign(profile, imageProfile); //assign(target, source); return target. 
		//So in the precedent statement 'returnedTarget' is the same 'profile'. We can verify this : there are the same keys.
		//console.log("key = "+Object.keys(profile));
		//console.log("key = "+Object.keys(returnedTarget));
		
		//store the user in map if it not exists : Remind : myMap : contains connected users and id
		console.log(" join : Map to delete key-------------------------------------------------size = " + myMap.size);
		if(myMap.size != 0){
			const keys = myMap.keys(); //iterator
			let key_   = keys.next();
			var nickname;
			var found = false;
			//console.log("avant Begin Map toNickname_ = " + toNickname_);
			while (!key_.done) {
				 //console.log("map    key =  " + key_.value + " value = " + myMap.get(key_.value)); // key : value
				 //console.log("******** test if = " +(myMap.get(key.value) == toNickname_));
				 if(myMap.get(key_.value) == userNickname){ //The user exits, delete it from the map
					myMap.delete(key_.value);
					found = true;
					break;
				 }else{
					//first connection, there are other persons in the map
					myMap.set(socket.id, userNickname);
				 }
				 key_ = keys.next();		 //next key
			}
		}else{
			//the first time, the map is empty
			myMap.set(socket.id, userNickname);
		}
		
		//console.log("join : End Map delete key-----------------------------------------------");
		//done above in 'else'
		//if(! found) myMap.set(socket.id, userNickname);
		
		//verification
		//get all keys-values pairs or 'myMap'
		console.log(" *** myMap ***");
		console.log("")
		const keys = myMap.keys(); //iterator
		let key_   = keys.next();
		while (!key_.done) {
			 console.log("map    key =  " + key_.value + " value = " + myMap.get(key_.value)); // key : value
			 key_ = keys.next();		 //next key
		}
		console.log("");
		console.log("")
		
		//Send a message to all users except the sender.
		//if we want to send the message to all users including the sender we just have to use io.emit() instead of socket.emit().
        //socket.broadcast.emit('userjoinedthechat', userNickname, socket.id, imageProfile); //ca marche
		//socket.emit('userjoinedthechat', userNickname, socket.id, imageProfile); //to sender
		
		console.log("****************** userjoinedthechat = " + userNickname +" socket.id = " + socket.id);
		
		io.emit('userjoinedthechat', userNickname, socket.id, imageProfile, status, connectionTime, lastConnectionTime, disconnectionTime, notSeenMessages, blacklistAuthor);//to all
		
		
		//console.log("people = "+JSON.stringify(people));
		//console.log("profile = "+JSON.stringify(profile));
		
		//current directory
		/*
		console.log('Current directory: ' + process.cwd()+ " or "+__dirname);
		fs.readFile(__dirname + "/images/20180508_153845.jpg", function(err, data){
			if (err) {
				console.error(err)
				return
			}
			var img64 = new Buffer.from(data, 'base64');
			socket.emit("send_img", img64);
			console.log("send image to client with length : "+img64.length + " octets");
		})
		*/
		
		//save the infos of joined user in db
		//ALTER TABLE users
		//ALTER lastconnected SET DEFAULT 0
		
		//Set constraint
		//ALTER TABLE users
		//ADD CONSTRAINT constraint_name UNIQUE (nickname); 
		
		//Save the user in db. The table column 'nickname' must have a 'UNIQUE' constraint. See the above statement how to make a 'UNIQUE' constraint. 
		
		/*
		//example : insert into users (nickname, status, notseenmessages, connectedwith ) 
        //values ('ramzi89',cast(0 AS bit(3)), 0, '{}');
		
		var query  = "INSERT INTO users (nickname, imageprofile, status, connected, lastconnected)" +
		"VALUES($1, $2, cast("+status+" AS bit(2)), $3, $4)" 	+ 
		"ON CONFLICT (nickname)" 								+ 
		" DO " 													+ 
		"UPDATE SET " 											+ 
		" status = cast("+status+" AS bit(2))," 				+
		" connected = $3,"										+
		" lastconnected = $4,"									
		*/
		
		/*
		//sortie = null ?
		console.log('query : INSERT into users' +	"\n" +
					' nickname = ' 				+ userNickname 			+ 	"\n" +
					' imageProfile = ' 		    + (imageProfile == null) ? 'null' : imageProfile.length	+	"\n" +
					' status = ' 				+ status 				+	"\n" +
					' connectedAt = ' 			+ connectionTime 		+	"\n" + 
					' lastConnectedAt = '		+ lastConnectionTime 	+	"\n" + 
					' disconnectedAt = '		+ disconnectionTime 	+	"\n" +
					' notSeenMessages = '		+ notSeenMessages 		+	"\n" +
					' blacklistAuthor = '		+ blacklistAuthor 		+	"\n" +
					' connectedWith = '		    + connectedWith 		
		);
		*/
		
		
		var query = "INSERT INTO users (nickname, imageprofile, status, connected, lastconnected, disconnected, notseenmessages, blacklistauthor, connectedwith)"+
 		" VALUES($1, $2, cast(" + status + " AS bit(3)), $3, $4, $5, $6, $7, $8)" 	+
		" ON CONFLICT (nickname) DO " 												+
		" UPDATE SET  status = EXCLUDED.status, "									+
					  "	imageprofile    = EXCLUDED.imageprofile, " 					+ 
					  "	connected       = EXCLUDED.connected, " 					+ 
					  " lastconnected   = EXCLUDED.lastconnected, " 				+
					  " disconnected    = EXCLUDED.disconnected, " 					+
					  " notseenmessages = EXCLUDED.notseenmessages, " 				+
					  " blacklistauthor = EXCLUDED.blacklistauthor";  				//+
					  //" connectedwith   = EXCLUDED.connectedwith"; 			//this column is updated in 'messagedetection'
					  
					  
		//Put only necessary values, otherwise an error is raised.
		pool.query(query,[userNickname, imageProfile, connectionTime, lastConnectionTime, disconnectionTime, notSeenMessages, blacklistAuthor, connectedWith], async(error, results) =>{
		
			const promise = new Promise((resolve, reject) => {
				 resolve(results); 
			});
			
			//if(error)(reject("promise error "+error)); 
			let res = await promise;
			promise.then((value) => {	// value et result la même chose
			  //console.log("promise then 'INSERT into users'  results = " + results.rowCount); //JSON.stringify(results.rowCount));
				
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
				var res1;
			  if(results)res1 = (results.rowCount == 1) ? "success" : "failure" ;
			  //callback(res1);
			  
			}).catch((error) =>{
				console.log("promise 'INSERT into users' error : " + error.message);
				console.log("promise 'INSERT into users' error : " + error.stack);
				//console.error(error);
			});
		});
    });
	
	//save the uri of image profil
	//Store the image profile uri only if it is not null.
	// if it is the same uri ie the same image do update the field 'date'
	socket.on("save_image_profile_uri", (profile, callback) =>{
			
		var nickname =  profile.nickname;
		var uri      =  profile.uri;
		var time     =  profile.time;
		
		console.log("save_image_profile_uri : nickname = %s uri = %s time = %s",  nickname, uri, time);
	
		// ne marche pas. le result du promise is null
		var query0 = "INSERT INTO imageprofileuri (nickname, uri, date)" 	+
		" VALUES($1, $2, $3)"										    	+    					
		" ON CONFLICT (uri) DO"												+ 
		
		" UPDATE SET  date = EXCLUDED.date, ";								
					  //"	nickname = EXCLUDED.nickname"; 					 
		
		//in 2 steps :
		//if the image profile uri is not found : do insert
		//else do update the date field only
		
		var query1 = "SELECT nickname, uri, date FROM imageprofileuri WHERE nickname = $1 AND uri = $2";
		var query2 = "INSERT INTO imageprofileuri (nickname, uri, date) VALUES ($1, $2, $3)";
		var query3 = "UPDATE imageprofileuri SET date = $3 WHERE nickname = $1 AND uri = $2";
		
		var status = "fail";
		pool.connect(async (err, connection, release) => {
			console.log("**** Select ******" + "\n");
			let imageProfileSelect  = await executeQuery(pool, query1, [nickname, uri]);
			//console.log("promise 'save_image_profile_uri : select : '  results = " + JSON.stringify(imageProfileSelect) + " imageProfileSelect.rowCount = " + imageProfileSelect.rowCount +
			//  "\n" + "-------------------------------------------------------------------------------" + "\n");
			
			if((imageProfileSelect.rowCount != 0) && (imageProfileSelect.rowCount != 1))return callback(Error("unexpected value in 'save_image_profile_uri : select'"));
			
			if(imageProfileSelect.rowCount == 1){
				//do Update
				console.log("**** Update ******" + "\n");
				let imageProfileUpdated  = await executeQuery(connection, query3, [nickname, uri, time]);
				//console.log("promise 'save_image_profile_uri : update : '  results = " + JSON.stringify(imageProfileUpdated) + " imageProfileUpdated.rowCount = " + imageProfileUpdated.rowCount +
				//"\n" + "-------------------------------------------------------------------------------" + "\n");
				
				if(imageProfileUpdated.rowCount != 1)return callback(Error("unexpected value in 'save_image_profile_uri : update'"));
				
				if(imageProfileUpdated.rowCount == 1)status = "success";
			}
			else{
				//do insert
				console.log("**** insert ******" + "\n");
				//console.log("query2 = "+ query2 + "\n");
				//console.log("query2 : values : nickname = " + nickname + "\n");
				//console.log("query2 : values : uri      = " + uri + "\n");
				//console.log("query2 : values : time     = " + time + "\n");
				
				let imageProfileInserted  = await executeQuery(connection, query2, [nickname, uri, time]);
				//console.log("promise 'save_image_profile_uri : insert : '  results = " + JSON.stringify(imageProfileInserted) + " imageProfileInserted.rowCoun = " + imageProfileInserted.rowCount +
				//"\n" + "-------------------------------------------------------------------------------" + "\n");
				
				if(imageProfileInserted.rowCount != 1)return callback(Error("unexpected value in 'save_image_profile_uri : insert'"));
				
				if(imageProfileInserted.rowCount == 1)status = "success";
			}
				
			console.log("save_image_profile_uri : status = " + status);
			callback(status);
			return;
		});
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
						  
	});
	
	
	//get all users in db
	socket.on('get_all_users', () => { 
		console.log("get_all_users ");
		
		var query = "SELECT nickname," 									+
					"encode(imageprofile, 'escape') as imageprofile,"	+
					"status," 											+
					"connected," 										+
					"lastconnected,"									+ 
					"disconnected," 									+
					"blacklistauthor," 									+
					"notseenmessages," 									+
					"connectedwith " 									+
		"FROM users " 													+
		"ORDER BY nickname ASC ";										
		//"ORDER BY nickname ASC LIMIT $1";
		//"ORDER BY nickname DESC ";
		
		console.log("get_all_users query = " + query);
		
		pool.query(query,[], async(error, results) =>{
		
			const promise = new Promise((resolve, reject) => {
				 resolve(results); 
			});
			
			//if(error)(reject("promise error "+error)); 
			let res = await promise;
			promise.then((value) => {	// value et result la même chose
			  //console.log("promise 'get_all_users'  results = " + results);
			  //console.log("promise 'get_all_users'  results.rowCount = " + results.rowCount); //JSON.stringify(results.rowCount));
			  
			  //console.log("'get_all_users' : results.rowCount = " + results.rowCount + " JSON.stringify(results.rows) = " + JSON.stringify(results.rows));
			  //console.log("promise 'get_all_users'  value.rows[0] = " + value.rows[0]);
			  
			  
			  //console.log('value keys = '+Object.keys(value));
			  //console.log('results keys = '+Object.keys(results));
				
			  //console.log('value.rows[0] keys = '+Object.keys(value.rows[0]));
			  //console.log('value.rows[0].count = '+value.rows[0].count);
			  
			  //var exist = false;
			  //if (value.rows[0].count == 1)exist = true;
			  //var exists = {"exists": exist};
			  
			  //callback(results.rowCount);
			  socket.emit("get_all_users_bak", results.rows);
			  
			  //io.to(socket.id).emit('get_image_profile_uri_back', results.rows); 
			  
			}).catch((error) =>{
				console.log("promise 'get_all_users' error : " + error.message);
				console.log("promise 'get_all_users' error : " + error.stack);
				//console.error(error);
			});
		});
	});
	
	//is_new_password_already_set
	socket.on('is_new_password_already_set', (name, pwd, callback) => {
	console.log("is_new_password_already_set:  username= %s  pwd = %s", name, pwd);
	
		pool.connect(async (err, connection, release) => {
		
		var query   = "SELECT pwdhistory FROM credentials WHERE(username = $1)";
		
	   console.log("promise 'is_new_password_already_set' : name = %s ", name);
	   
	   
	   // with release
		let result  = await executeQuery_(pool, query, [name], release);  
	
	    var alreadySet = false;
		var alreadySet = {"alreadySet": alreadySet};
		
	    if(result.rowCount == 0) {
			 console.log("promise 'is_new_password_already_set rowCount == 0 : " + alreadySet["alreadySet"]); //valeur de la cle 'alreadySet' du json 'alreadySet'.
			 alreadySet = {"alreadySet": alreadySet};
			 callback(alreadySet);
			 return;
	    }
		//here, 'rowCount' is not equal to 0. Analyse the the content of 'pwdhistory' column. It is a json.
		
		console.log('result.rows[0] keys = ' + Object.keys(result.rows[0]) + " " + JSON.stringify(result.rows[0]));
		
		var json_string = JSON.stringify(result.rows[0]);
		var json_object = JSON.parse(json_string);
		
		//the content of 'pwdhistory' column. It is an array.
		var pwdhistory  = result.rows[0].pwdhistory;
		
		//this column does it contains the password 'pwd'?
		alreadySet = pwdhistory.includes(pwd) ? true : false;
		console.log("promise 'is_new_password_already_set' pwd = " + pwd);
		console.log("promise 'is_new_password_already_setttttttt' json_string = " + json_string + " json_object = " +  json_object.pwdhistory + " pwdhistory " + pwdhistory + " pwdhistory.includes(pwd) = " + pwdhistory.includes(pwd));

		//return the json
	    alreadySet = {"alreadySet": alreadySet};
		
		console.log("promise 'is_new_password_already_set, alreadySet = " + JSON.stringify(alreadySet));
	    
		callback(alreadySet);
	  
	    
	    
		
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
	});//socket.on
	
	
	//register or update user in 'credentials' db
	socket.on('register_user_in_db', (name, pwd, date, callback) => {
	console.log("register_user_or_update_in_db:  username= %s  pwd = %s date = %s", name, pwd, date);
	
	pool.connect(async (err, connection, release) => {
		
		//var date = 0;
		
		//var query_   = "SELECT EXTRACT (EPOCH from now()) AS dateregister";
		var query__  = "SELECT pwdhistory, datehistory FROM credentials where username = $1";
		//var query   = "INSERT INTO credentials (username, password, date, pwdhistory, datehistory) VALUES($1, $2, $3, $4, $5, $6)";
		
		/*
		var query = "INSERT INTO credentials (username, password, date, pwdhistory, datehistory)" 			+
			" VALUES($1, $2, $3, $4, $5)"										    						+    					
			" ON CONFLICT (username) DO"										+ 
			
			" UPDATE SET        date    = EXCLUDED.date, "						+
						  "	password    = EXCLUDED.password, " 					+			
						  "	pwdhistory  = ARRAY_APPEND(EXCLUDED.pwdhistory, $6),"		+
						  "	datehistory = EXCLUDED.datehistory";
					  
		*/
		
		//'d' is an alias of db 'credential' before it is changed.
		var query = "INSERT INTO credentials AS d (username, password, date, pwdhistory, datehistory)" + 	
			        " VALUES($1, $2, $3, $4, $5)"   +
			  
			 " ON CONFLICT (username) DO"           +
			
			 " UPDATE SET"                          +          								
						  	//" password     = d.password,"                +
							" password     = $2,"                          +
							" date         = $3,"                          +
							" pwdhistory   = d.pwdhistory  || ARRAY[$2],"  +
							" datehistory  = d.datehistory || ARRAY[$3]"   +
						  	
			" WHERE d.username = $1";
		
		
		//var query = "UPDATE credentials set pwdhistory = ARRAY[$1] WHERE username = $2"	;//marche
		   
		//var query = "UPDATE credentials set pwdhistory = ARRAY_APPEND(pwdhistory, $1) WHERE username = $2"	; //marche 
		
		/*
		//get 'pwdhistory, datehistory' without 'release'
		let history  = await executeQuery(pool, query__, [name], release);  
		
		console.log("promise 'register_user_or_update_in_db' : history = %s ", history.rowCount);
		
		if(history.rowCount == 0){
			//no history
			console.log("promise 'register_user_in_db' : no history" );
		}else{
			// history
			pwdhistory   = history.rows[0].pwdhistory;
			console.log("promise 'register_user_in_db' : pwdhistory = %s ", pwdhistory);
		
			datehistory = history.rows[0].datehistory;
			console.log("promise 'register_user_in_db' : datehistory = %s ", datehistory);
		}
		*/
		
		//get the object 'date__', without 'release'
		//let date__  = await executeQuery(pool, query_, [], release);  
		
		//date now
		//date     = date__.rows[0].dateregister;
	    //console.log("promise 'register_user_in_db' : date register = %s ", date);
		
		var date_ = '{' + date + '}';
		//var date_ = ARRAY[date];
		
		//date_.push('0123456789');
		
		var pwd_  = '{' + pwd + '}';
		//pwd_.push('raLZi88@');
		//ARRAY['123', '456'] ou '{"123", "456"}' array_append(ARRAY[1,2],3)

	   console.log("promise 'register_user_in_db' : name = %s pwd = %s date = %s pwdhistory = %s datehistory = %s", name, pwd, date, pwd_, date_);
	   
	   // with release, do update or insert
	   // if 'insert', there is no conflict. it is the first time. we need [name, pwd, date, pwd_, date_]
	   // if 'update', there is conflict. we need [name, pwd, date, pwd_, date_]
		let register  = await executeQuery_(pool, query, [name, pwd, date, pwd_, date_], release);  //username, password, date, pwdhistory, datehistory
	
	    var insert  = false;
		var inserts = {"insert": insert};
		
	    if(register.rowCount == 0) {
			 console.log("promise 'register_user_in_db rowCount == 0 : " + inserts["insert"]); //valeur de la cle 'insert' du json 'inserts'.
			 inserts = {"insert": insert};
			 callback(inserts);
			 return;
	    }
	    insert = true;
	    inserts = {"insert": insert};
	  
	    console.log("promise 'register_user_in_db : rowCount == 1 : " + inserts["insert"]); //valeur de la cle 'insert' du json 'inserts'.
	  
	   callback(inserts);
		
		
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
	});//socket.on
	
	//query if the user exists in db
		socket.on('is_user_exists', (name, callback) => {
		
		console.log("is_user_exists:  username= %s ", name);
		
		var query = "SELECT COUNT(username) FROM credentials WHERE username = $1";
		
		pool.query(query,[name], async(error, results) =>{
		
			const promise = new Promise((resolve, reject) => {
				 resolve(results); 
			});
			
			//if(error)(reject("promise error "+error)); 
			let res = await promise;
			promise.then((value) => {	// value et result la même chose
			  //console.log("promise 'is_user_registered_in_db'  results = " + results);
			  //console.log("promise 'is_user_registered_in_db'  results.rowCount = " + results.rowCount); //JSON.stringify(results.rowCount));
			  
			  //console.log("'is_user_registered_in_db' : results.rowCount = " + results.rowCount + " results = " + results);
			  //console.log("promise 'is_user_registered_in_db'  rvalue.rows[0] = " + value.rows[0]);
			  
			  
			  //console.log('value keys = '+Object.keys(value));
			  //console.log('results keys = '+Object.keys(results));
				
			  //console.log('value.rows[0] keys = '+Object.keys(value.rows[0]));
			  //console.log('value.rows[0].count = '+value.rows[0].count);
			  
			var exists = {"exists": false};
			
			if(results == null){
				callback(exists);
				return;
			}
			if(results.rowCount == 0) {callback(exists);error.message; return;}
			  
		    if (value.rows[0].count == 1)exists = {"exists": true};;
		  
		    console.log("promise 'is_user_exists : " + exists["exists"]); //valeur de la cle 'exists' du json 'exists'.
		  
		    callback(exists);
			  
			  //io.to(socket.id).emit('get_image_profile_uri_back', results.rows); 
			  
			}).catch((error) =>{
				callback(exists);
				console.log("promise 'is_user_exists : " + error.message);
				console.log("promise 'is_user_exists' error : " + error.stack);
				//console.error(error);
			});
		
	});
	});
	
	//query if the user is registered in db
	socket.on('is_user_registered_in_db', (credential, callback) => {
		
		var name = credential["name"];
		var pwd  = credential["pwd"];
		
		console.log("is_user_registered_in_db :  username= %s pwd = %s", name, pwd);
		
		//case where the pwd is not supplied (null)
		//var query  = "SELECT COUNT(username) FROM credentials WHERE (username = $1)";
		var query  = "SELECT * FROM credentials WHERE (username = $1)";
		
		var query_ = []; // = {name, pwd};
		
		query_[0]  = name;

		//case where the pwd is supplied (not null)
		if(pwd != null){
			//query     = "SELECT COUNT(username) FROM credentials WHERE (username = $1) AND (password = $2)";
			query     = "SELECT * FROM credentials WHERE (username = $1) AND (password = $2)";
			query_[1] = pwd;
		}
		
		console.log("query = %s, query_ = %s", query, query_);
		
		pool.query(query, query_, async(error, results) =>{
		
			const promise = new Promise((resolve, reject) => {
				 resolve(results); 
			});
			
			//if(error)(reject("promise error "+error)); 
			let res = await promise;
			promise.then((value) => {	// value, res et result la même chose
			  //console.log("promise 'is_user_registered_in_db'  results = " + JSON.stringify(results));
			  //console.log("promise 'is_user_registered_in_db'  res = await promise = " + JSON.stringify(res));
			  
			  //console.log("promise 'is_user_registered_in_db'  results.rowCount = " + results.rowCount); //JSON.stringify(results.rowCount));
			  
			  //console.log("'is_user_registered_in_db' : results.rowCount = " + results.rowCount + " results = " + results);
			  //console.log("promise 'is_user_registered_in_db'  rvalue.rows[0] = " + value.rows[0]);
			  
			  
			  //console.log('value keys = '+Object.keys(value));
			  //console.log('results keys = '+Object.keys(results));
				
			  //console.log('value.rows[0] keys = '+Object.keys(value.rows[0]));
			  //console.log('value.rows[0].count = '+value.rows[0].count);
			  
			var exists = {"exists": false};
			
			console.log("results.rowCount = " +  results.rowCount + " value.rowCount = " + value.rowCount);
			
			console.log("results == null " + (results == null));
			console.log("results == undefined " + (results == undefined));
			
			
			/*
			if((results == null) || (results == 'undefined')){
				console.log("test null or undefined");
				exists = {"exists": null};
				callback(exists);
				return;
			}
			*/
			  
		    //if (results.rows[0].count == 1){ //'count' is the field name in 'select count() ...' querry
			if (results.rowCount == 1){  //the number of rows in results
				exists = {"exists": true};
				
				//return the object 'results' to client
				socket.emit('is_user_registered_in_db_res', results.rows[0]); //to sender
			}
		  
		    console.log("promise 'is_user_registered_in_db : exists = " + exists) //json
			console.log("promise 'is_user_registered_in_db : JSON.stringify(exists)) = " + JSON.stringify(exists)) //json
		    console.log("promise 'is_user_registered_in_db' : exists['exists'] = " + exists["exists"]); //valeur de la cle 'exists' du json 'exists'.
		  
		    callback(exists);
			  
			  //io.to(socket.id).emit('get_image_profile_uri_back', results.rows); 
			  
			}).catch((error) =>{
				callback(exists);
				console.log("promise 'is_user_registered_in_db : " + error.message);
				console.log("promise 'is_user_registered_in_db' error : " + error.stack);
				//console.error(error);
			});
		
	});
	});
	
	//query image profile uris
	socket.on('get_image_profile_uri', (name, callback) => {
		console.log("get_image_profile_uri,  nickname = " + name);
		
		var query = "SELECT nickname, uri, date FROM imageprofileuri WHERE nickname = $1";
		
		console.log("get_image_profile_uri,  query = " + query);
		
		pool.query(query,[name], async(error, results) =>{
		
			const promise = new Promise((resolve, reject) => {
				 resolve(results); 
			});
			
			//if(error)(reject("promise error "+error)); 
			let res = await promise;
			promise.then((value) => {	// value et result la même chose
			  //console.log("promise 'get_image_profile_uri'  results = " + results);
			  //console.log("promise 'get_image_profile_uri'  results   = " + JSON.stringify(results) + "\n");
			  //console.log("promise 'get_image_profile_uri'  value     = " + JSON.stringify(value));
			  //console.log("'get_image_profile_uri' : results.rows = " + results.rows);
			  //callback(results.rows);
			  //io.to(socket.id).emit('get_image_profile_uri_back', results.rows); 
			  socket.emit('get_image_profile_uri_back', results.rows); 
			}).catch((error) =>{
				//console.log("promise 'get_image_profile_uri' error : " + error.message);
				//console.log("promise 'get_image_profile_uri' error : " + error.stack);
				//console.error(error);
			});
		})
	});
	
	
	//query, if table exists : NOT USED
	socket.on('query_table_exists', (tableName, callback) => {
		//console.log("query_table_exists,  tableName= " + tableName);
		var query = "SELECT EXISTS (SELECT relname FROM pg_class WHERE relname = $1);";
		pool.query(query,[tableName], async(error, results) =>{
		
			const promise = new Promise((resolve, reject) => {
				 resolve(results); 
			});
			
			//if(error)(reject("promise error "+error)); 
			let res = await promise;
			promise.then((value) => {	// value et result la même chose
			  //console.log("promise then 'SELECT EXISTS '  results = " + results.rowCount); //JSON.stringify(results.rowCount));
			  
			  //console.log("results.rows[0].exists = " + results.rows[0].exists);
			  callback(results.rows[0].exists);
			  
			}).catch((error) =>{
				console.log("promise 'SELECT EXISTS' error : " + error.message);
				console.log("promise 'SELECT EXISTS' error : " + error.stack);
				//console.error(error);
			});
		})
	});

	//Not used
	//get last session users 
	socket.on('last_session_users', (nickname, callback) => {
		console.log("last_session_users : nickname = " + nickname + " id = " + socket.id);
		
		var query = "SELECT connectedwith FROM users WHERE nickname = $1";
		pool.query(query,[nickname], async(error, results) =>{
		
			const promise = new Promise((resolve, reject) => {
				 resolve(results); 
			});
			
			//if(error)(reject("promise error "+error)); 
			let res = await promise;
			promise.then((value) => {	// value et result la même chose
			  //console.log("promise then 'last_session_users, ...'  'typeof(results)!== undefined' = " + (typeof results !== 'undefined') + " results.rowCount = " + results.rowCount); //JSON.stringify(results.rowCount));
				
			var connectedWith   = JSON.parse('{}');
			
		    if(results.rowCount != 0){
				connectedWith   = results.rows[0].connectedwith;
			}
			
			//console.log('last_session_users, users in callback ' 		+	"\n" +
			//		' connectedWith = '			+ connectedWith
			//	);
			
			callback(connectedWith);
	
			//var json = {   'ref' 		: ref_, };
			
			//socket.to(socket.id).emit('last_session_users_back', "aa"); //connectedWith);
			
			
			}).catch((error) =>{
				//console.log("last_session_users : promise 'get_user, ...' error.message : " + error.message);
				//console.log("last_session_users : promise 'get_user, ...' error.stack : "   + error.stack);
				//console.error(error);
			});
		});
	});
	
	/*
	//SELECT * FROM Student WHERE name IN ('john', 'jack')
	
	$users = array(1,2,3,4,5);
	$usersStr = implode(',', $users); // returns 1,2,3,4,5
	$sql = "SELECT * FROM users where id in ({$userStr})";

	SELECT * FROM sal_emp WHERE 10000 = ANY (pay_by_quarter); //pay_by_quarter is an array
	select * from users where nickname = any (ARRAY['mono', 'bis', 'ter']);
	*/
	
	
	//saving last user
	socket.on('last_user', (lastUser, callback) => {	
		console.log("last_user : lastUser = " + lastUser);
		
		var nicknameorigine = lastUser.nicknameorigine;
		var nicknametarget  = lastUser.nicknametarget;
		var time            = lastUser.time;
		
		console.log(
			"last_user : "                          + "\n" +
			"nicknameorigine = " + nicknameorigine  + "\n" +
			"nicknametarget  = " + nicknametarget   + "\n" +
			"time            = " + time                               
		);
		
		//simple insert
		//var query = "INSERT INTO lastusers (nicknameorigine, nicknametarget, time) VALUES ($1, $2, $3)" ;
		
		//insert only if not exist
		//var query = "INSERT INTO lastusers (nicknameorigine, nicknametarget, time) 
		//            SELECT ($1, $2, $3) 
		//			WHERE NOT EXISTS (
		//			SELECT (1 FROM lastusers WHERE nicknameorigine = $1 AND nicknametarget = $2" ;
		
		//insert if not exist
		//if exist do update
		var query = 
		"UPDATE lastusers SET  time = $3  WHERE nicknameorigine = $1 AND nicknametarget = $2" +
		" INSERT INTO lastusers (nicknameorigine, nicknametarger, time)"                      +
        " SELECT  $1, $2, $3"              /** no parentheses **/                             +
        " WHERE NOT EXISTS (SELECT * FROM lastusers"                                          + 
						 " WHERE nicknameorigine = $1 AND nicknametarget= $2)";
		
		console.log("last_users : query = " + query);
		
		pool.connect(async (err, connection, release) => {
			let last_user  = await executeQuery_(pool, query, [nicknameorigine, nicknametarget, time ], release);
			var status = "fail";
			if(last_user.rowCount == 1) status = "success";
			console.log("last_users : status = " + status);
			callback(status);
			return;
		});
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
	});
	
	
	//get last users who contact who contect the main user.
	socket.on('get_last_users', (nickname) => {	
		//console.log("get_last_users : nickname = " + nickname);
		
		var query = "SELECT * FROM lastusers WHERE nicknameorigine = $1 OR nicknametarget = $1 ORDER BY time DESC" ;
		
		pool.connect(async (err, connection, release) => {
			let result = {};
			//get the names of last users.
			let get_last_users_names  = await executeQuery_(pool, query, [nickname], release);  
			
			console.log('get_last_users_names = ' + get_last_users_names.rowCount);
			
			let lastUsersNames = [];
		
				for (const user of get_last_users_names.rows){
					//console.log(user + ' in results.rows');
					lastUsersNames.push(user.nicknameorigine);
					if(user.nicknameorigine != user.nicknametarget){
						lastUsersNames.push(user.nicknametarget)
						break;
					}
				}
			
			if(lastUsersNames.length == 0) {
				io.to(socket.id).emit('get_last_users_back', [])
				return;
			}
			
			//var lastUsersNames = ['larry', 'curly', 'moe'];
			var offset = 1;
			var params = lastUsersNames.map(function(name,i) { 
			return '$'+(i+offset); 
			}).join(',');
			
			console.log('last_users : params = ' + params);
			
			//var query1 = "SELECT * FROM users WHERE nickname IN (" + params + ")" ;
			var query1 = "SELECT nickname, encode(users.imageprofile, 'escape') AS imageprofile, status, connected, lastconnected, disconnected, blacklistauthor, notseenmessages, connectedwith FROM users WHERE nickname IN (" + params + ")" ;
			
			console.log('last_users : query1 = ' + query1);
			
			//get users associated to last users name. 
			let last_users = await executeQuery(connection, query1, lastUsersNames); 
			
			console.log('last_users.rowCount = ' + last_users.rowCount);
			
			for(var i in last_users.rows){
				console.log('last_users.rows[' + i + '] = ' + last_users.rows[i].nickname);
			}
			
			io.to(socket.id).emit('get_last_users_back', last_users.rows);
		});//end pool.connect
		

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
		};
	
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
		
	});//en socket.on('get_last_users'
	
	//get users data
	//convert column bytea to string : select encode(table.your_column_name, 'escape') as your_alias_name from table_name.
	//we receive an array of users name who contect the main user.
	socket.on('get_users', (nicknames) => {	//'nicknames' = array
		//console.log("get_users : nicknames = " + nicknames);
		
		var query = "SELECT nickname, encode(imageprofile, 'escape') as imageprofile, status, connected, lastconnected, disconnected, blacklistauthor, notseenmessages, connectedwith FROM users WHERE nickname = ANY ($1)" ; //ANY is like IN
		pool.query(query,[nicknames], async(error, results) =>{
		
			const promise = new Promise((resolve, reject) => {
				 resolve(results); 
			});
			
			//if(error)(reject("promise error "+error)); 
			let res = await promise;
			promise.then((value) => {	// value et result la même chose
			  //console.log("promise then 'get_users, ...' results.rows = " + results.rows + " results.rowCount = " + results.rowCount); //JSON.stringify(results.rowCount));
			
			//order the result objet with respect to the supplied 'nicknames'. The first item in res array is associated to th first item in 'nicknames'
			let res = [];
			for (const nick of nicknames) {
				//console.log(nick + ' in nicknames');
				for (const user of results.rows){
					//console.log(user + ' in results.rows');
					if(user.nickname == nick){
						res.push(user);
						break;
					}
				}		
			}
			//console.log('get_users res = ' + res[0].nickname);
			
			/*
			var imageProfile 	= null;
			var status			= 1	//0=gone, 1=connect, 2=stanby, 3=blacklist
			var connectedAt 	= "0";
			var lastConnectedAt = "0"; 
			var disconnectedAt  = "0";
			var blacklistAuthor = null;
			var notSeenMessages = 0;
			var connectedWith   = JSON.parse('{}');
			
		    if(results.rowCount != 0){
				imageProfile	= results.rows[0].imageprofile;
				status 			= parseInt(results.rows[0].status, 2);
				connectedAt		= results.rows[0].connected;
				lastConnectedAt = results.rows[0].lastconnected;
				disconnectedAt  = results.rows[0].disconnected;
				blacklistAuthor = results.rows[0].blacklistauthor;
				notSeenMessages = results.rows[0].notseenmessages;
				connectedWith   = results.rows[0].connectedwith;
				
				//console.log("typeof  lastConnectedAt = " + typeof(lastConnectedAt));
			}
			
			
			console.log('get_user, users in callback ' 		+	"\n" +
					' nickname = ' 				+ nickname 				+ 	"\n" +
					//' imageProfile = ' 		+ imageProfile 			+	"\n" +
					' status = ' 				+ status 				+	"\n" +
					' connectedAt = ' 			+ connectedAt 			+	"\n" + 
					' lastConnectedAt = '		+ lastConnectedAt 		+	"\n" + 
					' disconnectedAt = '		+ disconnectedAt 		+	"\n" + 
					' blacklistAuthor = '		+ blacklistAuthor 		+	"\n" + 
					' notSeenMessages = '		+ notSeenMessages		+	"\n" + 
					' connectedWith = '			+ connectedWith
				);
			//build the final json 'user' to send in callback.
			var json = {   
					'imageProfile'	  : (imageProfile == null) ? null : imageProfile.toString(),
					'status'		  : status,
					'connectedAt'     : connectedAt,
					'lastConnectedAt' : lastConnectedAt,
					'disconnectedAt'  : disconnectedAt,
					'blacklistAuthor' : blacklistAuthor,
					'notSeenMessages' : notSeenMessages,
					'connectedWith'   : connectedWith
			};
			*/
			
			//var json = {"hello":"theworld"};
				
			//callback((imageProfile == null) ? null : imageProfile.toString(), status, connectedAt, lastConnectedAt, disconnectedAt, blacklistAuthor, notSeenMessages, connectedWith);
			//callback(json);
			//socket.to(nicknameId).emit('get_users_back', json); 
			//socket.to(socket.id).emit('get_users_back', json);
			console.log("********get_users_back res = " + res);
		    io.to(socket.id).emit('get_users_back', res); //results.rows); 
			}).catch((error) =>{
				//console.log("get_user : promise 'get_users_back, ...' error.message : " + error.message);
				//console.log("get_user : promise 'get_users_back, ...' error.stack : "   + error.stack);
				//console.error(error);
			});
		});
		
	});
	
	
	//get user data
	//socket.on('get_user', (nickname, callback) => {
	socket.on('get_user', (nickname) => {
		console.log("get_user : nickname = " + nickname +  "**************************************");
		
		////encode imageProfile otherwise it will be like : '[B@...]'
		var query = "SELECT nickname, encode(users.imageprofile, 'escape') AS imageprofile, status, connected, lastconnected, disconnected, blacklistauthor, notseenmessages, connectedwith FROM users WHERE nickname = $1";
		pool.query(query,[nickname], async(error, results) =>{
		
			const promise = new Promise((resolve, reject) => {
				 resolve(results); 
			});
			
			//if(error)(reject("promise error "+error)); 
			let res = await promise;
			promise.then((value) => {	// value et result la même chose
			  //console.log("'get_user' promise then results.rows = " + (results.rows == null) + " results.rowCount = " + results.rowCount); //JSON.stringify(results.rowCount));
				
			var nickname 		= null;
			var imageProfile 	= null;
			var status			= 1	//0=gone, 1=connect, 2=stanby, 3=blacklist
			var connectedAt 	= "0";
			var lastConnectedAt = "0"; 
			var disconnectedAt  = "0";
			var blacklistAuthor = null;
			var notSeenMessages = 0;
			var connectedWith   = JSON.parse('{}');
			
			//imageProfile = (results.rowCount != 0) ? results.rows[0].imageprofile : null;
			//console.log("'get_user' imageProfile = " + imageProfile);
			
			//console.log("'get_user' results = " + JSON.stringify(results));
			
			var json = null; //{};
				
		    if(results.rowCount != 0){
				nickname		= results.rows[0].nickname;
				imageProfile	= results.rows[0].imageprofile;
				status 			= parseInt(results.rows[0].status, 2);
				connectedAt		= results.rows[0].connected;
				lastConnectedAt = results.rows[0].lastconnected;
				disconnectedAt  = results.rows[0].disconnected;
				blacklistAuthor = results.rows[0].blacklistauthor;
				notSeenMessages = results.rows[0].notseenmessages;
				connectedWith   = results.rows[0].connectedwith;
				
				//console.log("typeof  lastConnectedAt = " + typeof(lastConnectedAt));
				
				console.log("(imageProfile == null) = " + (imageProfile == null));
				
				/*
				console.log('get_user' 									+	"\n" +
					' nickname = ' 				+ nickname 				+ 	"\n" +
					' imageProfile = ' 		    + (imageProfile == null) + ' ' + (imageProfile == 'null')	+	"\n" +
					' status = ' 				+ status 				+	"\n" +
					' connectedAt = ' 			+ connectedAt 			+	"\n" + 
					' lastConnectedAt = '		+ lastConnectedAt 		+	"\n" + 
					' disconnectedAt = '		+ disconnectedAt 		+	"\n" + 
					' blacklistAuthor = '		+ blacklistAuthor 		+	"\n" + 
					' notSeenMessages = '		+ notSeenMessages		+	"\n" + 
					' connectedWith = '			+ connectedWith
				);
				*/
				//build the final json 'user' to send in callback.
				
				json = {   
						'nickname'	  	  : nickname,
						'imageprofile'	  : (imageProfile == null) ? null : imageProfile.toString(),
						'status'		  : status,
						'connected'       : connectedAt,
						'lastconnected'   : lastConnectedAt,
						'disconnected'    : disconnectedAt,
						'blacklistauthor' : (blacklistAuthor == null) ? null : blacklistAuthor,
						'notseenmessages' : notSeenMessages,
						'connectedwith'   : connectedWith
				};
			}
			
			//var json = {"hello":"theworld"};
				
			//callback((imageProfile == null) ? null : imageProfile.toString(), status, connectedAt, lastConnectedAt, disconnectedAt, blacklistAuthor, notSeenMessages, connectedWith);
			//callback(json);
			//socket.to(nicknameId).emit('get_user_back', json); 
			//socket.to(socket.id).emit('get_user_back', json);
			
			console.log("json = " + json);
			
		    io.to(socket.id).emit('get_user_back', json); 
			//socket.to(socket.id).emit('get_user_back', json);//ne marche pas
			
			}).catch((error) =>{
				console.log("get_user : promise 'get_user, ...' error.message : " + error.message);
				console.log("get_user : promise 'get_user, ...' error.stack : "   + error.stack);
				console.error(error);
			});
		});
		
	});
		
	// User infos
	socket.on('save_chat_user_infos', (chatUserInfos, callback) => {
		//console.log("chat_user_infos chatUserInfos : " +  chatUserInfos);
		
		//Conversion string -> JSON
		const obj 					= JSON.parse(chatUserInfos);
		
		//console.log('save_chat_user_infos ' + JSON.stringify(chatUserInfos));
		
		const nickname 				= obj.nickname;
		const imageProfile_ 		= obj.imageProfile;
		const status 				= obj.status;
		const notSeenMessagesNumber	= obj.notSeenMessagesNumber;
		var connectedAt			= obj.connectedAt;
		const lastConnectedAt		= obj.lastConnectedAt;
		const blacklistAuthor 		= (obj.blacklistAuthor == null) ? null : obj.blacklistAuthor;
		
		/*
		console.log('chat_user_infos = ' 						+	"\n"	+
		'nickname : ' 				+ nickname 					+ 	"\n"	+
		//'chatId : ' 				+ chatId 					+ 	"\n"	+
		//'imageProfile : ' 		+ imageProfile_ 			+ 	"\n"	+
		'status : ' 				+ status 					+ 	"\n"	+
		'notSeenMessagesNumber : ' 	+ notSeenMessagesNumber 	+ 	"\n"	+
		'connectedAt : ' 			+ connectedAt				+ 	"\n"	+
	 	'lastConnectedAt : ' 		+ lastConnectedAt			+ 	"\n"	+
		'blacklistAuthor : ' 		+ blacklistAuthor			+ 	"\n"	
		);
		*/
		
		//const con = parseInt(connectedAt);
		//console.log("avant = " + (typeof connectedAt) + " apres = " +(typeof con) );
		
		//ALTER TABLE users
		//ADD CONSTRAINT constraint_name UNIQUE (nickname);
		
		//Save the user in db. The table column 'nickname' must have a 'UNIQUE' constraint. See the aove statement how to make a 'UNIQUE' constraint. 
		var query  = "INSERT INTO users (nickname, imageprofile, status, notseen, connected, lastconnected, blacklistauthor)" +
		"VALUES($1, $2, cast("+status+" AS bit(2)), cast("+notSeenMessagesNumber+" AS bit), $3, $4, $5)" + 
		"ON CONFLICT (nickname)" 	+ 
		" DO " 				+ 
		"UPDATE SET " 		+ 
		" status = cast("+status+" AS bit(2))," 				+
		" notseen = cast("+notSeenMessagesNumber+" AS bit)," 	+
		" connected = $3,"										+
		" lastconnected = $4,"									+
		" blacklistauthor = $5"; 
		
		
		/*
		console.log('query : INSERT into users' +	"\n" +
					' nickname = ' 				+ nickname 				+ 	"\n" +
					' imageProfile = ' 			+ imageProfile 			+	"\n" +
					' status = ' 				+ status_ 				+	"\n" +
					' notSeenMessagesNumber = '	+ notSeenMessagesNumber +	"\n" +
					' connectedAt = ' 			+ connectedAt 			+	"\n" + 
					' lastConnectedAt = '		+ lastConnectedAt 		+	"\n" +
					' blacklistAuthor = ' 		+ blacklistAuthor
		);
		*/
		
		
		pool.query(query,[nickname, imageProfile_, connectedAt, lastConnectedAt, blacklistAuthor], async(error, results) =>{
		
		//pool.query(query,[nickname, "aa",  status_, notSeenMessagesNumber, connectedAt, lastConnectedAt, blacklistAuthor ], async(error, results) =>{
		
			const promise = new Promise((resolve, reject) => {
				 resolve(results); 
			});
			
			//if(error)(reject("promise error "+error)); 
			let res = await promise;
			promise.then((value) => {	// value et result la même chose
			  //console.log("promise then 'INSERT into users'  results = " + results.rowCount); //JSON.stringify(results.rowCount));
				
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
				
			  var res = (results.rowCount == 1) ? "success" : "failure" ;
			  callback(res);
			}).catch((error) =>{
				//console.log("promise 'INSERT into users' error : " + error.message);
				//console.log("promise 'INSERT into users' error : " + error.stack);
				//console.error(error);
			});
		});
		
	});
								
	
	// last user joined.
	// send to =(nickname, id). send from = (nickname_, id_)
	//Send to nickname with id some information from nickname_ with id_.
	socket.on('lastuserjoined', function(nickname, id, nickname_, id_, profile_, status, connectionTime, lastConnectionTime, disconnectionTime, notSeenMessages, blacklistAuthor) {
		//console.log("last user : " + nickname + " id :" + id +" connectionTime : " + connectionTime+" last = " +lastConnectionTime);
		//io.sockets.socket(id).emit(" hello "+nickname);
		//io.sockets.connected[id].emit("lastuserjoinedthechat", "Thanks");
		socket.broadcast.to(id).emit("lastuserjoinedthechat", nickname_, id_, profile_, status, connectionTime, lastConnectionTime, disconnectionTime, notSeenMessages, blacklistAuthor);
	});


	//get user from database
	socket.on('user', (fromNickname, toNickname, toNicknameId, message, time) => {
       
		//log the message in console 

		//console.log("get user : "+fromNickname+" to  : "+toNickname+" toId : "+toNicknameId+" json message : "+message+" time : "+time);
   
		var query = "SELECT * FROM eleves ORDER BY id ASC";
		pool.query(query, (error, results, fields) => {
			if (error) {
				throw error
			}
			console.log("results : "+results); 
			//response.status(200).json(results.rows)
			//for (const eleve of results) {
			//  console.log("results : "+eleve.nom+" "+eleve.prenom);
			//}
			
			/*
			var result = new Array();
			pool.each(query, function (err, row) {
				result.push({ "guid": row.guid, "channel_guid": row.channel_guid, "user_guid": row.user_guid, "content": row.content });
			}, function () {
				//res.send(JSON.stringify(result));
			});
			*/
		})
	   
		/*
	   var query = "select * from message where channel_guid = '" + channelGUID + "'";
		var result = new Array();
		db.each(query, function (err, row) {
			result.push({ "guid": row.guid, "channel_guid": row.channel_guid, "user_guid": row.user_guid, "content": row.content });
		}, function () {
			res.send(JSON.stringify(result));
		});
		
		//create a message object 
	   //let  message = {"message":messageContent, "fromNickname":fromNickname, "toNickname":toNickname,"time":time}
		  // send the message to the client side  
	   //io.emit('message', message );
	   io.to(toNicknameId).emit('message', message );
	   //socket.broadcast.to(toNicknameId).emit('message', message );
	   console.log("message sent to  : " + toNickname + " json message = " + message)
	   */
  });

	//Do 2 things : 
	// 1- Update the current user and selected user in the map. 
	// 2- The messages sent by 'selectedUser' to 'current' are seen (seen=1)
	socket.on('current_selected_user', (currentUser, selectedUser, selectedUserId) => {
		//console.log("'current_selected_user' currentUser = " + currentUser + " selectedUser = " + selectedUser + " selectedUserId = " + selectedUserId);
		
		//update the map ('current', 'selected'). store the current user and his associated selected user.
		people0[currentUser] = selectedUser;
		//console.log("association : currentUser = " + currentUser + " people0[currentUser] = " + people0[currentUser]);
		
		if(selectedUser != null){
			//send notification to 'selectedUser' with id 'selectedId' to tell him his message is read
			socket.to(selectedUserId).emit('messages_read_back', currentUser);
		}else{
			
		}
		
		//update the messges in db, only unseen messages
	    var query  = "UPDATE messages SET seen='1' WHERE fromnickname = $1 AND tonickname = $2 AND seen = $3"; 
		pool.query(query, [selectedUser, currentUser, "0"], async(error, results) =>{
			const promise = new Promise((resolve, reject) => {
				 resolve(results); 
			});
			
			let res = await promise;
			promise.then((value) => {	// value et result la même chose
			  //console.log("promise then 'UPDATE messages'  results = " + JSON.stringify(results.rowCount));
			  
			}).catch((error) =>{
				//console.log("promise then 'UPDATE messages' error = " + error.message); 
			});
		});
	});

    //Test Send message to user with ack
    socket.on('messagedetection_', (data, callback) => {
		//console.log("messagedetection data toNicknameId = " + data);
		callback("success");
	});
	
	/*
	//Tell the user that his sent messages are seen
	socket.on('messages_read', (fromNickname, toNicknameId) => { 
		console.log("'messages_read'  fromNickname = " + fromNickname + " toNicknameId = " + toNicknameId);
		socket.to(toNicknameId).emit('messages_read_back', fromNickname);
	});
	*/
	
	//Send blacklist or recover notification
	socket.on('blacklist', (data)  => {
		//Conversion string -> JSON
	   const obj1 = JSON.parse(data);
	   var blacklistAuthor 		= obj1.blacklistAuthor;
	   var blacklistNickname 	= obj1.blacklistNickname;
	   var blacklistId 			= obj1.blacklistId;
	   var blacklistStatus 		= obj1.blacklistStatus;
	   
	   socket.to(blacklistId).emit('blacklist', blacklistAuthor, blacklistStatus);
	});
	
	
	//method to save last user infos
		//for test
		function updateLastUser_(nicknameorigine, nicknametarget, time){	
			return new Promise (resolve => {
				resolve(1);
			});
				//(1)); //console.log("updateLastUser method ");
		}
	
		//method to save last user infos
		function updateLastUser(nicknameorigine, nicknametarget, time){	
			console.log("updateLastUser method ");
			
			//var nicknameorigine = lastUser.nicknameorigine;
			//var nicknametarget  = lastUser.nicknametarget;
			//var time            = lastUser.time;
			
			console.log(
				"last_user : "                          + "\n" +
				"nicknameorigine = " + nicknameorigine  + "\n" +
				"nicknametarget  = " + nicknametarget   + "\n" +
				"time            = " + time                               
			);
		
		//simple insert
		//var query = "INSERT INTO lastusers (nicknameorigine, nicknametarget, time) VALUES ($1, $2, $3)" ;
		
		//insert only if not exist
		//var query = "INSERT INTO lastusers (nicknameorigine, nicknametarget, time) 
		//            SELECT ($1, $2, $3) 
		//			WHERE NOT EXISTS (
		//			SELECT (1 FROM lastusers WHERE nicknameorigine = $1 AND nicknametarget = $2" ;
		
		//insert if not exist
		//if exist do update
		//error : 'error in "executeQuery_" = erreur de syntaxe sur ou près de « INSERT »'
		//var query = 
		//"UPDATE lastusers SET  time = $3  WHERE nicknameorigine = $1 AND nicknametarget = $2" +
		//" INSERT INTO lastusers (nicknameorigine, nicknametarget, time)"                      +
        //" SELECT  $1, $2, $3"              /** no parentheses **/                             +
        //" WHERE NOT EXISTS (SELECT * FROM lastusers"                                          + 
		//				 " WHERE nicknameorigine = $1 AND nicknametarget= $2)";
		
		
		// 2 steps
		//if exists do update
		//else do insert
			var query1 = "SELECT * FROM lastusers WHERE nicknameorigine = $1 AND nicknametarget = $2";
			var query2 = "INSERT INTO lastusers (nicknameorigine, nicknametarget, time) VALUES ( $1, $2, $3)";
			var query3 = "UPDATE lastusers SET  time = $3  WHERE nicknameorigine = $1 AND nicknametarget = $2";
		
		
			return new Promise((resolve) => {
				var status = "fail";
				pool.connect(async (err, connection, release) => {
					let select  = await executeQuery(pool, query1, [nicknameorigine, nicknametarget ]);
					
					if(select.rowCount == 1){
						//do UPDATE
						let update  = await executeQuery(connection, query3, [nicknameorigine, nicknametarget, time]);
						if(update.rowCount == 1)status = "success";
					}else{
						//do insert
						let insert  = await executeQuery(connection, query2, [nicknameorigine, nicknametarget, time]);
						if(insert.rowCount == 1)status = "success";
					}
					
					console.log("last_users : status = " + status);
					//callback(status);
					resolve(status);
				});
				
			});
			
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
		};
	};//end function 'updateLastUser'
	
	
	//Send message to user.
	var fromNickname_;
	var toNickname_;
	socket.on('messagedetection', (message, callback) => { //message is json object, callback is used to send boolean for seen or unseen message
       
       //log the message in console 
	   //const obj = JSON.stringify(message);
	   //console.log("messagedetection, fromNickname = " + myMap.get(socket.id) + " fromId = " + socket.id + " receiveid object = " + message );
	   //console.log("messagedetection, fromNickname = " + fromNickname + " fromId = " + socket.id)
	   
	   //Conversion string -> JSON
	   const obj1 = JSON.parse(message);
	   //console.log('obj1 = '+obj1);
	   
	   //console.log('obj.ref = %s, obj1.ref = %s', obj.ref, obj1.ref);
	   
		var ref_ 			= obj1.ref; 
		fromNickname_ 		= obj1.fromNickname;
		toNickname_ 		= obj1.toNickname;
		var messageContent  = obj1.message;
		var time_ 			= obj1.time;
		var extra_			= (obj1.extra == null) ? null : obj1.extra;
		var extraName_		= (obj1.extraName == null) ? null : obj1.extraName;
		var mimeType		= (obj1.mimeType == null) ? null : obj1.mimeType;
		var seen		    = obj1.seen;
		var deletedFrom		= obj1.deletedFrom;
		var deletedTo 		= obj1.deletedTo;
		
		
        console.log("message arrived : " + 
		        "\nref       : " + ref_          +
				"\nfrom      : " + fromNickname_ +
				"\nto        : " + toNickname_   +
				"\ntoId      : " + "toNicknameId not supplied" +
				"\nmessage   : " + messageContent+
				"\ntime      : " + time_         +
				"\nextraName : " + extraName_    +
				"\nextra     : " + extra_        +
				"\nmimeType  : " + mimeType      
				);
        console.log("");
		console.log("");
		
		var toNicknameId    = obj1.toId;	// 'toId' n'est plus envoyé par android. Elle est 'null'. A partir de 'toNickname_' on trouve le id dans la map 'myMap'
		
		//get id for 'toNickname_' from 'myMap'
		console.log("message detection Map -------------------------------------------------size = "+myMap.size);
		console.log("");
		console.log("")
		const keys = myMap.keys(); //iterator
		let key = keys.next();
		var nickname;
		var toNicknameId0 = null;
		console.log("avant Begin Map toNickname_ = " + toNickname_);
		while (!	key.done) {
			 //console.log("map  value = " + myMap.get(key.value) + " key =  " + key.value); // key : value
			 //console.log("******** test if = " +(myMap.get(key.value) == toNickname_));
			 if(myMap.get(key.value) == toNickname_){
				toNicknameId0 = key.value;
				break;
			 }
			 key = keys.next();		 //next key
		}
		console.log("");
		console.log("")
		console.log("message detectionEnd Map-----------------------------------------------");
		console.log("**apres map **********toNickname = " + toNickname_ + " toNicknameId = " + toNicknameId0 );
		
		//if(toNicknameId0 == null)return callback(Error(' to message not found');
		
		//get id for 'toNickname_' from people
		var toNicknameId1 = null;
		for(var key_ in people) {
			//console.log("join : people keys : Key: " + key + " Value: " + people[key]);
			if(people[key_] == toNickname_)toNicknameId1 = key_
		}
		//if(toNicknameId1 == null)return callback (Error ('to message not found')); //throw new Error('to message not exist');
		
		
		console.log("**people **********toNickname = " + toNickname_ + " toNicknameId = " + toNicknameId1 );
		
		//En prinipe, lorsqu'ils ne sont pas nulls, 'toNicknameId0' from 'myMap and 'toNicknameId1' from 'people' sont egaux
		if((toNicknameId0 != null) && (toNicknameId1 != null)){
			if(toNicknameId1 != toNicknameId0)return callback (Error ('incoherence in myMap and people')); //throw new Error('to message not exist');
		}
		
		//console.log("messagedetection : association  fromNickname_ = " + fromNickname_ + " people0[fromNickname_] = " + people0[fromNickname_] );
		//console.log("messagedetection : association  toNickname_ = " + toNickname_ + " people0[toNickname_] = " + people0[toNickname_] );
		
		//Get the selected user associated to 'toNickname_' 
		var selectedNickname = people0[toNickname_];
		
		//Set the state of message
		var isRead = false;
		if(selectedNickname == fromNickname_){
			isRead = true;
			seen = "1";
		}
		
		//send callback to caller. It contains 'true' if the message is read by user target (toNickname) and 'false' if it is not read.
		//console.log("before callback read = " + isRead);
		callback(isRead);
		
		//console.log('(selectedNickname == fromNickname_) = '+(selectedNickname == fromNickname_)+' selectedNickname = '+selectedNickname+' fromNickname_ = '+fromNickname_ );
		
		//Rebuild the final json 'message' to send.
		var json = {   'ref' 		: ref_, 
					'fromNickname'	: fromNickname_, 
					'toNickname'	: toNickname_,
					'message'		: messageContent,
					'time'			: time_,
					'extra'			: extra_,
					'extraName'		: extraName_,
					'mimeType'		: mimeType,
					'seen'          : seen,
					'deletedFrom'   : deletedFrom,
					'deletedTo'     : deletedTo
			    };
		
		//console.log("message arrived ref = "+ref_);
		
		/*
        console.log("message arrived ref = "+ref_+
				"\nfrom : "		+ fromNickname_+
				"\nto  : "		+ toNickname_+
				"\ntoId : "		+ toNicknameId+
				"\nmessage : " 	+ messageContent+
				"\ntime : " 	+ time_+
				"\nextraName = " + extraName_+
				"\nextra = " 	+ extra_ +
				"\nmimeType = " + mimeType);
        */
		//console.log('query mime = %s', mimeType);
	    //create a message object 
        //let  message = {"message":messageContent, "fromNickname":fromNickname, "toNickname":toNickname,"time":time}
        // send the message to the client side  
        //io.emit('message', message );
        //io.to(toNicknameId).emit('message', json );
	    //socket.broadcast.to(toNicknameId).emit('message', json, (responseData)=>{	//exception : 'Callbacks are not supported when broadcasting'
		
		//console.log("redirect message, receiver id = " +   toNicknameId + " , (toNicknameId == null) = " + (toNicknameId == null) + " , people[toNicknameId] = " + toNicknameId + " , (people[toNicknameId] == null) = " + (people[toNicknameId] == null));
		
		//redirect the received message to the receiver only if it is connected. If it is not connected, increment the 'notSeenMessages' field
		console.log("");
		console.log("")
		console.log("before message_detection_back, check people -------------------------------------------------------------------------");
		console.log("");
		console.log("")
		for(var key_ in people) {
			console.log("people Key: " + key_ + " Value: " + people[key_]);
		}
		console.log("before message_detection_back, check people -------------------------------------------------------------------------");
		
		console.log("");
		console.log("");
		
		
		var toNicknameId__ = (toNicknameId == null) ? 'not connected' :  toNicknameId;
		
		console.log("message_detection_back, the user who send the message, his name = '" + fromNickname_ + "' his id = " + socket.id);
		console.log("message_detection_back, the user who would receive the message, his name = '" + toNickname + "' his id = " + toNicknameId__);
		
		//socket.emit('message_detection_back', json); 
		//io.emit('message_detection_back', json);
		if(toNicknameId != null){ // or if(people.hasOwnProperty(toNicknameId)) or if(myMap contain toNicknameId
			//the user who would received the message is connected.
			console.log("the user who would received the message is connected. Its name = " + people[toNicknameId] + " id = " + toNicknameId);
			//socket.to(toNicknameId).emit('message_detection_back', json); 
			//socket.emit('message_detection_back', json); 
			//io.emit('message_detection_back', json); //marche
			socket.to(toNicknameId).emit('message_detection_back', json );  ////emit only to user who do receive the message = 'toNickname_'
			//io.to(toNicknameId).emit('message_detection_back', json ); 
			
		}else{
			/*
			//the user who would received the message is not connected. He will find his message saved in db. Now, increment the 'notSeenMessages' field of sender
			console.log("the user who would received the message is not connected");
			var query  = "UPDATE users SET notseenmessages = (notseenmessages + 1) WHERE nickname = $1;"; 
			//var query  = "update users SET connectedwith = connectedwith || '{$2:$3}'::jsonb where nickname=$1;"; 
			console.log('update users SET notseenmessages : ' + query);
			
			pool.query(query, [fromNickname_], async(error, results) =>{
			
				const promise = new Promise((resolve, reject) => {
					 resolve(results); 
				});
				
				//if(error)(reject("promise error "+error)); 
				let res = await promise;
				promise.then((value) => {	// value et result la même chose
				  console.log('update users SET notseenmessages ...  = ' + JSON.stringify(results.rowCount));
				  
				}).catch((error) =>{
					console.log("update users SET notseenmessages ...  " + error.message); 
				});
			});
			*/
		}
		
	    //console.log("message sent to  : "+toNickname_+" id = "+toNicknameId+" json object message = "+message)
		//console.log("message sent to  : "+toNickname_+" id = "+toNicknameId);
	   
	    //Save the arrived message in db. In all the cases : The user who is destinated this message is currently connected or not.
	    var query  = "INSERT into messages (ref, fromnickname, tonickname, message, time, extra, extraname, mime, seen, deletedfrom, deletedto) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)"; //The id is automatically added if it is auto increment
		//console.log('Save the arrived message in db'); 
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
		
		pool.query(query, [ref_, fromNickname_, toNickname_, messageContent, time_, extra_, extraName_, mimeType, seen, deletedFrom, deletedTo], async(error, results) =>{
		//pool.query(query, [ref_, fromNickname_, toNickname_, messageContent, time_, extra_, extraName_, 'pdf'], async(error, results) =>{
			const promise = new Promise((resolve, reject) => {
				 resolve(results); 
			});
			
			//if(error)(reject("promise error "+error)); 
			let res = await promise;
			promise.then((value) => {	// value et result la même chose
			  //console.log('promise then INSERT into messages  results = '+JSON.stringify(results.rowCount));
			  //socket.emit('uploadMessageComplete', { 'IsSuccess' : true });
			  //io.emit('uploadMessageComplete', { 'IsSuccess' : true });
			  //io.to(socket.id).emit('uploadMessageComplete', { 'IsSuccess' : true }); //marche
			  //console.log("the user who would received the message is not connected. Its name = " + people[toNicknameId] + " id = " + toNicknameId);
			  console.log("the user who send the message its name = " + fromNickname_ + " or = " + people[socket.id] + " id = " + socket.id);
		
			console.log("");
			console.log("")
			console.log("promise insert message : error in 'people[socket.id]' renvoi indefined : socket.id = " + socket.id);
			
			console.log("");
			console.log("")
			console.log("promise insert message, check people -------------------------------------------------------------------------");
			console.log("");
			console.log("")
			for(var key_ in people) {
				console.log("people Key: " + key_ + " Value: " + people[key_]);
			}
			console.log("promise insert message, check people -------------------------------------------------------------------------");
			
			console.log("");
			console.log("");
			  
			  
			  socket.emit('uploadMessageComplete', { 'IsSuccess' : true });//emit only to user who send the message = 'fromNickname_'
			  console.log('message succesfully saved');
			  console.log("");
		      console.log("");
			  
			}).catch((error) =>{
				//console.log("promise insert into messages " + error.message); 
				socket.emit('uploadMessageComplete', { 'IsSuccess' : false }) //emit only to user who send the message = 'fromNickname_'
			    
			});
		});
		
		//update the 'users' table, column 'connectedwith', of the user'nikname'. The target of the message = 'toNickname_'.
		// update users SET connectedwith = connectedwith || '{"qwerty" : 5000}'::jsonb where nickname='xcv2';
		
		var query  = "update users SET connectedwith = connectedwith || '{\""+toNickname_+"\":"+time_+"}'::jsonb where nickname=$1;"; 
		//var query  = "update users SET connectedwith = connectedwith || '{$2:$3}'::jsonb where nickname=$1;"; 
		//console.log('query : ' + query);
		
		pool.query(query, [fromNickname_], async(error, results) =>{
		
			const promise = new Promise((resolve, reject) => {
				 resolve(results); 
			});
			
			//if(error)(reject("promise error "+error)); 
			let res = await promise;
			promise.then((value) => {	// value et result la même chose
			  //console.log('messagedetection : origine : update users ...  = ' + JSON.stringify(results.rowCount));
			  
			}).catch((error) =>{
				//console.log("messagedetection : origine : update users ...  " + error.message); 
			});
		});
		
		//update the 'users' table,  column 'connectedwith', row 'nikname' origine of the message = 'fromNickname_'.
		var query  = "update users SET connectedwith = connectedwith || '{\""+fromNickname_+"\":"+time_+"}'::jsonb where nickname=$1;"; 
		//var query  = "update users SET connectedwith = connectedwith || '{$2:$3}'::jsonb where nickname=$1;"; 
		//console.log('query : ' + query);
		
		pool.query(query, [toNickname_], async(error, results) =>{
		
			const promise = new Promise((resolve, reject) => {
				 resolve(results); 
			});
			
			//if(error)(reject("promise error "+error)); 
			let res = await promise;
			promise.then((value) => {	// value et result la même chose
			  //console.log('messagedetection : target : update users ...  = ' + JSON.stringify(results.rowCount));
			  
			}).catch((error) =>{
				//console.log("messagedetection : target : update users ...  " + error.message); 
			});
		});
		
		//update the lastusers table. The reurned value 'status' may be 'success' or 'fail'.
		async function status(fromNickname_, toNickname_, time_){
			
			var status_ = await updateLastUser(fromNickname_, toNickname_, time_);
			console.log('messagedetection : updateLastUser : status = ' + status_);
			//return status_;
		}
		
		status(fromNickname_, toNickname_, time_);
		
    });//end message detection
      
	  
	  
	//update message when it is deleted.
	socket.on('update_message', (deleteArgs, callback) => { //See 'TabChatActivity.updateMessage' for the values of 'deleteArgs' parameter.
		var ref 	= deleteArgs["Ref"];
		var delete_ = deleteArgs["Delete"]; //may be "1" or "2"
		//console.log("update_message, ref = " + ref + " delete = " + delete_);
		
		var query_ = null;
		if(delete_ == "1") query_ = 'deletedfrom';
		if(delete_ == "2") query_ = 'deletedto';
		
		 //update the table 'chat_messages' in db 
	    var query  = "UPDATE messages SET " + query_ + " = (CAST($1 AS bit)) WHERE ref = $2";  //(CAST($1 AS bit))
		
		//console.log('query = ' + query);
		
		pool.query(query, [1, ref], async(error, results) =>{
		const promise = new Promise((resolve, reject) => {
				 resolve(results); 
			});
			
			let res = await promise;
			promise.then((value) => {	// value et result la même chose
			  //console.log('promise then UPDATE messages SET   results = '+JSON.stringify(results.rowCount));
			  
			}).catch((error) =>{
				//console.log("promise insert into messages "+error.message); 
			});
			
			//return the callback
			callback(JSON.stringify(results.rowCount));
		
		});
	});
	
	
	 /*
	//The user disconnect
	socket.on('disconnect__', function(nickname) {
		console.log(nickname+" user has left ");
		socket.broadcast.emit('user disconnect', nickname);
	})
	*/
	
	/*
	//The user disconnect
	//The event 'disconnect_' is emited by the android user. It the same as socket.on('disconnect treated above. 
	socket.on('disconnect_', function(nickname){	//'disconnect' est un mot clé
		console.log(nickname+" user has left ");
	 
		//get the nickname of the disconnected user from the map and using socket.id which is known.
		const keys = myMap.keys(); //iterator
		let key = keys.next();
		var nickname;
		while (!key.done) {
			console.log(key.value); //the value --> key
			if(myMap.get(key.value) == socket.id){
				nickname = key.value;
				console.log( 'Matching : nickname = ' + nickname);
			}
			key = keys.next();		 //next key
		}
		console.log( nickname + " "+socket.id + ' user has left ')
    
		//remove the disconnected user from the map
		n--;
		//people delete nickname
		delete people[socket.id];
		delete profile[nickname];
		
		//myMap.delete nickname;
		//console.log("user = "+nickname+" deleted status : "+myMap.delete(nickname));
		
		//the current array
		console.log("people = "+JSON.stringify(people));
		
		//Notify the people the name of the user who is disconnected
		socket.broadcast.emit("userdisconnect", nickname);   
	
	
		//log map content
		//console.log("Map -------------------------------------------------size = "+Map.size);
		//const keys1 = myMap.keys(); //iterator
		//let key1 = keys1.next();
		//while (!key1.done) {
		//	 console.log(key1.value+" : "+myMap.get(key1.value)); //the value --> key
		//	 key1 = keys.next();		 //next key
		//}
		//console.log("-------------------------------------------------");
		//console.log("array from map : "+Array.from(myMap))
	});
	*/
	
	//the user standby
	socket.on('standby', function(nickname){	
		console.log(nickname + " standby ");
		 
		//get the nickname of the disconnected user from the map and using 'socket.id' which is known.
		//No need to use iterator over 'myMap'. We may use : 'myMap.get(socket.id)' to get the nickname of user who is diconnect.
		
		/*
		const keys = myMap.keys(); //iterator
		let key = keys.next();
		var nickname;
		while (!key.done) {
			 console.log(key.value); //the value --> key
			 if(myMap.get(key.value) == socket.id){
				 nickname = key.value;
				 console.log( 'Matching : nickname = ' + nickname);
			 }
			 key = keys.next();		 //next key
		}
		*/
		console.log( nickname + " "+myMap.get(socket.id) + ' is standby ');
		
		//myMap.delete nickname;
		//console.log("user = "+nickname+" deleted status : "+myMap.delete(nickname));
		
		//the current array
		console.log("people = "+JSON.stringify(people));
		
		//Notify the people the name of the user who is standby
		socket.broadcast.emit("userstandby", nickname); 

	});

	//the user back standby
	socket.on('backstandby', function(nickname){	
		console.log(nickname+" back standby ");
		 
		//get the nickname of the disconnected user from the map and using socket.id which is known.
		const keys = myMap.keys(); //iterator
		let key = keys.next();
		var nickname;
		while (!key.done) {
			 //console.log(key.value); //the value --> key
			 if(myMap.get(key.value) == socket.id){
				 nickname = key.value;
				 //console.log( 'Matching : nickname = ' + nickname);
			 }
			 key = keys.next();		 //next key
		}
		console.log( nickname + " " + socket.id + ' is back standby ');
		
		//myMap.delete nickname;
		//console.log("user = "+nickname+" deleted status : "+myMap.delete(nickname));
		
		//the current array
		console.log("people = " + JSON.stringify(people));
		
		//Notify the people the name of the user who is standby
		socket.broadcast.emit("userbackstandby", nickname); 

   });
   
   socket.on('get_messages_', function(data, callback){	//'data' is json object.
	 //console.log('data = '+JSON.stringify(data));
	 //callback("true");
	 const nbMessages = 10;
	//var query  = "SELECT ref, fromnickname, tonickname, message, time, extra, extraname, mime, seen, deleted FROM messages WHERE id <= 10"; //heroku table
	var query  = "SELECT ref, fromnickname, tonickname, message, time, extra, extraname FROM messages WHERE id <= $1";
		pool.query(query, [nbMessages], async(error, results, fields) => {
			const promise = new Promise((resolve, reject) => {
				resolve(results);
				callback(results.rowCount);
				//console.log("results.rowCount = "+results.rowCount);
		    });
			if (error) {
				//throw error
				//console.log("error in 'SELECT ref, fromnickname, ' : "+error); 
			}
			//console.log("results of 'SELECT ref, fromnickname, ' rowCount : "+results.rowCount); 
					
		})
	 });
   
    //socket.on('get_messages', function(selectedNickname, currentNickname, idCurrentNickname, callback){	
    socket.on('get_messages', function(data, callback){	//'data' is json object.
	//console.log('get_messages, data = '+JSON.stringify(data));
	
	 var selectedNickname 	= data["SelectedNickname"];
	 var currentNickname 	= data["Nickname"];
	 var idCurrentNickname 	= socket.id; //data["IdNickname"];
	 var nbMessages			= data["nbMessages"];
	 
	 //console.log('get_messages selectedNickname : %s, currentNickname = %s, idCurrentNickname = %s', selectedNickname, currentNickname, idCurrentNickname);
	 
	 var query  = "SELECT ref, fromnickname, tonickname, message, time, extra, extraname, mime, seen, deletedfrom, deletedto FROM messages WHERE "+ 
					"((fromnickname = $1 AND  tonickname = $2) OR "	+ 
					"(fromnickname = $3 AND  tonickname = $4)) AND (deletedfrom != CAST(1 AS bit)) AND (deletedto != CAST(1 AS bit))" 	+
					"ORDER BY time DESC LIMIT $5";
					
	//var query  = "SELECT ref, fromnickname, tonickname, message, time, extra, extraname, mime FROM messages WHERE id = $1";	  
	 pool.query(query, [currentNickname ,selectedNickname,  selectedNickname, currentNickname, nbMessages], async(error, results) => {  
	 //pool.query(query, [254], async(error, results) => {  //INSERT //$1=data, $2=5 (row id =5).
		const promise = new Promise((resolve, reject) => {
			resolve(results);
			//console.log('results.rowCount : ' + results.rowCount);
			callback(results.rowCount)
			
		});
		//if(error)(reject("promise error "+error)); 
		
		let res = await promise;
		promise.then((value) => {
		  //console.log('results.rowCount : ' + results.rowCount);
		  //console.log('promise in get_messages. value = '+value+' count = '+value.rowCount+' length = '+value.rows.length+' fields length = '+value.fields.length);
		  //console.log('value keys = '+Object.keys(value));
		  //console.log('rowAsArray = '+value.rowAsArray);
		  
		  
		  //if(results.rowCount == 0){
		  //	var json = [];
		  //	//send result to android client
		  //	io.to(idCurrentNickname).emit('get_messages_res', json);  
		  //	return;
		  // }
		
		  //get last row for testing
		  if(results.rowCount > 0){
			  
			  var index = results.rowCount - 1;
			  /*
			  console.log(	'ref = '			+ value.rows[index].ref 			+	"\n"	+
							' fromnickname = ' 	+ value.rows[index].fromnickname 	+	"\n"	+
							' tonickname = '	+ value.rows[index].tonickname 		+	"\n"	+
							' message = '		+ value.rows[index].message 		+	"\n"	+
							' time = '			+ value.rows[index].time			+	"\n"	+
							//' extra = ' 		+ value.rows[index].extra 			+	"\n"	+
							' extraname = ' 	+ value.rows[index].extraname 		+	"\n"	+
							' mime = ' 			+ value.rows[index].mime 			+	"\n"	+
							' seen = ' 			+ value.rows[index].seen 			+	"\n"	+
							' deletedfrom = ' 	+ value.rows[index].deletedfrom 	+	"\n"	+
							' deletedto = ' 	+ value.rows[index].deletedto 	
							);
			  */
		  }
		  
		  // le nom des champs de la table
		  //console.log('ref '+value.fields[0].name +' fromnickname = '+value.fields[1].name+' tonickname = '+value.fields[2].name);
						
		  if (error) {
			//console.log('*** error  in get_messages ****'+error);
		  }
		  
		  var json = [];
		  for(var i = 0; i < value.rows.length; i++){
			  //console.log('i = '+i);
			  var json_ = {};
			  json_ = { 'ref' 			: value.rows[i].ref, 
						'fromnickname'	: value.rows[i].fromnickname, 
						'tonickname'	: value.rows[i].tonickname,
						'message'		: value.rows[i].message,
						'time'			: value.rows[i].time,
						'extra'			: (value.rows[i].extra == null) ? null : value.rows[i].extra.toString(),
						'extraname'		: (value.rows[i].extraname == null) ? null : value.rows[i].extraname,
						'mime'			: (value.rows[i].mime == null) ? null : value.rows[i].mime,
						'seen'		    : (value.rows[i].seen == null) ? null : value.rows[i].seen,
						'deletedfrom'	: (value.rows[i].deletedfrom == null) ? null : value.rows[i].deletedfrom, 
						'deletedto'	    : (value.rows[i].deletedto == null) ? null : value.rows[i].deletedto 
					  };
					  
			  //console.log('ref = %s, message = %s, time = %d', value.rows[i].ref, value.rows[i].message, value.rows[i].time);
			json.push(json_);
		  }// end for loop
		  
		  //send result to android client
		  //console.log("get_messages_res, id = " + socket.id + " json = " + json);
		  //io.to(idCurrentNickname).emit('get_messages_res', json);	//marche avec 'idCurrentNickname'
		  console.log("get_messages_res ************");
		  io.to(socket.id).emit('get_messages_res', json);	//marche
		  //socket.to(socket.id).emit('get_messages_res', json); //not working : à cause de 'socket.id'
		  //socket.to(idCurrentNickname).emit('get_messages_res', json); //not working : à cause de 'socket.id'
		}).catch((error) =>{
			console.log("get_messages_res, promise 'select ref ... from messages' " + error.message); 
		}); 
	});
	
   });
     
   ///////////////////////////////////////////////////////////////////////////////////////////////////
   socket.on('get_all_not_seen_messages$', function(nickname){	
	
	console.log('get_all_not_seen_messages, nickname : %s ', nickname);
	
	pool.connect((err, client, release) => {
		var query1 = "SELECT " + 
		' messages.fromnickname as "fromNickname", messages.tonickname as "toNickname",  messages.message, messages.time, messages.extra, ' + 
		' messages.extraname as "extraName", messages.ref, messages.mime as "mimeType", messages.seen, messages.deletedto as "deletedTo", messages.deletedfrom as "deletedFrom" ' +
		' FROM messages ' +
		' WHERE messages.tonickname = $1' + 
		' AND messages.seen = cast(0 as bit(1))';
		if (err) {
			return console.error('Error acquiring client', err.stack)
		}
		client.query(query1, [nickname], (err, result) => {
			release()
			if (err) {
				return console.error('Error executing query', err.stack)
			}
			console.log('result = ' + result + ' result.rows==null = ' + (result.rows==null) + ' result.rows = ' + result.rows + ' is empty = ' + (Object.keys(result).length === 0) )
		});
		let result = {};
		console.log('get_all_not_seen_messages_res : result = ' + result);
		io.to(socket.id).emit('get_all_not_seen_messages_res', result);
	});
   });
   ///////////////////////////////////////////////////////////////////////////////////////////////////
   socket.on('get_all_not_seen_messages', function(nickname){	
	console.log('get_all_not_seen_messages, nickname : %s ', nickname);
	//console.log('get_all_not_seen_messages, pool = ', pool);
	pool.connect(async (err, connection, release) => {
		
		//all not seen messages received by 'nickname'
		var query1 = "SELECT " + // 'messages.extra' must be encoded to text otherwise it is byteA
		' messages.tonickname as "toNickname", messages.fromnickname as "fromNickname",  messages.message, messages.time, encode(messages.extra, \'escape\') AS "extra" , '  + 
		' messages.extraname as "extraName", messages.ref, messages.mime as "mimeType", messages.seen, messages.deletedto as "deletedTo", messages.deletedfrom as "deletedFrom" ' +
		' FROM messages ' +
		' WHERE messages.tonickname = $1' + 
		' AND messages.seen = cast(0 as bit(1))';
		
		//all not seen messages received by 'nickname' after disconnect
		var query10 = "SELECT " + // 'messages.extra' must be encoded to text otherwise it is byteA
		' messages.tonickname as "toNickname", messages.fromnickname as "fromNickname",  messages.message, messages.time, encode(messages.extra, \'escape\') AS "extra" , '  + 
		' messages.extraname as "extraName", messages.ref, messages.mime as "mimeType", messages.seen, messages.deletedto as "deletedTo", messages.deletedfrom as "deletedFrom" ' +
		' FROM messages '                        +
		' WHERE messages.tonickname = $1'        + 
		' AND messages.seen = cast(0 as bit(1))' +
		' AND messages.time >= $2';
		
		
		//count the not seen messages received by 'nickname'
		var query11 = "SELECT " + // 'messages.extra' must be encoded to text otherwise it is byteA
		' count(messages.fromnickname) AS "nbMessages",' +
		' messages.fromnickname as "fromNickname",'      +
		' messages.tonickname as "toNickname",'          +
		' messages.message, messages.time, encode(messages.extra, \'escape\') AS "extra" , '  + 
		' messages.extraname as "extraName", messages.ref, messages.mime as "mimeType", messages.seen, messages.deletedto as "deletedTo", messages.deletedfrom as "deletedFrom" ' +
		
		' FROM messages '                        +
		' WHERE messages.tonickname = $1'        + 
		' AND messages.seen = cast(0 as bit(1))' +
		' GROUP BY messages.fromnickname,'       +
		' messages.tonickname,'                  +
		' messages.message,'                     +
		' messages.time,'                        +
		' messages.extra,'                       +
		' messages.extraname,'                   +
		' messages.ref,'                         +
		' messages.mime,'                        +
		' messages.seen,'                        +
		' messages.deletedto,'                   +
		' messages.deletedfrom';
		
		//count the authors (nickname, imageProfile, nbMessages) of the not seen messages before and after disconnect.
		var query12 = "SELECT" + // 'imageprofile' must be encoded to text otherwise it is byteA
		' count(messages.fromnickname) AS "nbMessages",'            +
		' messages.fromnickname AS "nickname",'                     +
		' encode(users.imageprofile, \'escape\') AS "imageProfile"'	+ 
		
		/*
		' users.status,'+ 
		' users.connected AS "connectedAt",' + 
		' users.lastconnected AS "lastConnectedAt",' + 
		' users.disconnected AS "disconnectedAt",'	+
		' users.blacklistauthor AS "blacklistAuthor",'	+
		' users.notseenmessages AS "notSeenMessagesNumber",' +
		' users.connectedwith AS "connectedWith"' +   
		*/
		
		' FROM messages '                             +
		' LEFT JOIN users '                           +
		' ON messages.fromnickname = users.nickname ' + 
		' WHERE messages.tonickname = $1'             + 
		' AND messages.seen = cast(0 AS bit(1))'      +
		//' AND messages.time >= $2' +
		
		' GROUP BY messages.fromnickname,'            +
		' users.nickname,' +
		' users.imageprofile';
		
		/*
		' users.status,' +
		' users.connected,' +
		' users.lastconnected,' + 
		' users.disconnected,' +
		' users.blacklistauthor,' +
		' users.notseenmessages,' +
		' users.connectedwith';
		*/
		
		
		//count the users whom send not seen messages after disconnect
		var query21 = "SELECT" + // 'imageprofile' must be encoded to text otherwise it is byteA
		' count(messages.fromnickname) AS "nbMessages",'                +
		' users.nickname,'	                                            +
		' encode(users.imageprofile, \'escape\') AS "imageProfile",'	+ 
		' users.status,'                                                + 
		' users.connected AS "connectedAt",'                            + 
		' users.lastconnected AS "lastConnectedAt",'                    + 
		' users.disconnected AS "disconnectedAt",'	                    +
		' users.blacklistauthor AS "blacklistAuthor",'	                +
		' users.notseenmessages AS "notSeenMessagesNumber",'            +
		' users.connectedwith AS "connectedWith"'                       +   
		
		' FROM messages '                                               +
		' LEFT JOIN users '                                             +
		' ON messages.fromnickname = users.nickname '                   + 
		' WHERE messages.tonickname = $1'                               + 
		' AND messages.seen = cast(0 AS bit(1))'                        +
		' AND messages.time >= $2'                                      +
		
		' GROUP BY messages.fromnickname,'                              +
		' users.nickname,'                                              +
		' users.imageprofile,'                                          +
		' users.status,'                                                +
		' users.connected,'                                             +
		' users.lastconnected,'                                         + 
		' users.disconnected,'                                          +
		' users.blacklistauthor,'                                       +
		' users.notseenmessages,'                                       +
		' users.connectedwith';
		
		//get the full users whom send not seen messages after disconnect
		var query2 = "SELECT" + // 'imageprofile' must be encoded to text otherwise it is byteA
		' messages.time,' +
		' users.nickname,'	+
		' encode(users.imageprofile, \'escape\') AS "imageProfile",'	+ 
		' users.status,'+ 
		' users.connected AS "connectedAt",' + 
		' users.lastconnected AS "lastConnectedAt",' + 
		' users.disconnected AS "disconnectedAt",'	+
		' users.blacklistauthor AS "blacklistAuthor",'	+
		' users.notseenmessages AS "notSeenMessagesNumber",' +
		' users.connectedwith AS "connectedWith"' +   
		
		' FROM messages ' +
		' LEFT JOIN users ' +
		' ON messages.fromnickname = users.nickname ' + 
		' WHERE messages.tonickname = $1' + 
		' AND messages.seen = cast(0 AS bit(1))' +
		' AND messages.time >= $2';


		//get the disconnect time of nickname.
		var query22 = 'SELECT' + 
		' users.nickname, users.disconnected AS "disconnectedAt"'	+ 
		' FROM users' +
		' WHERE users.nickname = $1'; 

		var query3 = 'SELECT ' + 
		 ' fromnickname, tonickname, MAX(time) AS time' +    // la fonction MAX(time) prend la plus grande valeur de time pour distinguer les valeurs de time à garder, car il peut y avoir plusieurs valeurs.
		 ' FROM messages  ' + 
		 ' WHERE messages.tonickname = $1' + 
		 ' AND messages.seen = cast(0 as bit(1)) ' + 
		 ' group by fromnickname, tonickname';
		 
		
		//encode imageProfile otherwise it will be like : '[B@...]'
		var query4 = "SELECT" + 
		' messages.fromnickname as "fromNickname", users.nickname, encode(users.imageprofile, \'escape\') AS "imageProfile", users.status, users.connected AS "connectedAt", users.lastconnected AS "lastConnectedAt",' + 
		' users.disconnected AS "disconnectedAt", users.blacklistauthor AS "blacklistAuthor", users.notseenmessages AS "notSeenMessagesNumber", users.connectedwith AS "connectedWith"' +    
		' FROM messages ' +
		' JOIN users ' +
		' ON messages.fromnickname = users.nickname  ' +
		' WHERE messages.tonickname = $1 ' +
		' AND messages.seen = cast(0 AS bit(1))';
		
		var query5 = "SELECT" + 
		' users.connectedwith AS "connectedWith" '     +
		' FROM users ' +
		' WHERE users.nickname = $1 ';
		
		var query6 = "SELECT" + 
		' users.nickname, encode(users.imageprofile, \'escape\') AS "imageProfile", users.status, users.connected AS "connectedAt", users.lastconnected AS "lastConnectedAt",' + 
		' users.disconnected AS "disconnectedAt", users.blacklistauthor AS "blacklistAuthor", users.notseenmessages AS "notSeenMessagesNumber", users.connectedwith AS "connectedWith"' +    
		' FROM users ' +
		' WHERE users.nickname = ANY ($1) ';
		
		var query7 = "SELECT" +  
		' users.disconnected AS "disconnectedAt", users.connectedwith AS "connectedWith"' +    
		' FROM users ' +
		' WHERE users.nickname = $1 ';
		
		var query8 = "SELECT" +  
		' users.nickname, encode(users.imageprofile, \'escape\') AS "imageProfile", users.status, users.connected AS "connectedAt", users.lastconnected AS "lastConnectedAt",' + 
		' users.disconnected AS "disconnectedAt", users.blacklistauthor AS "blacklistAuthor", users.notseenmessages AS "notSeenMessagesNumber", users.connectedwith AS "connectedWith"' +    
		' FROM users ' +
		' WHERE users.nickname = ANY ($1) ';
		
		
		var query9 = "SELECT" +  
		' count(*) AS "nb", nickname' +
        ' FROM users ' +
		' WHERE users.nickname = ANY ($1) ' +
		' GROUP BY nickname ';
		
		
		//console.log('*******query1 = ' + query1);
		//console.log('*******query6 = ' + query6);
		
		let result = {};
		//get disconnect time of target user who receive not seen messages
		let disconnectTime         = await executeQuery_(pool, query22, [nickname], release);  
		
		console.log('rowCount of disconnectTime = ' + disconnectTime.rowCount);
		
		if (disconnectTime.rowCount == 0)return;
		
		var time_disconnection     = disconnectTime.rows[0].disconnectedAt;
		//time_disconnection       = 1657664183381; // test
		console.log('disconnect time $nickname = ' +  disconnectTime.rows[0].nickname + ' disconnectTime = ' + time_disconnection);
		
		
		//get all not seen messages. 
		let notSeenMessages = await executeQuery(connection, query1, [nickname]); 
		console.log('notSeenMessages.rowCount = ' + notSeenMessages.rowCount);
		for(var i in notSeenMessages.rows){
			console.log('notSeenMessages.rows[' + i + '] = ' + notSeenMessages.rows[i].fromNickname + ' time = ' + notSeenMessages.rows[i].time);
		}
		
		//get all not seen messages after disconnect
		let notSeenMessagesAfterDisconnect = await executeQuery(connection, query10, [nickname, time_disconnection]); 
		console.log('notSeenMessagesAfterDisconnect.rowCount = ' + notSeenMessagesAfterDisconnect.rowCount);
		for(var i in notSeenMessagesAfterDisconnect.rows){
			console.log('notSeenMessagesAfterDisconnect.rows[' + i + '] = ' + notSeenMessagesAfterDisconnect.rows[i].fromNickname + ' time = ' + notSeenMessagesAfterDisconnect.rows[i].time);
		}
		
		
		//The same as 'query1' plus count messages for each author
		let notSeenMessagess = await executeQuery(connection, query11, [nickname]); 
		console.log('count notSeenMessages.rowCount = ' + notSeenMessagess.rowCount);
		//console.log('count notSeenMessages.rows = ' + notSeenMessagess.rows);
		for(var i in notSeenMessagess.rows){
			console.log('count notSeenMessages.rows[' + i + '] = ' + notSeenMessagess.rows[i].nbMessages + ' toNickname = ' + notSeenMessagess.rows[i].toNickname + 
			' fromNickname = ' + notSeenMessagess.rows[i].fromNickname + ' message = ' + notSeenMessagess.rows[i].message + ' time = ' + notSeenMessagess.rows[i].time);
		}
		
		
		result["lastContacts"]    = null;
		//let lastContacts        = await executeQuery_(pool, query5, [nickname], release); //last users who send messages 
		let lastContacts          = await executeQuery(pool, query5, [nickname]); //last users who send messages 
		result["lastContacts"]    = lastContacts.rows;
		
		//console.log('lastContacts) = ' + lastContacts.rowCount);
		//console.log('*** Object.keys(lastContacts) = ' + Object.keys(lastContacts));
		//console.log('lastContacts.rows = ' + lastContacts.rows);
		//console.log('*** Object.keys(lastContacts.rows) = ' + Object.keys(lastContacts.rows));
		//console.log('*** JSON.stringify(lastContacts.rows)) = ' + JSON.stringify(lastContacts.rows));
		//console.log('*** lastContacts.rows[0] = ' + lastContacts.rows[0]);
		//console.log('*** lastContacts.rows[0]["connectedWith"] = ' + lastContacts.rows[0]["connectedWith"]);
		//console.log('*** Object.keys(lastContacts.rows[0]["connectedWith"]) = ' + Object.keys(lastContacts.rows[0]["connectedWith"]));
		//console.log('*** Object.keys(lastContacts.rows[0]["connectedWith"]) = ' + typeof JSON.stringify(lastContacts.rows[0]["connectedWith"]));
		//console.log('*** Object.keys(lastContacts.rows[0]["connectedWith"]) = ' + typeof Object.keys(lastContacts.rows[0]["connectedWith"]));
		//console.log('*** lastContacts.rows[0]["connectedWith"]["bis"] = ' + lastContacts.rows[0]["connectedWith"]["bis"]);
		
		//Create an array filled witn last users name.
		var last_users = [];
		for(let key of Object.keys(lastContacts.rows[0]["connectedWith"])){
			//console.log('key = ' + key);
			last_users.push(key);
		}
		
		for(var user_ in last_users){    
			//console.log('last_users_array = ' + last_users[user_]);
		}
		
		result["lastUsers"]    = null;
		//let lastUsers        = await executeQuery_(pool, query6, [last_users], release); //last users who send messages 
		let lastUsers          = await executeQuery(pool, query6, [last_users]); //last users who send messages 
		result["lastUsers"]    = lastUsers.rows;
		//console.log('lastUsers = ' + lastUsers.rowCount);
		
		//console.log('lastUsers.rows[0] = ' + lastUsers.rows[0].nickname + ' status = ' + lastUsers.rows[0].status);
		
		
		//Other way to find the users who send message after deconnection
		result["lastUsers_"]    = null;
		let lastUsers_          = await executeQuery(pool, query7, [nickname]); //users who send messages after deconnection
		
		//result["lastUsers_"]    = lastUsers_.rows;
		//console.log('lastUsers_ = ' + lastUsers_.rowCount);
		
		var disconnectedAt  = lastUsers_.rows[0].disconnectedAt;
		var connectedWith	= lastUsers_.rows[0].connectedWith;
		//console.log('disconnectedAt) = ' + disconnectedAt + ' connectedWith = ' + connectedWith);
		
		
		//Create an array filled witn the users who send messages after disconnection.
		//Knowing the keys of the with : 'Object.keys(json))', we can find the value with : 'json[key]'
		var after_diconnection_users = [];
		for(let key of Object.keys(lastUsers_.rows[0].connectedWith)){
			//console.log('key = ' + key + ' value = ' + lastUsers_.rows[0].connectedWith[key]);
			if(lastUsers_.rows[0].connectedWith[key] >= disconnectedAt)after_diconnection_users.push(key);
		}
		
		
		for(let i in after_diconnection_users){
			//console.log('after disconnectionuser = ' + after_diconnection_users[i]);
		}
		
		result["users_after_disconnect"]    = null;
		let users_after_disconnect          = await executeQuery(pool, query6, [after_diconnection_users]); //users who send messages after disconnect
		result["users_after_disconnect"]    = users_after_disconnect.rows;
		//console.log('users_after_disconnect = ' + users_after_disconnect.rowCount);
		
		//is there a new user not registered yet and who has sent a message. First step, get the registered users
		result["registered_users"]    = null;
		let registered_users          = await executeQuery(pool, query9, [users_after_disconnect.rows]); //users already registerd
		result["registered_users"]    = registered_users.rows;
		//console.log('registered_users = ' + registered_users.rowCount);
		
		//second step, compare the array 'registered_users' with 'users_after_disconnect'
		result["not_registered_users"]    = null;
		var not_registered_users = []
		for(let user in users_after_disconnect.rows){
			//console.log('not_registered_users user = ' + user + ' (user in registered_usersr) = ' + user in registered_usersr);
			if(!user in registered_users)not_registered_user.push(user)
		}
		for(let i in not_registered_users){
			//console.log('not_registered_users = ' + not_registered_users[i]);
		}
		
		result["not_registered_users"] = not_registered_users;
		
		if(notSeenMessages.rowCount == 0) {
			//release(); //there is error here "Error: Release called on client which has already been released to the pool.d:"
		}
		
		//console.log('notSeenMessages = ' + notSeenMessages.rowCount);
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		if (notSeenMessages.rowCount > 0) {
			//Get all users in column 'connectedwith' of users table
			let allContactUsers = await executeQuery(pool, query5, [nickname]); 
			if (allContactUsers.rowCount > 0) console.log('allContactUsers = ' + allContactUsers.rowCount);
			for( row in allContactUsers.rows){
				var connectedWith 		   = allContactUsers.rows[row].connectedWith;
				console.log('allContactUsers : connectedWith = ' + connectedWith);
			}
			
			
			//Get all users whom send not seen messages
			let notSeenMessagesAuthors = await executeQuery(pool, query12, [nickname]); 
			if (notSeenMessagesAuthors.rowCount > 0) console.log('notSeenMessagesAuthors = ' + notSeenMessagesAuthors.rowCount);
			for( row in notSeenMessagesAuthors.rows){
				var nb 		   = notSeenMessagesAuthors.rows[row].nbMessages;
				var name       = notSeenMessagesAuthors.rows[row].nickname;
				console.log('notSeenMessagesAuthors : nickname = ' + name + '\t' + ' nbMessages = ' + nb);
			}
			
			
			//Get all users whom send not seen messages after disconnect time
			let notSeenMessagesAuthorsAfterDisconnection = await executeQuery(pool, query2, [nickname, time_disconnection]); //time_disconnection]); //1657664183381
			if (notSeenMessagesAuthorsAfterDisconnection.rowCount > 0) console.log('notSeenMessagesAuthorsAfterDisconnection = ' + notSeenMessagesAuthorsAfterDisconnection.rowCount);
			
			
			/*
			//Get the not Seen Messages Authors in array
			var notSeenMessagesAuthor_ = [] ;
			for( row in notSeenMessagesAuthors.rows){
				var name 		   = notSeenMessagesAuthors.rows[row].nickname;
				var disconnection  = notSeenMessagesAuthors.rows[row].disconnectedAt;
				var json = {name:disconnection};
				notSeenMessagesAuthor_.push(json);
				console.log('json = ' + json + ' key = ' + Object.keys([json]));
				console.log('nickname = ' + name + ' disconnectedAt = ' + disconnection);
			}
			for(let i in notSeenMessagesAuthor_){
				console.log('registered_users : name = ' + Object.keys(notSeenMessagesAuthor_[i]) + ' disconnection = ' +  notSeenMessagesAuthor_[i].name);
			}
			
			//All the users name in array 'notSeenMessagesAuthor_' are registered ?
			//Send a query to server to see whitch one is registered. No need to send query to the server since all users whom send messages
			//are systematically registered. Perhapsn the users whom send messages after disconnect time may be not registered. Then, get the users whom send messages after
			//disconnect time.
		
			let registered_users          = await executeQuery(pool, query9, [notSeenMessagesAuthor_]); //users already registerd
			console.log('registered_users***** = ' + registered_users.rowCount);
			for(let i in registered_users.rows){
				console.log('registered_users user = ' + registered_users.rows[i].nickname );
			}
			
			//second step, compare the array 'registered_users' with 'users_after_disconnect'
			var not_registered_users = []
			for(let i in notSeenMessagesAuthor_){
				console.log('not_registered_users user = ' + notSeenMessagesAuthor_[i] + ' (user in registered_users) = ' + (notSeenMessagesAuthor_[i] in registered_users.rows));
				if(!notSeenMessagesAuthor_[i] in registered_users.rows)not_registered_users.push(notSeenMessagesAuthor_[i])
			}
			for(let i in not_registered_users){
				console.log('not_registered_users = ' + not_registered_users[i]);
			}
			*/
			
			//if(notSeenMessages.rowCount == 0) console.log('*************error : notSeenMessages rows is null and  messages is not null. it is not accepted ********');
			
			result["notSeenMessages"] 		 					= notSeenMessages.rows;
			result["notSeenMessagesAfterDisconnect"]    		= notSeenMessagesAfterDisconnect.rows;
			result["notSeenMessagesAuthors"] 					= notSeenMessagesAuthors.rows;
			result["allContactUsers"] 							= allContactUsers.rows;
			result["notSeenMessagesAuthorsAfterDisconnection"]  = notSeenMessagesAuthorsAfterDisconnection.rows;
			
			
			//console.log('lastContacts) = ' + lastContacts.rows);
			//console.log('*** Object.keys(lastContacts) = ' + Object.keys(lastContacts));
			
			//send the result to client
		    //io.to(socket.id).emit('get_all_not_seen_messages_res', result);	
			
		} else {
			/*
			console.log({
				status: false,
				message: "Messages are not not found for : " + nickname,
			})
			*/
			result["notSeenMessages"] 		 = null;
			result["notSeenMessagesAuthorsAfterDisconnection"] = null;
			//result["lastContacts"]         = null;

			//io.to(socket.id).emit('get_all_not_seen_messages_res', null);
		}
		//console.log('get_all_not_seen_messages_res : result = ' + result + ' socket.id = ' + socket.id);
		//console.log('result["lastContacts"] = ' + result["lastContacts"]);
		io.to(socket.id).emit('get_all_not_seen_messages_res', result);
    });

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
    }
 });
   
///////////////////////////////////////////////////////////////////////////////////////////////////////
   socket.on('get_all_not_seen_messages__', function(nickname){	
		//console.log('get_all_not_seen_messages, nickname : %s ', nickname);
		
		var query = "SELECT" + 
	" messages.fromnickname, count(messages.fromnickname) AS nb, users.imageprofile" + 
	" FROM messages " +
	" LEFT JOIN users " +
	" ON messages.fromnickname = users.nickname " + 
	" WHERE messages.tonickname = $1" + 
	" AND messages.seen = cast(0 AS bit(1))" +
	" GROUP BY messages.fromnickname, users.imageprofile";
	
	//console.log('query = ' + query);
	 
	 pool.query(query, [nickname], async(error, results) => { 
		  
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
				  /*
				  console.log(
							' *fromnickname = ' + results.rows[i].fromnickname + 
							' *nb = '           + results.rows[i].nb           + 
							' *imageprofile = ' + results.rows[i].imageprofile + "\n" 
				  );
				  */
			  }  
		  }	
		  
		  //send the result to client
		  io.to(socket.id).emit('get_all_not_seen_messages_res', results.rows);	
		  
		}).catch((error) =>{
			console.log("************get_all_not_seen_messages_res, promise 'SELECT ref ... from messages' " + error.message);
			io.to(socket.id).emit('get_all_not_seen_messages_res', []);			
		});
	 });//end pool
		
   });
   
   ///////////////////////////////////////////////////////////////////////////////////////////////////
   //Get all not seen messages for the user 'nickname'. 2 select querries method
    socket.on('get_all_not_seen_messages_', function(nickname){	
	console.log('get_all_not_seen_messages, nickname : %s ', nickname);
	//var query  = "SELECT ref, fromnickname, tonickname, message, time, extra, extraname, mime, seen, deletedfrom, deletedto FROM messages"; // WHERE" + 
	var query1  = "select fromnickname, count(fromnickname) AS nb from messages where tonickname = $1 AND seen = $2 group by fromnickname";
	 
	console.log('query1 = ' + query1);
	 
	 	 pool.query(query1, [nickname, 0], async(error1, results1) => { 
		  
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
			console.log('*** error  in get_all_not_seen_messages ****' + error1);
		  }
		  
		  //console.log('*************************************************************************************')
		  
		  /////////////////////////////////////////////
		  for(let row of results1.rows){
				//console.log('fromnickname = ' + row.fromnickname + ' nb = ' + row.nb);
		  }
			
		  var users = [];
		  for(let x of results1.rows){
			users.push(x.fromnickname);
		  }
		  
		  //for test only, to remove after
		  //users.push('mono');
		  
		   for(var i = 0; i <= users.length - 1; i++){
			 //console.log('y = ' + users[i] + '\n');
		   }
		   
		    /*
		   var params = [];
		   for(var i = 1; i <= yy.length; i++) {
			 params.push('$' + i);
		   }
		   
		   //concatenate all parts of the array separated by ','    
		  var param = params.join(',')
			*/
			
			async function displayContent() { //must use 'async function' to use 'await pool.query(query2, [user])' below.
				try{
					
					var promiseArray = [];
					
					//for (let i = 0; i <= y.length - 1; i++){ 
					  var query2  = "select imageprofile from users where nickname = $1" ;    // IN ($1) ne marche pas  // //(" + param + ")"; // = $1";
					  
					  for(let user of users){
						  var promise = await pool.query(query2, [user]);
						  promiseArray.push(promise);
					  }
					
					//let results = Promise.all(promiseArray).then((results) => {
					//	//console.log(results);
					//}).catch((error)=> {console.log(error);})
					//console.log('results ' + results);
					
					var copy = [];
					await Promise.all([promiseArray]).then((arrList)=>{
					  arrList.forEach(item =>{ 
						  //console.log(item);
						  copy.push(item);
					  });
					  
					  //console.log('in Promise.all  copy.length ' + copy[0][4].rowCount);
					}).catch(reason => {
						console.log("Promise.all error " + reason);
					});
					
					//the following statement give a correct value because there is 'await Promise.all'
					console.log('out Promise.all  copy.length ' + copy.length);
					
					return new Promise((resolve, reject) => {
					  setTimeout(() => {
						if(copy == null)reject(new Error('fail'));
						resolve(copy);
					  }, 300);
					});
					
				}catch(error){
					console.log("displayContent : " + error.message);
				}
			};//end displayContent
			
			displayContent();
			
			async function app() {
				var row2 = await displayContent().then((result) =>{  //wait the return of 'new Promise' inside 'displayContent'. 
					//console.log("result = " + result);
					
					//resumé
					var result_ = [];
					//console.log("results1.rows " + results1.rows.length + " results1.rows[0] = " + results1.rows[0].fromnickname); //Object.keys(results1.rows[0]));
					
					
					for(let i = 0; i <= results1.rows.length - 1; i++){//'result1' est associé à 'query1' = 'select fromnickname, count(fromnickname)'
						var temp ={};
					
						temp["fromnickname"] = results1.rows[i].fromnickname;
						temp["nb"] = results1.rows[i].nb;
						//'result' attend le retour de tous les 'results' associé à 'query2'= 'SELECT imageprofile'
						
						temp["imageprofile"] = (result[0][i].rows[0] == null) ? null : result[0][i].rows[0].imageprofile;
						//temp["imageprofile"] = (result[0][i].imageprofile == null) ? null : result[0][i].imageprofile;
						
						result_.push(temp);
					}
					
					//console.log("result_ " + result_.length); 
					for(let row of result_){
						//console.log('fromnickname = ' + row.fromnickname + ' nb = ' + row.nb + ' imageprofile = ' + row.imageprofile);
					}
					
					//send back the result to android client
					io.to(socket.id).emit('get_all_not_seen_messages_res', result_);
				
				}).catch((error) =>{
					console.log("get_all_not_seen_messages_res, promise 'SELECT ref ... from messages' " + error.message);
					io.to(socket.id).emit('get_all_not_seen_messages_res', []);			
				}); 
			}
			app();
			
		  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		  
		  
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
			console.log("get_all_not_seen_messages_res, promise 'SELECT ref ... from messages' " + error1.message);
			//io.to(socket.id).emit('get_all_not_seen_messages_res', []);			
		});
	});//end pool

   }); //end socket.on('get_all_not_seen_messages'
   
   
   //get not seen messages sent by 'selectedNickname' to 'currentNickname'.
   socket.on('get_not_seen_messages', function(selectedNickname, currentNickname, idCurrentNickname){	
	 //console.log('get_not_seen_messages :  selectedNickname : %s, currentNickname = %s, idCurrentNickname = %s', selectedNickname, currentNickname, idCurrentNickname);
	 //var query  = "SELECT ref, fromnickname, tonickname, message, time, extra, extraname, mime, seen, deletedfrom, deletedto FROM messages"; // WHERE" + 
	 var query  = "SELECT * FROM messages WHERE" + 
					"(fromnickname = $1 AND  tonickname = $2 AND seen = $3) OR" + 
					"(fromnickname = $2 AND  tonickname = $1 AND seen = $3)";
	 
	 //console.log('query = ' + query);
	 
	 pool.query(query, [currentNickname ,selectedNickname, 0], async(error, results) => {  
	
	const promise = new Promise((resolve, reject) => {
		resolve(results);
	});
		//if(error)(reject("promise error "+error)); 
		let res = await promise;
		promise.then((value) => {
		  //console.log('promise in get_not_seen_messages. value = '+value+' count = '+value.rowCount+' length = '+value.rows.length+' fields length = '+value.fields.length);
		  //console.log('value keys = '+Object.keys(value));
		  //console.log('rowAsArray = '+value.rowAsArray);
		  
		  /*
		  console.log('ref = '+            value.rows[0].ref +
						' fromnickname = '+value.rows[0].fromnickname +
						' tonickname = '+  value.rows[0].tonickname +
						' message = '+     value.rows[0].message +
						' time = '+        value.rows[0].time
		  );
		  */
						 
		  // le nom des champs de la table
		  //console.log('select not_seen_messages ref = '+value.fields[0].name +' fromnickname = '+value.fields[1].name+' tonickname = '+value.fields[2].name);
						
		  if (error) {
			console.log('*** error  in get_not_seen_messages ****'+error);
		  }
		  
		  //console.log('*************************************************************************************')
		  
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
		  
		  //send result to android client
		  io.to(socket.id).emit('get_not_seen_messages_res', json);
		}).catch((error) =>{
			console.log("not_seen_messages, promise 'SELECT ref ... from messages' " + error.message); 
			io.to(socket.id).emit('get_not_seen_messages_res', []);
		});
	});
	 
   }); //end socket.on('get_not_seen_messages'
   
	var Files = {};  
	var index = 0;
	var ref   = ""
	var owner = "";
	var time  = 0; //long time
	var mime  = "";
	
	socket.on('uploadFileStart', function (data) { //'data' contains the json array of attachment that we passed through socket.emit.
		//data = {"Ref" : reference, "Owner" : fromNickname "Name" : filename, "Time" : timeLong, "Size" : length}; 
		//console.log('uploadFileStart : ref = %s, owner = %s, filename = %s, time = %d, size = %d', data[0]['Ref'], data[0]['Owner'], data[0]['Name'], data[0]['Time'], data[0]['Size']);
        console.log('uploadFileStart ####### json array data = ' + data + ' length = ' + data.length);
		for (i in data) {
			//console.log('uploadFileStart boucle for : owner = %s, filename = %s, size = %d', data[i]['Owner'], data[i]['Name'], data[i]['Size']);
		
			//var uriPath  = data[i]['Uri'];
			ref 		 = data[i]['Ref'];
			owner        = data[i]['Owner'];
			time		 = data[i]['Time'];
			var fileName = data[i]['Name'];
			var fileSize = data[i]['Size'];
			mime 		 = data[i]['Mime'];
			
			var Place    = 0;
			
			var uploadFilePath = 'Temp/' + fileName;

			//console.log('uploadFileStart # Uploading file: %s to %s. Complete file size: %d', fileName, uploadFilePath, fileSize);

			Files[fileName] = {  //Create a new Entry in The Files Variable. It is a json
				FileSize    : fileSize,
				Data        : "",
				Downloaded  : 0
			}        
			//console.log("uploadFileStart # Files[fileName]['Downloaded'] = "+Files[fileName]['Downloaded']+" successfully created");
		
			//var fd = fs.openSync(uploadFilePath, "a", 0755);
				//console.log('uploadFileStart # Requesting Place: %d Percent %d, index = %d', Place, 0, index);

				//Files[fileName]['Handler'] = fd; //We store the file handler so we can write to it later
				//console.log('uploadFileStart # Requesting Place: %d Percent %d, index = %d, fd = %d, Files[fileName][Handler] = %s, Name = %s', Place, 0, index, fd, Files[fileName]['Handler'], fileName);
				socket.emit('uploadFileMoreDataReq', {'File' : index, 'Place' : Place, 'Percent' :  0});
				index++; //index de fichier
			
			/*
			//fonction asynchrone à cause du callback 'function(err, fd)'.
			// le retour de cette fonction n'est pas chronologique.
			//par exemple plus bas : 'Files[fileName]['Handler'] = fd;'
			//Dans une boucle 'for', à la dernière valeur de 'filename', à la fin de la boucle est associé 'fd' et toutes les valeurs d'avant ont 'fd=indefini'
			//
			fs.open(uploadFilePath, "a", 0755, function(err, fd){ 	//'a': Open file for appending. The file is created if it does not exist.
																	//'ax': Like 'a' but fails if the path exists.
				if(err) {
					console.log("error overrwriting the file "+err);
				}
				else {
					console.log('uploadFileStart # Requesting Place: %d Percent %d, index = %d', Place, 0, index);

					Files[fileName]['Handler'] = fd; //We store the file handler so we can write to it later
					console.log('uploadFileStart # Requesting Place: %d Percent %d, index = %d, fd = %d, Files[fileName][Handler] = %s, Name = %s', Place, 0, index, fd, Files[fileName]['Handler'], fileName);
					socket.emit('uploadFileMoreDataReq', {'File' : index, 'Place' : Place, 'Percent' :  0});
					index++;

					// Send webclient upload progress..
				}
			});
			*/
			
		}
    });

	var numberChunks = 0;
	//upload and save attachments
	socket.on('uploadFileChuncks', function (data){
        
		//console.log("uploadFileChuncks # data['Name'] = " + data['Name'] + " data['Data'] = " + data['Data']);
		//console.log("uploadFileChuncks # data['Name'] = " + data['Name']); 
		
		var index    = data['File'];
		var Name     = data['Name']; //Name = filename
		base64Data   = data['Data'];
		playload     = Buffer.from(base64Data, 'base64').toString('binary');
		
        //console.log('uploadFileChuncks # Got name : %s, received chunk size : %d.', Name, playload.length);
        
		Files[Name]['Downloaded'] += playload.length;
        Files[Name]['Data'] += playload;  
        numberChunks++;		
        
		//console.log('********* downloaded = %d, size = %d, handler = %s *************', Files[Name]['Downloaded'], Files[Name]['FileSize'],Files[Name]['Handler'] + ' numberChunks = ' + numberChunks  );
		
        if(Files[Name]['Downloaded'] == Files[Name]['FileSize']){ //File is Fully Uploaded
            console.log('uploadFileChuncks complete');
            //console.log('uploadFileChuncks # File %s receive completed. handler = %s', Name, Files[Name]['Handler']);
			
			// Notify android client the upload is complete and saved ind database.
            //socket.emit('uploadFileComplete', { 'IsSuccess' : true })
			
			//Save the uploaded file in system file
            /*
			fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function(err, Writen){
               // close the file
               fs.close(Files[Name]['Handler'], function() {
                  console.log('file closed');
               });

                // Notify android client the upload is complete.
                socket.emit('uploadFileComplete', { 'IsSuccess' : true });

                // Send user the remaining part.
				//console.log('downloadFileComplete playload sent to client : ', base64Data);
				socket.emit('downloadFileComplete', { 'Name' : Name, 'Data' : base64Data});
                
            });
			*/
			i = 0; 	//indice de boucle. raz.
			
			//console.log('****************************   write to database pool***************************************');
			///////////////////////////////////////////////////////////////////////////////////////////////////////////
			const dateposted = Date.now();
			
			//Save the file uploaded in system file
			//fs.readFile('Temp/media2.mp4', null, (err, imgData) => {
				//console.log('*************************************************************************************');
				//console.log('avant imgData : ',imgData);
				//imgData = '\\x' + imgData;
				//console.log('*************************************************************************************');
				//console.log('après imgData : ',imgData);
				//console.log('*************************************************************************************');
				
				//if(err)console.log('error reading file');
				//console.log(imgData);
			//});
			
			//Save the uploaded file in database
			//var query = "INSERT INTO images (name, filedata, owner,  dateposted) VALUES($1, $2, $3, $4)";
			//var query = "UPDATE products SET pr_title = ($1), pr_usercode = ($2) WHERE pr_id=($3)";
			var dataa  = Files[Name]['Data']; //pb encodage utf8 when inserted in db
			
			//var fileInfo = languageEncoding(Files[Name]['Data']);
			//var fileInfo = languageEncoding.detect(dataa);
			//console.log('file info = %s', fileInfo);
			
			//console.log('avant entrée db = %s, size = %d, data = %s', Name, Files[Name]['FileSize'],Files[Name]['Data'] ); 
			
			//Redirect console output to './Temp/log.jpg' file.
			//const myConsole = new console.Console(fs.createWriteStream('./Temp/log.jpg', 'binary'));
			//myConsole.log(Files[Name]['Data']);
			
			//fs.close(fd1, function() {
			//  console.log('file %s closed', fd1);
			//});
				
				//console.log('******************************* data uploadeded ****************************************************');
				
				
				//Pour insérer les data dans un fichier, utiliser l'instruction suivante :
				//var dataa = Buffer.from(Files[Name]['Data'], 'binary');
				
				//Pour insérer les data dans une bd, utiliser l'instruction suivante :
				//dataa = new Buffer(dataa, 'binary').toString('base64');
				var dataa = Buffer.from(Files[Name]['Data'], 'binary').toString('base64');
				
				
				//new Buffer(dataa, 'binary').toString('base64');
				
				//console.log('name = %s, \nsize = %d, \nFiles[Name][Data] = %s, \ndataa = %s', Name, dataa.length, Files[Name]['Data'], dataa); 
				
				//console.log('*************************************************************************************');
				
				//var buffer = new Buffer(Files[Name]['FileSize']);
				// read its contents into buffer	
				//var data   = buffer.toString("hex", 0, buffer.length);	//binary
				//console.log('name = %s, size = %d, data buffer = %s', Name, data.length, data); 
				
				//console.log('*** INSERT in images **********************************************************************************');
				
				
				//var query  = "UPDATE images SET filedata = ($1) WHERE id=($2)";
				//owner = messageFrom
				
				//console.log('INSERT into images. name.length = %d, Name = %s', Name.length, Name);
				
				var query  = "INSERT into images (ref, name, owner, filedata, time) VALUES ($1, $2, $3, $4, $5)"; //The id is automatically added if it is auto increment
				
				//pool.query(query, [dataa, 5], (error, results) => {  //UPDATE //$1=data, $2=5 (row id =5).
				pool.query(query, [ref, Name, owner, dataa, time], async(error, results) => {  //INSERT //$1=data, $2=5 (row id =5).
					const promise = new Promise((resolve, reject) => {
						resolve(results);
					});
					//if(error)(reject("promise error "+error)); 
					let res = await promise;
					promise.then((value) => {
					  //console.log('promise then INSERT into images. value = '+value);
					  //console.log('promise then INSERT into images. value = '+value+' rowCount = '+value.rowCount);
					  //var datab = value.rows[0].filedata
					  
					  // Notify android client the upload is complete and saved ind database.
					  socket.emit('uploadFileComplete', { 'IsSuccess' : true })
					  console.log('attachment succesfully uploaded and saved');
					  
					  if (error) {
						console.log('*** error saving attachments  insert into images ****' + error);
						// Notify android client the upload is complete and saved ind database.
					    socket.emit('uploadFileComplete', { 'IsSuccess' : false })
					  }
					  //console.log('*************************************************************************************')
					  //console.log('INSERT into images rowCount : %s', value.rowCount);
					  //console.log('*************************************************************************************')
					});
					
					
				});
				
			//* get it back from bd and save it in file system
			
			//var query = "SELECT id, name, owner, filedata FROM images  WHERE id=($1)";
			
		
			//var fd1 = fs.openSync('Temp/attachment.jpg', "w");	//'w': Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
			/*
			pool.query(query, [ref], (error, results) => {
				if (error) {
					//throw error
					console.log('error in SELECT id, name, owner, filedata FROM images  WHERE id=dollar[1] '+error);
				}
				var data  = results.rows[0].filedata;
				var owner = results.rows[0].owner;
				var id    = results.rows[0].id;
				var name  = results.rows[0].name;
				
				console.log('result select : id = %d, name = %s, owner = %s, data.length= %d', id, name, owner, data.length);
				
				console.log('*************************************************************************************');
				
				//console.log('sortie db name = %s, size = %d, data = %s', name, data.length, data ); 
				
				data = Buffer.from(data, 'utf8');
				console.log('apres buffer vers utf8 size = %d', data.length ); 
				
				//To have an output in file
				const myConsole1 = new console.Console(fs.createWriteStream('./Temp/sortie-db.jpg', 'binary'));
				myConsole1.log(data); //The output is redirected in file './Temp/sortie-db.jpg'
				
				console.log('*************************************************************************************');
				
				fs.write(fd1, data, null, 'hex', function(err, Writen){ 	//fs.write(fd, buffer[, offset[, length[, position]]], callback) OR 
																			//fs.write(fd, string[, position[, encoding]], callback)
					// close the file
					fs.close(fd1, function() {
						console.log('file %s closed', fd1);
					});
				
					//fs.writeFile('/Temp/foo.jpg', data, 'hex', function(err, writen){ //'Binary'
					if(err)console.log('error writing');
					console.log('*************************************************************************************')
					console.log('writing in file.');
					console.log('*************************************************************************************')
				});
				
			});
			*/
			//console.log('data to write in file : '+data);
			
			
			/* get it back
			app.get('/url/to/get/', function(req, res, next) {
			app.pgClient.query('select image from image_table limit 1',
                     function(err, readResult) {
				console.log('err',err,'pg readResult',readResult);
			fs.writeFile('/tmp/foo.jpg', readResult.rows[0].image);
			res.json(200, {success: true});
			});
			});
			*/
			/*
		   var query = "SELECT * FROM eleves ORDER BY id ASC";
		   pool.query(query, (error, results, fields) => {
			if (error) {
			  //throw error
			  console.log('SELECT * FROM eleves : error '+error);
			}
			fields = results.fields.map(field => field.name);
			
			//table fields list
			var id 			= results.fields[0].name;
			var nom 		= results.fields[1].name;
			var prenom 		= results.fields[2].name;
			var adresse 	= results.fields[3].name;
			var ville 		= results.fields[4].name;
			var codepostal 	= results.fields[5].name;
			var tel 		= results.fields[6].name;
			var idclasses 	= results.fields[7].name;
			
			//console.log("******************* results.fields[0].name : %s, results.fields[1].name : %s ", results.fields[0].name, results.fields[1].name); 
			//console.log("******************* fields : "+fields+" ****************************************"); 
			
			for (i = 0; i < results.rows.length; i++) {
				//console.log('%s %s %s \n', results.rows[i]['nom'], results.rows[i]['prenom'], results.rows[i]['adresse']);
				console.log('%s : %s %s : %s\n', results.fields[0].name, results.rows[i][id], results.fields[1].name, results.rows[i][nom]);
			}
			
		   });
		   //pool.end();
		   */
			///////////////////////////////////////////////////////////////////////////////////
        }
		/*
        else if(Files[Name]['Data'].length > 10485760){ //If the Data Buffer reaches 10MB
            console.log('uploadFileChuncks # Updating file %s with received data', Name);

            fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function(err, Writen){
                Files[Name]['Data'] = ""; //Reset The Buffer
                var Place = Files[Name]['Downloaded'];
                var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;

				console.log('Place = '+Place+' Percent = '+Percent);

                socket.emit('uploadFileMoreDataReq', { 'Place' : Place, 'Percent' :  Percent});
				
                // Send webclient upload progress..
            });
        }
		*/
		
        else { //the file is not fully uploaded, continue uploading.
            var Place = Files[Name]['Downloaded']; 
            var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
            //console.log('uploadFileChuncks # Requesting Place: %d, Percent %s, boucle : %d', Place, Percent, i);
			i++;
			//if(Percent > 101)return;
            socket.emit('uploadFileMoreDataReq', {'File' : index, 'Place' : Place, 'Percent' :  Percent}); //{'Uri' : uriPath, 'Place' : Place, 'Percent' :  0});
            // Send webclient upload progress..
			//console.log('downloadFileMoreData playload sent to client : ', base64Data);
			//socket.emit('downloadFileMoreData', { 'Name' : Name, 'Data' : base64Data, 'Place' : Place, 'Percent' :  Percent});
        }
    });
//////////////////////////////////////////////////////////////////////////////////////////////////////////

	//io.sockets.on('connection', function (socket) {
		//console.log("connection = "+socket);   
	//});
//////////////////////////////////////////////////////////////////////////////////////////////////////////
	var buf       = 0; 		//buffer qui contient les data extrait de la bd
	var size      = 0;  	//size du buffer qui contient les data extrait de la bd.
	var chunkSize = 0; 		//size du chunk transmis lors d'un download.
	var reference_ = "";
	socket.on('start_download', function (reference){
		//console.log("start_download reference = %s, from = %s, to = %s", reference);
			
		//Send data to android client
		var data;
		var data_;
		var data__;
		reference_ = reference;
		
		//Get the image back from db
		var query = "SELECT filedata FROM images  WHERE ref = $1";
		
		console.log("start_download SELECT filedata FROM images  WHERE ref = " + reference);
		
		pool.query(query, [reference], async(error, results) =>{
			const promise = new Promise((resolve, reject) => {
				 resolve(results); //resolve('foo');---> value='foo'
				 console.log('start_download results = ' + results);
			});
			//if(error)(reject("promise error "+error)); 
			let res = await promise;
			promise.then((value) => {
			  //console.log('start_download promise then SELECT filedata rowCount = '+value.rowCount); //+" filedata = "+value.rows[0].filedata.length);
			  var datab = value.rows[0].filedata;
			  
			  buf = Buffer.from(datab);
			  size = buf.length;
			  chunkSize = (size / 100) < 1000 ? size : Math.round(size / 100);
			  //chunkSize = Math.round(size / 100);
			  //if((size / 100) < 1000)chunkSize = size;
			  //console.log('****size = %d, chunkSize = %d', size, chunkSize);
			  
			  //
			  
			  //console.log("************************ from images *******************************************************");
			  //console.log(datab);
			  //console.log("************************ *******************************************************");
										  
			  var json = {"Ref" : reference, "Size" : datab.length, "Data" : datab.toString()};	//json object
				
				  var data ={};
				  data.ref = reference;
				  data.size= value.rows[0].filedata.length;
				  
				  socket.emit('download_chunks', json)
			}).catch((error) =>{
				console.log("start_download promise SELECT filedata FROM images " + error.message); 
			});
		});
	});		
	
	var chunkIndex = 0;
	
	socket.on('downloadFileMoreData', function (chunkStatus){ //chunkStatus = JSON Object
		console.log('downloadFileMoreData : File index = %d, Place = %d, Percent = %s', chunkStatus['File'], chunkStatus['Place'], chunkStatus['Percent']);
		//calculer le chunk à envoyer avec les données : index, ref, data
		console.log('compute the size chunk to send');
		
		//var chunkSize = 2860;
		var start = chunkStatus['Place'];
		var end = start + chunkSize;
		var chunk = buf.slice(start, end);
		//console.log('start = %d, end = %d, chunkSize = %d, start + chunkSize = %d, chunk.length = %d, chunkIndex = %d', start, end, chunkSize, start - chunkSize, chunk.length, chunkIndex);
		
		//var ref = ""; 
		
		var json = {'File' : chunkIndex, 'Ref' : reference_, 'Size' : size, 'Data' : chunk.toString()};
		socket.emit('download_file_chunks', json);	
		chunkIndex++;
	});
	
	socket.on("downloadFileComplete", function (chunkStatus){ //chunkStatus = JSON Object : "{ 'IsSuccess' : true }"
		console.log('downloadFileComplete. status = ' + chunkStatus.IsSuccess);
	});
	
	////////////////////////////////////////////////////////////////////////////////////////////////////////
	//save ban info
	socket.on('ban_info',(banInfo, callback)=>{
		console.log("ban_info : applicationId = %s, startBanTime = %d", banInfo["applicationId"], banInfo["startBanTime"] );
		var applicationId = banInfo["applicationId"];
		var startBanTime  = banInfo["startBanTime"];
		
		var query  = "INSERT INTO ban (packageid, startbantime) VALUES ($1, $2)"; //The id is automatically added if it is auto increment
		
		pool.query(query, [applicationId, startBanTime], async(error, results) =>{
		
			const promise = new Promise((resolve, reject) => {
				 resolve(results); 
			});
			
			//if(error)(reject("promise error "+error)); 
			let res = await promise;
			promise.then((value) => {	// value et result la même chose
			  
			  var ban = {}
			  if(results == null){
				  console.log('promise then INSERT into ban  results = null');
				  callback(null);
				  return;
			  }
			  console.log('promise then INSERT into ban  results = ' + JSON.stringify(results.rowCount));
			  if(results.rowCount == 0 )ban = {"status":"fail"};
			  if(results.rowCount == 1 )ban = {"status":"success"};
			  callback(ban);
			}).catch((error) =>{
				console.log("promise insert into ban " + error.message); 
				callback(null);
			});
		});
	});
	
	
	//get ban info
	socket.on('get_ban_info',(applicationId)=>{
		console.log("get_ban_info : applicationId = %s", applicationId);
		
		const applicationId_ = "com.google.amara.chattab";
		
		//var query  = "SELECT packageid, startbantime FROM ban WHERE packageid = $1"; 
		var query  = "SELECT packageid, startbantime FROM ban"; 
		
		//pool.query(query, [applicationId_], async(error, results) =>{
		pool.query(query, [], async(error, results) =>{
			const promise = new Promise((resolve, reject) => {
				 resolve(results); 
			});
			
			//if(error)(reject("promise error "+error)); 
			let res = await promise;
			promise.then((value) => {	// value et result la même chose
			
			//var ban = {
			//	"packageid": null,
			//	"startbantime": null
			//};
			
			var ban =[
			 {
				"packageid": null,
				"startbantime": null
			 }
			];
			
			console.log(' get_ban_info, results.rowCount = ' + results.rowCount);
			
			
			if(results == null) {
				console.log('promise then SELECT FROM ban  results == null');
				//socket.to(socket.id).emit('get_ban_info_back', ban); //ne marche pas
				io.to(socket.id).emit('get_ban_info_back', null);
				return;
			}
			console.log('promise then SELECT FROM ban  results != null');
			console.log('promise then SELECT FROM ban  results.rowCount = ' + results.rowCount);
			  
			if(results.rowCount != 0)ban = results.rows;
			
			  io.to(socket.id).emit('get_ban_info_back', ban);
			}).catch((error) =>{
				console.log("promise ELECT FROM ban ban " + error.message); 
				socket.to(socket.id).emit('get_ban_info_back', {});
			});
		});
	});
});//end io.on('connection', (socket)
