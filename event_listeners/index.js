const listeners = require('../queries_'); //'index.js' expected in folder './queries_'. Il y a un autre dossier 'queries', je ne sais où.
//const socket_    = require('../index.js'); //'socket' ne marche pas quand il est importé de cette manière
const express = require('express');
const router  = express.Router();

//global.answer = 42; //for test only
answer          = 42; //same as above

var state       = require("../common-modules");

var answer_     = state.answer_; //for test only

var myMap       = state.myMap;		//map
var n           = state.n;
var i           = state.i;
var people0     = state.people0;	//json
var people      = state.people;		//json
var profile     = state.profile; 	//json

var socket;
var size = myMap.size;

// Example usage
const data_ = {
  size: myMap.size,
};

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
watchVariable(data_, 'size', (newValue, oldValue) => {
	console.log(`§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§ Variable changed from ${oldValue} to ${newValue} §§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§`);
	
	mapWatch(myMap);
	
	/*
	console.log(" *** watchVariable : myMap ****************************************************");
		console.log("")
		const keys0 = myMap.keys(); //iterator
		let key_0   = keys0.next();
		while (!key_0.done) {
			 console.log("map    key =  " + key_0.value + " value = " + myMap.get(key_0.value)); // key : value
			 key_0 = keys0.next();		 //next key
		}
		console.log("");
		console.log("")
	console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$ myMap instanceof Map = " + (myMap instanceof Map) + "  $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
	*/
	
	//il y a un pb dans emit map. changer map en array en emission et recomposer map en reception
	//Unfortunately, Maps and Sets and other ES2015 datatypes cannot be JSON-encoded.
	console.log("$$$$$$$$ watchVariable $$$$$$$$$$$$$$$$$$$$ state.socket = " + state.socket + " Array.from(myMap) = " + Array.from(myMap));
	console.log("$$$$$$$$ state.socket.emit $$$$$$");
	if(state.socket != null)state.socket.emit('monitor_users_back', Array.from(myMap));
	
	
	//ne marche pas
	//router.get('/monitor_', async (req, res) => {
	//	const response = `Variable changed from ${oldValue} to ${newValue}`;
	//	res.send("response = " + response);
	//});
});

//global.myMap 	= new Map();		//map containing connected users and id
//var peopleMap = new Map();		//not used. map contains current users and selected users
//global.n 		= 0;				// number of connected users 
//global.i 		= 0;				//loop index in chunks
//global.people0	= {};			//json to store the connected pair : current user and selected user like people0[current]=selected. It is an object with keys accessed like : Object.keys(people0)
//global.people 	= {};			//json to store id and nickname like people[id]=nickname where id=socket.id
//global.profile 	= {};			//profile image
//var peopleId  = {};				//json to store id and nickname like people[nickname]=id.

/* not used
function monitor_users(){
	 console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ monitor_users : socket = " + state.socket + "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
	 //state.socket.emit('monitor_users_back', data_);
	 
	//watchVariable(data_, 'size', (newValue, oldValue) => {
	//		console.log(`§§§§§ppppppppppppppppppppppp Variable changed from ${oldValue} to ${newValue} §§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§`);
			
			
	}); 
};
*/

function mapWatch(){
	//console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ mapWatch : myMap.size         = " + myMap.size + " @@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
	//console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ mapWatch :  Array.from(myMap) = " + Array.from(myMap) + " @@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
	return Array.from(myMap);
}

async function testSocket1(pool, socket, msg, callback){
	//console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ testSocket1 : socket from require    = " + socket_.sockets + "keys = " + Object.keys(socket_));
	//console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ testSocket1 : socket from parameters = " + socket + "keys  = " + Object.keys(socket));
	//console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ testSocket1 : socket from require    = " + socket.broadcast);
	//console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ testSocket1 : global.answer          = " + answer);
	//console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ testSocket1 : global.answer_         = " + answer_);
	answer++; 
	answer_++;
	
	const nbUsers = await listeners.testSocket(pool, msg);
	const nbUsers_ = nbUsers.rows[0].count;

	//console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ test_socket listeners            :" + listeners); 
	//console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Object.keys(listeners)           :" + Object.keys(listeners)); 
	//console.log("@@@@@@@@@@@@@@@@@ùùùùùùùùùùùùùùùùùùùùùùù listeners.testSocket typeof      :" + typeof(listeners.testSocket));
	//console.log("@@ nb users in 'users' table : " + nbUsers_);
	callback(nbUsers_)
	socket.broadcast.emit('testSocket_back', nbUsers_);		//to all
}

async function disconnect_(pool, socket, people, people0, myMap){
	//console.log("disconnect : socket.id = " + socket.id + " " + people[socket.id] + " has disconnected  ******************************************************");
	console.log("disconnect : socket = " + socket + "  ******************************************************");	
	console.log("disconnect : pool = " + pool + "  ******************************************************");
	console.log("disconnect : people = " + people + "  ******************************************************");
}	
 
 n++;
 async function join(pool, socket, chatUserInfos){
		//timeout();
		//console.log("????????????????????????????'join' chat_user_infos chatUserInfos socketid = "+socket.id + " chatUserInfos.length = " + chatUserInfos.length);
		//console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ join : global.answer          = " + answer);
		//console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ join : global.answer_         = " + answer_);
		//console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ join : myMap.size             = " + myMap.size);
		
		//data_.size = 20;
		
		//Conversion string -> JSON
		const obj 					= JSON.parse(chatUserInfos);
		//const obj 				= JSON.stringify(chatUserInfos);
		//console.log('chat_user_infos : ' + obj);
		
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
		
		/*
		console.log(" ** ************************************** join : people **");
		console.log("")
		for(var key in people) {
			console.log("join : people keys : Key: " + key + " Value: " + people[key]);
		}
		console.log("");
		console.log("")
        console.log(" ** ************************************** join : end people **");
		*/
		
		//Store the image profile of the nickname
		profile[userNickname] =  imageProfile;
		
		//Add to object 'profile' a new object ' imageProfile' 
		const returnedTarget = Object.assign(profile, imageProfile); //assign(target, source); return target. 
		//So in the precedent statement 'returnedTarget' is the same 'profile'. We can verify this : there are the same keys.
		//console.log("key = "+Object.keys(profile));
		//console.log("key = "+Object.keys(returnedTarget));
		
		//store the user in map if it not exists : Remind : myMap : contains connected users and id
		//console.log(" join : Map-------------------------------------------------size = " + myMap.size);
		if(myMap.size != 0){
			const keys = myMap.keys(); //iterator
			let key_   = keys.next();
			var nickname;
			var found = false;
			//console.log("avant Begin Map toNickname_ = " + toNickname_);
			//run on all keys looking for existing 'userNickname'. if it is found, delete it and recreate it so it will have a new id 
			while (!key_.done) {
				 //console.log("map    key =  " + key_.value + " value = " + myMap.get(key_.value)); // key : value
				 //console.log("******** test if = " +(myMap.get(key.value) == toNickname_));
				 if(myMap.get(key_.value) == userNickname){ //The user exits, delete it from the map and recreate it so it will have a new id
					myMap.delete(key_.value);
					found = true; //not used
					break;
				 }
				 //else{
				 //	//first connection, there are other persons in the map
				 //	myMap.set(socket.id, userNickname);
				 //}
				 key_ = keys.next();		 //next key
			}
		}
		//else{
			//the first time, the map is empty
		//	myMap.set(socket.id, userNickname);
		//}
		
		//add item to map
		myMap.set(socket.id, userNickname);
		
		//console.log("join : End Map -----------------------------------------------");
		
		console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ join : myMap.size = " + myMap.size);
		console.log(" *** myMap ****************************************************");
		console.log("")
		const keys0 = myMap.keys(); //iterator
		let key_0   = keys0.next();
		while (!key_0.done) {
			 console.log("map    key =  " + key_0.value + " value = " + myMap.get(key_0.value)); // key : value
			 key_0 = keys0.next();		 //next key
		}
		console.log("");
		console.log("")
		console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"); 
		
		//'myMap' has changed, send change to 'watchVariable'
		data_.size = myMap.size;
		
		//the following statement is done above in 'else'
		//if(! found) myMap.set(socket.id, userNickname);
		
		//verification
		//get all keys-values pairs or 'myMap'
		console.log(" *** myMap ****************************************************");
		console.log("")
		const keys = myMap.keys(); //iterator
		let key_   = keys.next();
		while (!key_.done) {
			 console.log("map    key =  " + key_.value + " value = " + myMap.get(key_.value)); // key : value
			 key_ = keys.next();		 //next key
		}
		console.log("");
		console.log("")
		console.log(" *** myMap end ***************************************************");
		
		//Send a message to all users except the sender.
		//if we want to send the message to all users including the sender we just have to use io.emit() instead of socket.emit().
        //socket.broadcast.emit('userjoinedthechat', userNickname, socket.id, imageProfile); //ca marche
		//socket.emit('userjoinedthechat', userNickname, socket.id, imageProfile); //to sender
		
		console.log("****************** userjoinedthechat = " + userNickname +" socket.id = " + socket.id);
		
		socket.emit('userjoinedthechat', 	//to all
										userNickname,
										socket.id,
										imageProfile,
										status,
										connectionTime,
										lastConnectionTime,
										disconnectionTime,
										notSeenMessages,
										blacklistAuthor);
		
		//done in 'watchVariable'
		//state.socket.emit('monitor_users_back', data_); //to monitor
		
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
		
		//back from query
		const result = await listeners.join(pool, 
											userNickname,
											imageProfile,
											status,
											connectionTime, 
											lastConnectionTime, 
											disconnectionTime, 
											notSeenMessages, 
											blacklistAuthor, 
											connectedWith
											);
		//test the values returned
		console.log("??????????????????????? join : " 		+ "\n" +
		" nickname      = " + result.rows[0].nickname 		+ "\n" +
		" connected     = " + result.rows[0].connected 		+ "\n" +
		" old_connected = " + result.rows[0].old_connected 	+ "\n" 
		);
		
		//test
		if(result.rows[0].old_connected == result.rows[0].connected)throw new Error('join : no update done');

 }
 
async function disconnect(pool, socket){
	console.log("disconnect : socket.id = " + socket.id + " Object.keys(people) = " + Object.keys(people) + " has disconnected  ******************************************************");
	console.log("disconnect : socket = " + socket + "  ******************************************************");	
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
		console.log("disconnect : socket.id         = " + socket.id);
		console.log("disconnect : people[socket.id] = " + people[socket.id]);
		
		socket.broadcast.emit('userdisconnect', people[socket.id]);		//to all
		console.log("aaaaa state.keys   = " + Object.keys(state) + " aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
		console.log("aaaaa state.socket = " + state.socket + " aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
		
		//done in 'watchVariable'
		//state.socket.emit('monitor_users_back', data_);					//only to monitor
		
		//update table 'users'
		const disconnected   = await listeners.disconnect(pool, people[socket.id]);
		
		//const disconnected_  = disconnected.rows[0].disconnect;
		
		//console.log("disconnect : disconnected = " + disconnected_);
		
		//if(disconnected_ ==  people[socket.id]) throw new Error('disconnect : no update done');
		
		
		//remove the disconnected user from the map
		myMap.delete		(socket.id);
		
		//monitor the change in 'myMap'
		data_.size = myMap.size
		
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
		//delete    people0[people[socket.id]];	//remove the association currentUser --> selectedUser
		delete 		people0[user];				//the statement just above is not working because the 'people[socket.id]' which is using has been deleted in the statement 'delete 	people[socket.id];'
		
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
		
	    return;
}

async function save_image_profile_uri(pool, socket, profile, callback){
	var nickname =  profile.nickname;
	var uri      =  profile.uri;
	var time     =  profile.time;
		
	console.log("save_image_profile_uri : nickname = %s uri = %s time = %s",  nickname, uri, time);
	
		//l'instruction suivante est utilisée pour avoir une function 'async' qui permet d'utiliser 'await'.
		//si on se retrouve dans un context 'async' par exemple ou une function déclarée 'async', on utilise directement 'executeQuery' 
		
		const status  = await listeners.disconnect(pool, nickname, uri, time);  //return 'fail' or 'success'
		callback(status);
		return status;
}

async function get_all_users(pool, socket){
	console.log("get_all_users ");
	
	//get all users from db
	const allUsers = await listeners.get_all_users(pool);
	
	socket.emit("get_all_users_bak", allUsers.rows);
}


async function check(number) { 
  if (number % 2 == 0) { 
      return("The number is even") 
    } 
    else { 
      return("The number is odd") 
    } 
	
  /*
  return new Promise((Resolve, reject) => { 
    if (number % 2 == 0) { 
      Resolve("The number is even") 
    } 
    else { 
      reject("The number is odd") 
    } 
  });
  */  
} 
  

async function testSocket(pool, msg){
		console.log("** test_socket ** : " + msg);
		//return "Hello the world : '" + msg +"'"; 
		
		//get users number
		var query  = "SELECT count(*) FROM users "; 			
		
		//console.log("** test_socket ** query : " + query);
			
		return await executeQuery(pool, query, []);
		
}; //end function

/*		
async function disconnect(pool, name){
	//update user status in db
		var query = "UPDATE users SET " 						+ 
		" status = cast(0  AS bit(3))," 						+
		" disconnected = '" + Date.now() + "'"					+
		" WHERE nickname = '" + name + "'"                      +
		" RETURNING nickname";
		
		return await executeQuery(pool, query, []); //it will return 'nickname' so we can compare old and updated value
}
*/

/////////////////////////////////////////////////////////////////////////////////////////////
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
    		

module.exports = { 
	//check: check,
	testSocket1:testSocket1,
	disconnect:disconnect,
	join:join,
	get_all_users:get_all_users,
	mapWatch:mapWatch
}; 