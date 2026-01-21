const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;

// HTTP server
const httpServer = createServer(app);

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

//test
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

//get friends
async function getFriendIds(userId, pool) {
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

//get friends
async function getFriendIds(userId, pool) {
  const result = await pool.query(
    `SELECT friend_id FROM user_friends WHERE user_id = $1`,
    [userId]
  );
  return result.rows.map(r => r.friend_id);
}

// On client connect
io.on("connection", async (socket) => {
  const myUserId = socket.user.userId;

  console.log("User connected:", myUserId);

  try {
    const friendIds = await getFriendIds(myUserId, pool);

    const users = [
      { id: 190, nickname: "Alice" },
      { id: 201, nickname: "Bob" },
      { id: 202, nickname: "Charly" },
      { id: 205, nickname: "Fanny" },
      { id: 209, nickname: "Jilian" },
      { id: 210, nickname: "Karine" },
    ];

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
  
  // ✅ Private: send to **this socket only**
  //socket.emit("chat:users:list", users);
  //console.log("Sent user list to socket:", socket.id);

  // ✅ Broadcast: send to **everyone** (optional)
  // io.emit("chat:users:list", users);

  // Join conversation example
  socket.on("chat:join_conversation", ({ withUserId }) => {
    console.log("join conversation with", withUserId);

    const room = [socket.user.userId, withUserId].sort().join("_");
    socket.join(room);

    // Send dummy messages
    socket.emit("chat:conversation_history", [
      { from: withUserId, content: "Hello 👋", timestamp: Date.now() - 60000 },
      { from: socket.user.userId, content: "Hi!", timestamp: Date.now() }
    ]);
  });

  // Receive message
  socket.on("chat:send_message", ({ toUserId, content }) => {
    const room = [socket.user.userId, toUserId].sort().join("_");
    console.log("Sending message to room:", room, "content:", content);

    io.to(room).emit("chat:new_message", {
      from: socket.user.userId,
      content,
      timestamp: Date.now()
    });
  });
});//io.on("connection", async (socket) =>

// Start server
httpServer.listen(PORT, () => console.log("Server listening on port", PORT));

