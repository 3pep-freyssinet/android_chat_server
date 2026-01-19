const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;

// HTTP server
const httpServer = createServer(app);

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
  console.log("User connected:", socket.user.userId, "username:", socket.user.username);

  // Example dummy users
  const users = [
    { id: "188", nickname: "Alice", status: 1, connectedAt: "10:12", lastConnectedAt: "Yesterday", notSeenMessages: 2 },
    { id: "189", nickname: "Bob", status: 0, connectedAt: "09:40", lastConnectedAt: "Today", notSeenMessages: 0 }
  ];

  // ✅ Private: send to **this socket only**
  socket.emit("chat:users:list", users);
  console.log("Sent user list to socket:", socket.id);

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
});

// Start server
httpServer.listen(PORT, () => console.log("Server listening on port", PORT));

