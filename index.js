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
//const route    = require('./routes') // an 'index.js' is expected in folder 'routes'

//const JWT_SECRET 	= process.env.JWT_SECRET;

//handle io and sockets
const jwt = require('jsonwebtoken');
console.log("******* io.use((socket, next) ");
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    console.log('token : ', token);
    if (!token) {
	  console.log('No token : ');
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
