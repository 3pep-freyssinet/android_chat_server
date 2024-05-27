
const express = require('express'),
http   = require('http'),
app    = express(),
server = app.listen(3000);
//io     = require('socket.io').listen(server);
io     = require('socket.io')(server, {'transports': ['websocket', 'polling']}).listen(server);
app.get('/', (req, res) => {

res.send('Chat Server is running on port 3000 xx')
});

