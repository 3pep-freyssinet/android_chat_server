const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;

// HTTP server
const httpServer = createServer(app);

const { Pool } = require('pg');
const fs       = require("fs");
const url      = require('url');
const utf8     = require('utf8');
const crypto   = require('crypto');

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

//test
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

//get friends
async function getFriendIds(userId, pool) {
  console.log("getFriendIds :", userId);
  const result = await pool.query(
    `SELECT friend_id FROM user_friends WHERE user_id = $1`,
    [userId]
  );
  return result.rows.map(r => r.friend_id);
}

// Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  transports: ["polling", "websocket"],  // important!
  pingTimeout: 60000,
  pingInterval: 25000
});

// Middleware: JWT auth
io.use((socket, next) => {
  console.log("Socket handshake auth:", socket.handshake.auth);
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Session expired"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "test_secret");
    socket.user = decoded; // trust established
    console.log("JWT decoded payload:", decoded);
    next();
  } catch (err) {
    next(new Error("Session expired"));
  }
});

// On client connect
io.on("connection", (socket) => {
  const myUserId = socket.user.userId;
  const userId   = String(socket.user.userId);
  
  socket.onAny((event) => {
    //console.log("any............📡 From", socket.id, "event:", event);
  });
  
  socket.join(userId);
  
  console.log("User joined room:", userId);
  console.log("User connected:", myUserId);

  /*
  const users = [
      { id: 215, nickname: "Alice" },
      { id: 301, nickname: "Bob" },
      { id: 302, nickname: "Charly" },
      { id: 216, nickname: "Fanny" },
      { id: 309, nickname: "Jilian" },
      { id: 310, nickname: "Karine" },
    ];

    const visibleUsers = users.filter(u =>
      friendIds.includes(Number(u.id))
    );
    */
  /*
  try {
    const friendIds = await getFriendIds(myUserId, pool);
    socket.emit("chat:users:list", visibleUsers);

    console.log(
      `Sent ${visibleUsers.length} friends to user ${myUserId}`
    );

  } catch (err) {
    console.error("Failed to load friends:", err);
    socket.emit("chat:users:list", []); // fail-safe
  }
  */
  
  // ✅ Private: send to **this socket only**
  //socket.emit("chat:users:list", users);
  //console.log("Sent user list to socket:", socket.id);

  // ✅ Broadcast: send to **everyone** (optional)
  // io.emit("chat:users:list", users);

/*
const messages = [
  { id_from: "198", id_to: "199", message: "Hi, Fanny, can you call me.", sent_at:"Yesterday:10:12", seen: "seen"},
  { id_from: "198", id_to: "209", message: "Hi, Jillian, can you call me.", sent_at:"Yesterday:10:13", seen: "seen"},
  { id_from: "198", id_to: "210", message: "Hi, Karine, can you call me.", sent_at:"Yesterday:10:14",seen: "seen" },
  { id_from: "199", id_to: "198", message: "Hi, Alice. I'm here. Do you want something.", sent_at:"Today:10:12", seen: "seen"},
  { id_from: "209", id_to: "198", message: "Do you know ...", sent_at:"Today:10:30", seen: "seen"},
  { id_from: "210", id_to: "198", message: "I've meet Kevin in the school", sent_at:"Today:10:38", seen: "seen"}
];
*/
  const messages = [];
  
  // Join conversation example
 socket.on("chat:join_conversation", ({ withUserId }) => {
  
  const myId = String(socket.user.userId);
   
  console.log("chat:join_conversation myId: ", myId);
  console.log("chat:join_conversation withUserId: ", withUserId);
   
  const conversation = messages.filter(m =>
    (m.id_from === myId && m.id_to === withUserId) ||
    (m.id_from === withUserId && m.id_to === myId)
  );
  console.log("chat:conversation_history : ", conversation);
  socket.emit("chat:conversation_history", conversation);
});

  // Receive text message
  socket.on("chat:send_message", async ({ toUserId, message, localId }) => {
  console.log("chat:send_message start ...");
  console.log("chat:send_message :  fromUserId : ", socket.user.userId);
  console.log("chat:send_message :  toUserId : ", toUserId);
  console.log("chat:send_message :  message : ", message);  
    
  try {
    const fromUserId = socket.user.userId;

    const query = `
      INSERT INTO chat.conversations (id_from, id_to, message, seen)
      VALUES ($1, $2, $3, 'sent')
      RETURNING *
    `;

    const { rows } = await pool.query(query, [
      fromUserId,
      toUserId,
      message
    ]);

    const savedMessage = rows[0];

    // 🔥 Attach localId so sender can match optimistic message
    savedMessage.localId = localId;

    // 🔥 Emit to sender
    socket.emit("chat:new_message", savedMessage);
    console.log("chat:emit to : ", toUserId);
    console.log("chat:emit message : ", savedMessage);
    
    // 🔥 Emit to receiver
    io.to(String(toUserId)).emit("chat:new_message", savedMessage);

  } catch (err) {
    console.error("❌ send_message error", err);
  }
});

  //receive an image message
  socket.on("chat:send_image", async ({ toUserId, image_url, message, localId }) => {
  console.log("chat:send_image start ...");
    
  const fromUserId = socket.user.userId;

  const query = `
    INSERT INTO chat.conversations (id_from, id_to, message, image_url, seen)
    VALUES ($1, $2, $3, $4, 'sent')
    RETURNING *
  `;

  const { rows } = await pool.query(query, [
    fromUserId,
    toUserId,
    message || null,
    image_url
  ]);

  const savedMessage = rows[0];
  savedMessage.localId = localId; // ⭐ CRITICAL

  socket.emit("chat:new_message", savedMessage);
  //io.to(String(toUserId)).emit("chat:new_message", savedMessage);
});

  ///////////////////////////
(async () => {
  
  const users = [
      { id: 215, nickname: "Alice" },
      { id: 301, nickname: "Bob" },
      { id: 302, nickname: "Charly" },
      { id: 216, nickname: "Fanny" },
      { id: 309, nickname: "Jilian" },
      { id: 310, nickname: "Karine" },
    ];

  try {
    const friendIds = await getFriendIds(myUserId, pool);
    
    const visibleUsers = users.filter(u =>
      friendIds.includes(Number(u.id))
    );
    socket.emit("chat:users:list", visibleUsers);

    console.log(
      `Sent ${visibleUsers.length} friends to user ${myUserId}`
    );

  } catch (err) {
    console.error("Failed to load friends:", err);
    socket.emit("chat:users:list", []); // fail-safe
  }
})();;
////////////////////////
  
});//end io.on("connection", async (socket) =>

// Start server
httpServer.listen(PORT, () => console.log("Server listening on port", PORT));

