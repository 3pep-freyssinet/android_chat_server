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
const io = new Server(httpServer, {
  cors: {
    origin: "*",        // OK for now (tighten later)
    methods: ["GET", "POST"]
  },

  transports: ["polling", "websocket"],

  pingTimeout: 60000,   // Mobile networks need longer timeout
  pingInterval: 25000
});
httpServer.listen(PORT, () => console.log(`   Listening on ${ PORT }`));

const pgsqldb  = require('./queries')
const fs       = require("fs");
const url      = require('url');
const utf8     = require('utf8');
const crypto   = require('crypto');
//const route  = require('./routes') // an 'index.js' is expected in folder 'routes'
const { Pool } = require('pg');

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

//const JWT_SECRET 	= process.env.JWT_SECRET;

//handle io and sockets
const jwt = require('jsonwebtoken');
console.log("******* io.use((socket, next)"); 
io.use((socket, next) => {
  //console.log('socket : ', socket);
  console.log("Handshake socket id:", socket.id);
  console.log("Auth payload:", socket.handshake.auth);
  try {
    const token = socket.handshake.auth?.token;
    //console.log('token : ', token);
    if (!token) {
	  console.log('No token : ');
      return next(new Error("Session expired. Please log in again."));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.user = decoded; // trust established
	console.log("JWT decoded payload:", decoded); 
	console.log("jwt successfully verified");
    next();
  } catch (err) {
    	next(new Error("Session expired. Please log in again."));
  }
});


//detect the user first connection
io.on('connection', (socket) => {
	socket.on("disconnect", reason => {
    	console.log("Socket disconnected:", reason);
  	});
	
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

	//register  
    socket.on('chat:register', async (payload) => {
		console.log("chat:register");
    	try {
      		const userId       = socket.user.userId;     // from JWT
      		const username     = socket.user.username;   // from JWT
      		const avatarBase64 = payload.avatarBase64;  // optional

			console.log("register userId : ", userId);
			console.log("register username : ", username);
			console.log("register avatarBase64 : ", avatarBase64);
			
      		// 1️⃣ Upsert user in chat.users
      		await pool.query(`
        		INSERT INTO chat.users (
          			id,
          			nickname,
          			status,
          			connected_at,
          			last_seen_at
        		)
        		VALUES ($1, $2, 'online', NOW(), NOW())
        		ON CONFLICT (id)
        		DO UPDATE SET
          		status = 'online',
          		last_seen_at = NOW()
      		`, [userId, username]);

			console.log("chat:register : user registered successfully");
			
      		// 2️⃣ Store avatar in chat.user_images (if provided)
      		if (avatarBase64) {
        		const imageData = Buffer.from(avatarBase64, 'base64');

        		await pool.query(`
          		INSERT INTO chat.user_images (
            		user_id,
            		image_data,
            		uploaded_at
          		)
          		VALUES ($1, $2, NOW())
          		ON CONFLICT (user_id)
          		DO UPDATE SET
		            image_data = EXCLUDED.image_data,
            		uploaded_at = NOW()
        		`, [userId, imageData]);
      		}
            
			console.log("chat:register : image-avatar registered successfully");
      		
			// 3️⃣ Notify other connected users
      		socket.broadcast.emit("user:joined", {
        		userId,
        		nickname: username
      		});

      		// 4️⃣ Confirm registration to the client
      		socket.emit("chat:register:ok");

    		} catch (err) {
      			console.error(err);
      			socket.emit("chat:error", {
        		code: "REGISTER_FAILED",
        		message: "Unable to register user"
      		});
    	}
  });
  
  //dummies users
  console.log("User connected:", socket.user.userId);

  // Example users list (temporary)
  const users = [
    {
      id: "1",
      nickname: "Alice",
      status: 1,
      connectedAt: "10:12",
      lastConnectedAt: "Yesterday",
      notSeenMessages: 2
    },
    {
      id: "2",
      nickname: "Bob",
      status: 0,
      connectedAt: "09:40",
      lastConnectedAt: "Today",
      notSeenMessages: 0
    }
  ];

  socket.emit("chat:users:list", users);
  console.log("End sending User connected:");
//end dummies users

  //send dummy message
  socket.on("chat:join_conversation", async ({ withUserId }) => {
    console.log("join conversation with", withUserId);

    const room = getRoomName(socket.user.userId, withUserId);
    socket.join(room);

    // TEMP: dummy messages
    socket.emit("chat:conversation_history", [
      {
        from: withUserId,
        content: "Hello 👋",
        timestamp: Date.now() - 60000
      },
      {
        from: socket.user.userId,
        content: "Hi!",
        timestamp: Date.now()
      }
    ]);
   });

	socket.on("chat:send_message", ({ toUserId, content }) => {
    const room = getRoomName(socket.user.userId, toUserId);

    io.to(room).emit("chat:new_message", {
      from: socket.user.userId,
      content,
      timestamp: Date.now()
    });
  });
});

function getRoomName(a, b) {
  return [a, b].sort().join("_");
}
	
});// end io.on('connection', (socket) => {
