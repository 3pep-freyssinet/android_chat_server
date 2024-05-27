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
const express = require('express')
//const path = require('path')
const PORT = process.env.PORT || 5000
http   = require('http'),
app    = express(),
server = http.createServer(app),
io     = require('socket.io').listen(server);
const pgsqldb  = require('./queries')
const fs       = require("fs");
const url      = require('url');
const utf8     = require('utf8');
const crypto   = require('crypto');



//const { Pool } = require('pg');

/*
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
*/
const Pool = require('pg').Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'tomcat14200',
  port: 5432,
  client_encoding: 'utf8',
  //ssl: true,
  //ssl: {
  //  rejectUnauthorized: false
  //},
  max: 20,
  min: 1,
  idleTimeoutMillis: 1000,
})

////////////////////////////////////////////////////////////////////////////////////////////
// Dans le navigateur les commandes sont les suivantes: localhost:3000/users, localhost:3000/users/:id=1; ...
app.get('/users', pgsqldb.getUsers)
app.get('/users/:id', pgsqldb.getUserById)
app.post('/users', pgsqldb.createUser)
app.put('/users/:id', pgsqldb.updateUser)
app.delete('/users/:id', pgsqldb.deleteUser)

////////////////////////////////////////////////////////


app
  .get('/', (req, res) => {
	res.send('Hello World from express listening on '+PORT)
	
  })
  .get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM eleves WHERE id=1');
	  
      const results = { 'results': (result) ? result.rows : null};
	  var obj  = JSON.stringify(results);	//--->{"results":[{"id":1,"name":"hello database"}]}
	  //var obj_ = JSON.parse(obj);
																				// Simple quote is same as double quote
	  console.log(" results obj = "+results);									//[object Object] --> {"results":[{"id":1,"name":"hello database"}]}
	  console.log("obj['results'] = "+results["results"]);						//[object Object] --> [{"id":1,"name":"hello database"}]
	  console.log("obj['results'][0] = "+results["results"][0]);				//[object Object] --> {"id":1,"name":"hello database"}
	  console.log("obj['results'][0]['id'] = "+results["results"][0]["id"]);	// 1
	  
	  ou
	  
	  console.log("results.results[0].id = "+results.results[0].id);			// même chose que ci-dessus.
				  
	  res.send("id = "+results["results"][0]["id"]);
	  
	  //res.send("results obj = "+obj);	
	  //res.send("obj.['results'] = "+obj['results']);	
	  //res.send("obj.results id = "+obj.results);
	  
	  
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  server.listen(PORT, () => console.log(`Listening on ${ PORT }`))
  //server.listen(process.env.PORT || 5000, () => console.log(`Listening on ${ PORT }`))
  
  //app.get('/', (req, res) => {
//  res.send('Hello World from express!')
//})

var myMap = new Map();
var n = 0;
var i = 0;			//indice de boucle dans chunks
var people = {};	//id
var profile ={};	//profile image

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

	console.log('user connected')
	//nb userss connected
	n++;

	//socket.on
	socket.on('join', function(userNickname, imageProfile) {
		
		socket.username = userNickname;
        console.log(socket.username +" : has joined the chat. id = "+ socket.id+" image profile = "+imageProfile);
		
		//Store the nickname and id
		people[userNickname] =  socket.id;

		//Store the image profile of the nickname
		profile[userNickname] =  imageProfile;
		
		//Add to object 'profile' a new object ' imageProfile' 
		const returnedTarget = Object.assign(profile, imageProfile); //(target, source); return target. 
		//So in the precedent statement 'returnedTarget' is the same 'profile'. We can verify this : there are the same keys.
		//console.log("key = "+Object.keys(profile));
		//console.log("key = "+Object.keys(returnedTarget));
		
		//store the user in map
		myMap.set(userNickname, socket.id);
		
		//Send a message to all users except the sender.
		//if we want to send the message to all users including the sender we just have to use io.emit() instead of socket.emit().
        //socket.broadcast.emit('userjoinedthechat', userNickname, socket.id, imageProfile); //ca marche
		//socket.emit('userjoinedthechat', userNickname, socket.id, imageProfile); //to sender
		io.emit('userjoinedthechat', userNickname, socket.id, imageProfile);//to all
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
    });

	// last user joined.
	// send to =(nickname, id). send from = (nickname_, id_)
	//Send to nickname with id some information from nickname_ with id_.
	socket.on('lastuserjoined', function(nickname, id, nickname_, id_, profile_) {
		console.log("last user : "+nickname+" id :"+id);
		//io.sockets.socket(id).emit(" hello "+nickname);
		//io.sockets.connected[id].emit("lastuserjoinedthechat", "Thanks");
		socket.broadcast.to(id).emit("lastuserjoinedthechat", nickname_, id_, profile_);
	});

	//get user from database
	socket.on('user', (fromNickname, toNickname, toNicknameId, message, time) => {
       
		//log the message in console 

		console.log("get user : "+fromNickname+" to  : "+toNickname+" toId : "+toNicknameId+" json message : "+message+" time : "+time);
   
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
	   console.log("message sent to  : "+toNickname+" json message = "+message)
	   */
  });


	//Send message to user.
	socket.on('messagedetection', (toNicknameId, message) => { //message is string object
       
       //log the message in console 
	   //const obj = JSON.stringify(message);
	   //console.log('obj = '+obj);
	   
	   //Conversion string -> JSON
	   const obj1 = JSON.parse(message);
	   //console.log('obj1 = '+obj1);
	   
	   //console.log('obj.ref = %s, obj1.ref = %s', obj.ref, obj1.ref);
	   
		var ref_ 			= obj1.ref; 
		var fromNickname_ 	= obj1.fromNickname;
		var toNickname_ 	= obj1.toNickname;
		var messageContent  = obj1.message;
		var time_ 			= obj1.time;
		var extra_			= obj1.extra;
		var extraName_		= obj1.extraName;
		
		//console.log("message arrived ref = "+ref_);
		
		/*
       console.log("message arrived ref = "+ref_+
				"\nfrom : "		+ fromNickname_+
				"\nto  : "		+ toNickname_+
				"\ntoId : "		+ toNicknameId+
				"\nmessage : " 	+ messageContent+
				"\ntime : " 	+ time_+
				"\nextraName = " + extraName_+
				"\nextra = " 	+ extra_);
        */
		
	   //create a message object 
       //let  message = {"message":messageContent, "fromNickname":fromNickname, "toNickname":toNickname,"time":time}
          // send the message to the client side  
       //io.emit('message', message );
       io.to(toNicknameId).emit('message', obj1 );
	   //socket.broadcast.to(toNicknameId).emit('message', message );
	   //console.log("message sent to  : "+toNickname_+" json object message = "+message)
	   
	   //Save the arrived message in db 
	   var query  = "INSERT into messages (ref, fromnickname, tonickname, message, time, extra, extraname) VALUES ($1, $2, $3, $4, $5, $6, $7)"; //The id is automatically added if it is auto increment
					
		pool.query(query, [ref_, fromNickname_, toNickname_, messageContent, time_, extra_, extraName_], (error, results) => {  //INSERT //$1=data, $2=5 (row id =5).
			if (error) {
				console.log('*** error  insert messges ****'+error);
			}
			console.log('*************************************************************************************')
			console.log('INSERT into messages results.rows : %s', results.rows);
			console.log('*************************************************************************************')
		});
	   
    });
      
	  
	//The user disconnect
	socket.on('disconnect__', function(nickname) {
		console.log(nickname+" user has left ");
		socket.broadcast.emit('user disconnect', nickname);
	})
	
	//The user disconnect
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
		delete people[nickname];
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
	
	//the user standby
	socket.on('standby', function(nickname){	
	 console.log(nickname+" standby ");
	 
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
    console.log( nickname + " "+socket.id + ' is standby ');
	
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
		 console.log(key.value); //the value --> key
		 if(myMap.get(key.value) == socket.id){
			 nickname = key.value;
			 console.log( 'Matching : nickname = ' + nickname);
		 }
		 key = keys.next();		 //next key
	}
    console.log( nickname + " "+socket.id + ' is back standby ');
	
	//myMap.delete nickname;
	//console.log("user = "+nickname+" deleted status : "+myMap.delete(nickname));
	
	//the current array
	console.log("people = "+JSON.stringify(people));
	
	//Notify the people the name of the user who is standby
	socket.broadcast.emit("userbackstandby", nickname); 

});
	var Files = {};  
	var index = 0;
	var ref   = ""
	var owner = "";
	var time  = 0; //long time
	socket.on('uploadFileStart', function (data) { //'data' contains the json array of attachment that we passed through socket.emit.
		//data = {"Ref" : reference, "Owner" : fromNickname "Name" : filename, "Time" : timeLong, "Size" : length}; 
		console.log('uploadFileStart : ref = %s, owner = %s, filename = %s, time = %d, size = %d', data[0]['Ref'], data[0]['Owner'], data[0]['Name'], data[0]['Time'], data[0]['Size']);
        console.log('uploadFileStart ####### json array : '+data+' length = '+data.length);
		for (i in data) {
			console.log('uploadFileStart boucle for : owner = %s, filename = %s, size = %d', data[i]['Owner'], data[i]['Name'], data[i]['Size']);
		
			//var uriPath  = data[i]['Uri'];
			ref 		 = data[i]['Ref'];
			owner        = data[i]['Owner'];
			time		 = data[i]['Time'];
			var fileName = data[i]['Name'];
			var fileSize = data[i]['Size'];
			
			var Place    = 0;
			
			var uploadFilePath = 'Temp/' + fileName;

			console.log('uploadFileStart # Uploading file: %s to %s. Complete file size: %d', fileName, uploadFilePath, fileSize);

			Files[fileName] = {  //Create a new Entry in The Files Variable. It is a json
				FileSize    : fileSize,
				Data        : "",
				Downloaded  : 0
			}        
			//console.log("uploadFileStart # Files[fileName]['Downloaded'] = "+Files[fileName]['Downloaded']+" successfully created");
		
			var fd = fs.openSync(uploadFilePath, "a", 0755);
				console.log('uploadFileStart # Requesting Place: %d Percent %d, index = %d', Place, 0, index);

				Files[fileName]['Handler'] = fd; //We store the file handler so we can write to it later
				console.log('uploadFileStart # Requesting Place: %d Percent %d, index = %d, fd = %d, Files[fileName][Handler] = %s, Name = %s', Place, 0, index, fd, Files[fileName]['Handler'], fileName);
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

	socket.on('uploadFileChuncks', function (data){
        
		//console.log("uploadFileChuncks # data['Name'] = "+data['Name']+" data['Data'] = "+data['Data']);
		var index    = data['File'];
		var Name     = data['Name']; //Name = filename
		base64Data   = data['Data'];
		playload     = Buffer.from(base64Data, 'base64').toString('binary');
		
        console.log('uploadFileChuncks # Got name : %s, received chunk size : %d.', Name, playload.length);
        
		Files[Name]['Downloaded'] += playload.length;
        Files[Name]['Data'] += playload;        
        
		console.log('********* downloaded = %d, size = %d, handler = %s *************', Files[Name]['Downloaded'], Files[Name]['FileSize'],Files[Name]['Handler']  );
		
        if(Files[Name]['Downloaded'] == Files[Name]['FileSize']){ //If File is Fully Uploaded
        
            console.log('uploadFileChuncks # File %s receive completed. handler = %s', Name, Files[Name]['Handler']);
			
			//Save the uploaded file in system file
            fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function(err, Writen){
               // close the file
               fs.close(Files[Name]['Handler'], function() {
                  console.log('file closed');
               });

                // Notify android client we are done.
                socket.emit('uploadFileCompleteRes', { 'IsSuccess' : true });

                // Send user the remaining part.
				//console.log('downloadFileComplete playload sent to client : ', base64Data);
				socket.emit('downloadFileComplete', { 'Name' : Name, 'Data' : base64Data});
                
            });
			i = 0; 	//indice de boucle. raz.
			
			console.log('****************************   write to database pool***************************************');
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
			const myConsole = new console.Console(fs.createWriteStream('./Temp/log.jpg', 'binary'));
			myConsole.log(Files[Name]['Data']);
			
			//fs.close(fd1, function() {
			//  console.log('file %s closed', fd1);
			//});
				
				console.log('******************************* data uploadeded ****************************************************');
				
				
				//Pour insérer les data dans un fichier, utiliser l'instruction suivante :
				//var dataa = Buffer.from(Files[Name]['Data'], 'binary');
				
				//Pour insérer les data dans une bd, utiliser l'instruction suivante :
				//dataa = new Buffer(dataa, 'binary').toString('base64');
				var dataa = Buffer.from(Files[Name]['Data'], 'binary').toString('base64');
				//new Buffer(dataa, 'binary').toString('base64');
				
				//console.log('name = %s, \nsize = %d, \nFiles[Name][Data] = %s, \ndataa = %s', Name, dataa.length, Files[Name]['Data'], dataa); 
				
				console.log('*************************************************************************************');
				
				//var buffer = new Buffer(Files[Name]['FileSize']);
				// read its contents into buffer	
				//var data   = buffer.toString("hex", 0, buffer.length);	//binary
				//console.log('name = %s, size = %d, data buffer = %s', Name, data.length, data); 
				
				console.log('*** INSERT in images **********************************************************************************');
				
				
				//var query  = "UPDATE images SET filedata = ($1) WHERE id=($2)";
				//owner = messageFrom
				var query  = "INSERT into images (ref, name, owner, filedata, time) VALUES ($1, $2, $3, $4, $5)"; //The id is automatically added if it is auto increment
				
				//pool.query(query, [dataa, 5], (error, results) => {  //UPDATE //$1=data, $2=5 (row id =5).
				pool.query(query, [ref, Name, owner, dataa, time], async(error, results) => {  //INSERT //$1=data, $2=5 (row id =5).
					const promise = new Promise((resolve, reject) => {
						resolve(results);
					});
					if(error)(reject("promise error "+error)); 
					let res = await promise;
					promise.then((value) => {
					  console.log('promise then INSERT into images rowCount = '+value.rowCount);
					  //var datab = value.rows[0].filedata
					  if (error) {
						console.log('*** error  insert into images ****'+error);
					  }
					  console.log('*************************************************************************************')
					  console.log('INSERT into images rowCount : %s', value.rowCount);
					  console.log('*************************************************************************************')
					});
					
					
				});
				
			//* get it back from bd and save it in file system
			
			var query = "SELECT id, name, owner, filedata FROM images  WHERE id=($1)";
			
		
			var fd1 = fs.openSync('Temp/attachment.jpg', "w");	//'w': Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
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
			
		   var query = "SELECT * FROM eleves ORDER BY id ASC";
		   pool.query(query, (error, results, fields) => {
			if (error) {
			  throw error
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
        else {
            var Place = Files[Name]['Downloaded']; 
            var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
            console.log('uploadFileChuncks # Requesting Place: %d, Percent %s, boucle : %d', Place, Percent, i);
			i++;
			//if(Percent > 101)return;
            socket.emit('uploadFileMoreDataReq', {'File' : index, 'Place' : Place, 'Percent' :  Percent}); //{'Uri' : uriPath, 'Place' : Place, 'Percent' :  0});
            // Send webclient upload progress..
			//console.log('downloadFileMoreData playload sent to client : ', base64Data);
			//socket.emit('downloadFileMoreData', { 'Name' : Name, 'Data' : base64Data, 'Place' : Place, 'Percent' :  Percent});
        }
    });
//////////////////////////////////////////////////////////////////////////////////////////////////////////

	io.sockets.on('connection', function (socket) {
		console.log("connection = "+socket);   
	});
//////////////////////////////////////////////////////////////////////////////////////////////////////////
	var buf;	//buffer qui contient les data extrait de la bd.
	socket.on('start_download', function (reference){
		console.log("start_download reference = %s, from = %s, to = %s", reference, fromNickname, toNickname);
		
		var fromNickname = fromNickname;
		var toNickname   = toNickname;
		
		var fileName  = "Temp/demo.jpg"; //"Temp/acrobat_trial.txt"; //"Temp/Luhn.pdf"; //"Temp/avatar.jpg"; //"Temp/acrobat_trial.txt"; // //"Temp/media2.avi"; // //"Temp/Luhn.pdf"; // //"Temp/media2.mp4"; //
		var fileName_ = "Temp/demo_.jpg"; //"Temp/acrobat_trial_.txt"; //"Temp/Luhn_.pdf";//"Temp/avatar_.jpg"; //"Temp/acrobat_trial_.txt"; // //"Temp/media2_.avi"; // //"Temp/Luhn_.pdf"; // //"Temp/media2_.mp4"; //
		var fileName__ = "Temp/demo__.jpg"; //"Temp/acrobat_trial__.txt"; //"Temp/Luhn__.pdf";//"Temp/avatar__.jpg"; //"Temp/acrobat_trial__.txt";// //"Temp/media2__.avi" // //"Temp/Luhn__.pdf"; //; //"Temp/media2__.mp4"; //
		
		//fd -> filename, fd_ ->fileName_
		//Read from fd (filename) put the result in fd_(filename_)
		
		/*
		var fd_ = fs.openSync(fileName_, "w");
		console.log("The file descriptor is:", fd_);
		
		fs.stat(fileName, function(error, stats) {
			// open the file (getting a file descriptor to it)
			console.log('stats.size = %d', stats.size);
			fs.open(fileName, "r", function(error, fd) {
				var buffer = new Buffer(stats.size);
				// read its contents into buffer
				fs.read(fd, buffer, 0, buffer.length, null, function(error, bytesRead, buffer) {
					var data  = buffer.toString("binary", 0, buffer.length);//binary
					var data_ = buffer.toString('hex', 0, buffer.length);//
					console.log('buffer size : %d,  data binary length = %d, data hex length : %d', stats.size, data.length, data_.length);
					fs.writeFile(fileName_, data, 'binary', function(err) { //The encoding option is ignored if data is a buffer
						// close the file
						fs.close(fd_, function() {
							console.log('file closed');
						});
						if (err) throw err;
					});
					
					var query = "UPDATE images SET filedata = ($1) WHERE id=($2)";
					console.log('data update = %s', data.length);
					pool.query(query, [data_, 5], (error, results) => {
						if (error) {
							throw error
							console.log("error update : "+results.rows);
						}
						console.log("update : "+results.rows);
					});
					
				});
				
			});
			
		});
		*/
		
		//* get it back
			/*
			var query = "SELECT filedata FROM images  WHERE id=($1)";
			var data;
			var datab;
			var fd = fs.openSync(fileName__, "a", 0755);
			pool.query(query, [5], (error, results) => {
				if (error) {
					throw error
				}
				datab = results.rows[0].filedata;
				console.log('result select length = %d', datab.length);
				console.log('***********************************************************');
				
				
				var dataa_  = datab.toString("utf8", 0, datab.length); //l'encodage dépend du fichier source avant insertion dans la bd (hex) sortie: text->utf8, jpeg -> utf8
																		//pdf bd=hex, sortie=utf8; txt bd=  , sortie=
				console.log('result select binary : '+dataa_.length);
				fs.write(fd, dataa_, null, 'hex', function(err, Writen){ 	//fs.write(fd, buffer[, offset[, length[, position]]], callback) OR 
																		//fs.write(fd, string[, position[, encoding]], callback)
				
					// close the file
					fs.close(fd, function() {
						console.log('file closed');
					});
				
					//fs.writeFile('/Temp/foo.jpg', data, 'hex', function(err, writen){ //'Binary'
					if(err)console.log('error writing');
					console.log('*************************************************************************************')
					console.log('writing in file.');
					console.log('*************************************************************************************')
				});
				
				console.log('data from db length = %d, data = %s',datab.length, datab);
				console.log('*************************************************************************************')
            });
			
			*/
			
			//Send data to android client
			var data;
			var data_;
			var data__;
			//Get stats of file
			fs.stat(fileName, function(error, stats) {
				console.log('stats.size = %d', stats.size);
				var buffer = new Buffer(stats.size);
				fs.open(fileName, "r", function(error, fd) {
					fs.read(fd, buffer, 0, buffer.length, null, function(error, bytesRead, buffer) {
						data  = buffer.toString("binary", 0, buffer.length);//binary
						data_ = buffer.toString('hex', 0, buffer.length);//hex
						console.log('buffer size : %d,  data binary length = %d, data hex length : %d', stats.size, data.length, data_.length);
						
						//convert image file to base64-encoded string
						//console.log("avant buffer chunk size = %d, data = %s", data.length, data);
						data__ = new Buffer(data, 'binary').toString('base64');
						//console.log("buffer chunk size = %d, data__ = %s", data__.length, data__);
						
						//insert data in db	
						var query = "UPDATE images SET filedata = ($1) WHERE id=($2)";
						console.log('data inserted in update = %s', data__.length);
						//pool.query(query, [data__, 5], (error, results) => {
						//	if (error) {
						//		throw error
						//		console.log("error update : "+results.rows);
						//	}
						//	console.log("update : "+results.rows);
						//});
						
						//Get it back
						var query = "SELECT filedata FROM images  WHERE ref=($1)";
						pool.query(query, [reference], async(error, results) =>{
			
							const promise = new Promise((resolve, reject) => {
								 resolve(results); //resolve('foo');---> value='foo'
							});
							//if(error)(reject("promise error "+error)); 
							let res = await promise;
							promise.then((value) => {
							  console.log('promise then SELECT filedata rowCount = '+value.rowCount+" filedata = "+value.rows[0].filedata.length);
							  var datab = value.rows[0].filedata;
							  //console.log("************************ from images *******************************************************");
							  //console.log(datab);
							  //console.log("************************ *******************************************************");
														  
							  var json = {"Ref" : reference, "Size" : datab.length, "Data" : datab.toString()};	//json object
							
							  var data ={};
							  data.ref = reference;
							  data.size= value.rows[0].filedata.length;
							  
							  socket.emit('download_chunks', json);	
							  
							  //////////////////////////////////////////////////////////////////////////////////////////////////////////
							  //Syntaxe
							  //sourceBuffer.copy(targetBuffer, targetStartIndex, sourceStartIndex, sourceEndIndex);
							  //buffer.slice(start, end);
							  
							  //Buffer.from(arrayBuffer[, byteOffset[, length]])
							  buf = Buffer.from(datab);
							  
							  const buf1 = Buffer.from(datab, 0, 400);
							  const buf2 = Buffer.from(datab, 400, 332);
							  
							  
							  const buf3 = buf2.copy(buf1, 400, 400, 332);
							  console.log("*** buf.length() = %d ***, buf1 = %d, buf2 = %d, buf3 = %d", buf.length, buf1.length, buf2.length, buf3.length);
							  
							  var buf10 = Buffer.from('abcdefghijkl');
							  var buf20 = Buffer.from('HELLO');

							  buf20.copy(buf10, 2);

							  console.log("*****"+buf10.toString());	//--->abHELLOhijkl
							  
							  var buf100 = Buffer.from('abcdefghijkl');
							  
							  var buf200 = buf100.slice(0, 5); //end index not included
							  console.log('buf200 = %s, buf200.length = %d', buf200.toString(), buf200.length);	//buf200 = abcde, buf200.length = 5
							  
							  var buf300 = buf100.slice(2, 5); //start index included, end index not included
							  console.log('buf300 = %s, buf300.length = %d', buf300.toString(), buf300.length);	//buf300 = cde, buf300.length = 3
							  
							  //Length buffer modified
							  buf300 = buf100.slice(3, 5); //start index included, end index not included
							  console.log('buf300 = %s, buf300.length = %d', buf300.toString(), buf300.length);	//buf300 = de, buf300.length = 2
							  
							  //Concat : Join the array into one buffer object:
							  var arr = [buf100, buf300];
							  var bufc = Buffer.concat(arr);
							  console.log(bufc.toString());		//--->abcdefghijklde
							  
							  const buf1000 = buf.slice(0, 200);
							  const buf1001 = buf.slice(200, 400);
							  const buf1002 = buf.slice(400, 600);
							  const buf1003 = buf.slice(600, 732);
							  
							  var arrr = [buf1000, buf1001, buf1002, buf1003];
							  var bufcc = Buffer.concat(arrr);
							  //console.log('bufcc.length = %d, \nbufcc = %s', bufcc.length, bufcc.toString());
							  
							  //For loop
							  var i;
							  var start, end;
							  var chunk = [];
							  const chunkSize = 100;
								for (i = 0; i < buf.length / chunkSize; i++) {
									start = i * chunkSize;
									end   = (i + 1) * chunkSize; 
									end = (end >  buf.length) ? buf.length : (i + 1) * chunkSize;
									
									chunk[i] = buf.slice(start, end);
									//console.log('start = %d, end = %d', start, end);
								}
							  bufcc = Buffer.concat(chunk);
							  //console.log('bufcc.length = %d, \nbufcc = %s', bufcc.length, bufcc.toString());
							  
							//const obj = JSON.parse(json);	
							//console.log("************************ download *******************************************************");
							//console.log("*** download_chunks to android client ***\n");
							  //socket.emit('download_chunks', json);	
							//console.log("*******************************************************************************");
							  
							});
							
							//promise.then(console.log('from promise '+results.rows[0].filedata.length));
							//promise.catch((error) => {
							//	console.log('Promise error : '+error);
							//});
							//console.log('from promise '+results.rows[0].filedata.length); //même valeur que 'select length(filedata) from images where ref= reference;'
							//var datab = value.rows[0].filedata;
							//console.log('result select : data length = %d, datab = %s', datab.length, datab);
							
							//var datac = new Buffer(datab, 'base64').toString('base64');
							//console.log('datac length = %d, datac = %s', datac.length, datac);
							
							//Send data to android client
							
							//var base64Data = datab;
							
							//console.log("JSON "+datac);
							//console.log("send chunk size = %d, data = %s", datab.length, datab.toString("utf8"));
							//const json = '{"Name": "'+Name+'" , "Data"'+datab+'"';
							//var json = {"Data" : datab.toString()};	//json object
							
							//var data ={};
							//data.ref = reference;
							//data.size= value.rows[0].filedata.length;
							
							//const obj = JSON.parse(json);	
							//console.log("************************ download *******************************************************");
							//console.log("*** download_chunks to android client ***\n");
							//socket.emit('download_chunks', json);	
							//console.log("*******************************************************************************");
			
						});
					});
				});
				
			});
			
			//convert image file to base64-encoded string
			//console.log("avant buffer chunk size = %d, data = %s", data.length, data);
			//data__ = new Buffer(data, 'binary').toString('base64');
			//console.log("buffer chunk size = %d, data__ = %s", data__.length, data__);
			
			//insert data in db	
			//var query = "UPDATE images SET filedata = ($1) WHERE id=($2)";
			//console.log('data update = %s', data.length);
			//pool.query(query, [data__, 5], (error, results) => {
			//	if (error) {
			//		throw error
			//		console.log("error update : "+results.rows);
			//	}
			//	console.log("update : "+results.rows);
			//});
					
			//});
			
			//var Name = "toto";
			//var base64Data = data__;
			//console.log("send chunk size = %d", data__.length);
			//socket.emit('download_chunks', { 'Name' : Name, 'Data' : base64Data});	
			
			
		//var fd = fs.openSync('avatar.jpg', "r");
		//fs.read(fd, 1024, (err, imgData) => {
				
		//	if(err)console.log('error reading file');
		//	console.log('imgData.length = %s', imgData.length);
		//});
		
	});
	var chunkIndex = 0;
	
	socket.on('downloadFileMoreData', function (chunkStatus){ //chunkStatus = JSON Object
		console.log('downloadFileMoreData : File index = %d, Place = %d, Percent = %s', chunkStatus['File'], chunkStatus['Place'], chunkStatus['Percent']);
		//calculer le chunk à envoyer avec les données : index, ref, data
		console.log('calculer le chunk à envoyer');
		
		const size = buf.length;
		const chunkSize = (size / 100) < 1000 ? size : Math.round(size / 100);
		//var chunkSize = 2860;
		var start = chunkStatus['Place'];
		
		console.log('typeof start = number = '+(typeof start == 'number'));
		console.log('typeof chunkSize = number = '+(typeof chunkSize == 'number'));
		
		var end = start + chunkSize;
		var chunk = buf.slice(start, end);
		console.log('start = %d, end = %d, chunkSize = %d, start + chunkSize = %d, chunk.length = %d, chunkIndex = %d', start, end, chunkSize, start - chunkSize, chunk.length, chunkIndex);
		
		
		var ref = ""; 
		
		var json = {'File' : chunkIndex, 'Ref' : ref, 'Size' : size, 'Data' : chunk.toString()};
		socket.emit('download_file_chunks', json);	
		chunkIndex++;
	});
	
	socket.on("downloadFileComplete", function (chunkStatus){ //chunkStatus = JSON Object
		console.log('downloadFileComplete');
	});
});//end io.on('connection', (socket)

