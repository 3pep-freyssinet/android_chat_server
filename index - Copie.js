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
const express = require('express'),
http   = require('http'),
app    = express(),
server = http.createServer(app),
io     = require('socket.io').listen(server);
const fs  = require("fs");
const url = require('url');

////////////////////////////////////////////////////////

var bodyParser = require('body-parser')
//var app = express()
var sqlite3 = require('sqlite3')
var db = new sqlite3.Database('chatdb.sqlite');
var auth = require('basic-auth');
console.log('sqlite3 = '+sqlite3 );

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

authenticate = function (req, res, done) {
    // http basic auth for requests, passwd is md5 of pass
    var credentials = auth(req);

    if (credentials) {
        var query = "select * from user where name = '" + credentials.name + "' and password = '" + credentials.pass + "'";
        db.all(query, function (err, rows) {
            var userAndPwdCorrect = rows.length > 0;
            if (userAndPwdCorrect) {
                var userGUID = rows[0].guid;
                req.userGUID = userGUID;
            }
            done();
        });
    }
    else {
            res.status(401);
            res.send('Unauthorized');
    }
}

getChannels = function (req, res) {
    authenticate(req, res, function () {
        var query = "select * from channel";
        var result = new Array();
        db.each(query, function (err, row) {
            result.push({ "guid": row.guid, "name": row.name });
        }, function () {
            res.send(JSON.stringify(result));
        });
    })
}

getChannelMessages = function (req, res) {
    authenticate(req, res, function () {
        var n = req.url.lastIndexOf('/');
        var channelGUID = req.url.substring(n + 1);
        var query = "select * from message where channel_guid = '" + channelGUID + "'";
        var result = new Array();
        db.each(query, function (err, row) {
            result.push({ "guid": row.guid, "channel_guid": row.channel_guid, "user_guid": row.user_guid, "content": row.content });
        }, function () {
            res.send(JSON.stringify(result));
        });
    });
}

publishMessage = function (req, res) {
    authenticate(req, res, function () {
        // insert new message
        var n = req.url.lastIndexOf('/');
        var channelGUID = req.url.substring(n + 1);
        var userGUID = req.userGUID;
        var content = req.body.content;
        db.run("INSERT into message(guid,channel_guid,user_guid, content) VALUES ('" + guid() + "','" + channelGUID + "','" + userGUID +  "','" + content +"')");
        // return back all messages for channel in response
        var query = "select * from message where channel_guid = '" + channelGUID + "'";
        var result = new Array();
        db.each(query, function (err, row) {
            result.push({ "guid": row.guid, "channel_guid": row.channel_guid, "user_guid": row.user_guid, "content": row.content });
        }, function () {
            res.send(JSON.stringify(result));
        });
    });
}

app.use(bodyParser.json())
app.use('/images', express.static('images'))
///////////////////////////////////////////////////////

app.get('/', (req, res) => {

res.send('Chat Server is running on port 3000')
});

var myMap = new Map();
var n = 0;
var people={};	//id
var profile={}; //profile image

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

//Send message to user.
socket.on('messagedetection', (fromNickname, toNickname, toNicknameId, message, time) => {
       
       //log the message in console 

       console.log("message arrived from : "+fromNickname+" to  : "+toNickname+" toId : "+toNicknameId+" json message : "+message+" time : "+time);
        //create a message object 
       //let  message = {"message":messageContent, "fromNickname":fromNickname, "toNickname":toNickname,"time":time}
          // send the message to the client side  
       //io.emit('message', message );
       io.to(toNicknameId).emit('message', message );
	   //socket.broadcast.to(toNicknameId).emit('message', message );
	   console.log("message sent to  : "+toNickname+" json message = "+message)
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

/////////////////////////////////////////////////////////
socket.on('data', function(data) {
        console.log('SOCKET RESPONSE: ' + data);
    }).on('connect', function() {
        socket.write("GET /rest/whoami HTTP/1.1\r\n\r\n");
        console.log('SOCKET GET REQUEST SEND');
    }).on('end', function() {
        console.log('SOCKET ENDED');
    });

//////////////////////////////////////////////////////

});//end io.on('connection', (socket)


http.createServer(function(req, res) {
    
	console.log("http.createServer req : "+req+" res : "+res);
	var filePath = path.join(__dirname, '/files/output.mp3');
	var stat = fileSystem.statSync(filePath);

	res.writeHead(200, {
		'Content-Type': 'audio/mpeg',
		'Content-Length': stat.size
	});

	var readStream = fileSystem.createReadStream(filePath);
	// We replaced all the event handlers with a simple call to readStream.pipe()
	readStream.on('open', function() {
		// This just pipes the read stream to the response object (which goes to the client)
		readStream.pipe(res);
	});

	readStream.on('error', function(err) {
		res.end(err);
	});
    
	var file = fs.readFile(filePath, 'binary');

	//For replacing streaming with download;
	res.setHeader('Content-Length', stat.size);
	res.setHeader('Content-Type', 'audio/mpeg');
	res.setHeader('Content-Disposition', 'attachment; filename=your_file_name');
	res.write(file, 'binary');
	res.end();
});
/////////////////////////////////////////////////////
server.on('upgrade', handleWS);

function handleWS(request, socket, buf) {
    
	
	const pathname = url.parse(request.url).pathname;
	console.log("server and ws request = "+request+" pathname = "+pathname);
	/*
	var key = getHeader(request, 'Sec-WebSocket-Key');
    var magic = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
    var shasum = crypto.createHash('sha1');
    shasum.update(key + magic);
    var akey = shasum.digest('base64');
    var resp = ['HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        'Sec-WebSocket-Accept: ' + akey, '', ''].join('\r\n');
    console.log(key, resp);
    socket.write(resp);
    var inbuff = '';
	*/
    socket.on('data', function (buf) {
        console.log("socket.on");
		/*
		var fin = buf.readUInt8(0) >> 7;
        var opcode = buf.readUInt8(0) & 15; //0=cont, 1=text, 2=binary
        var mask = buf.readUInt8(1) >> 7, bmask;
        var len = buf.readUInt8(1) & 127;
        var i = 2;
        if (len === 126) { len = buf.readUInt16BE(i); i += 2; }
        else if (len === 127) {
            len = (buf.readUInt32BE(i) << 32) + buf.readUInt32BE(6);
            i += 8;
        }
        if (mask) { bmask = buf.slice(i, i + 4); i += 4; }
        data = buf.slice(i, i + len);
        if (mask) for (var j = 0; j < data.length; j++) 
            data[j] = data[j] ^ bmask[j % 4];
        if (opcode === 1) data = data.toString('utf8');
        // todo: handle fragmentation
        console.log(fin, opcode, mask, len, data);
		*/
    })
}
function getHeader(req, key) {
    var keyl = key.toLowerCase()
    for (var k in req.headers) if (k.toLowerCase() === keyl) return req.headers[k];
    return '';
}

///////////////////////////////////////////////////////

server.listen(3000,()=>{

console.log('Node app is running on port 3000');

});
