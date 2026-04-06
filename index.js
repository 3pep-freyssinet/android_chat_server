const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

// HTTP server 
const httpServer = createServer(app);

const { Pool } = require('pg');
const fs       = require("fs");
const url      = require('url');
const utf8     = require('utf8');
const crypto   = require('crypto');

const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

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

// Import routes
const users_routes  		= require('./routes/users');
//const tokens_routes 		= require('./routes/tokens');
const fcm_routes    		= require('./routes/fcm');
//const notifications_routes    	= require('./routes/notifications');
//const pins_routes    	        = require('./routes/pins');
//const environ_routes            = require('./routes/environ');

// Use routes
app.use('/users', users_routes);
//app.use('/tokens', tokens_routes);
app.use('/fcm', fcm_routes);
//app.use('/notifications', notifications_routes);
//app.use('/pins', pins_routes);
//app.use('/environ', environ_routes);

console.log("test");

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
  pingTimeout: 20000,
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

// users manager
const onlineUsers = new Map();

function isUserOnline(userId) {
  return onlineUsers.has(Number(userId));
}

/*
//watchdog timer
setInterval(async () => {
  const result = await pool.query(`
      UPDATE chat.users
      SET status = 0
      WHERE status != 0
      AND last_heartbeat_at < NOW() - INTERVAL '60 seconds'
      RETURNING id
  `);

  result.rows.forEach(row => {
      io.emit("user_status", {
          userId: row.id,
          status: "offline"
      });
      console.log("forced offline:", row.id);
  });
}, 30000);
*/

// On client connect
io.on("connection", async (socket) => {
  const myUserId = socket.user.userId;
  const userId   = String(socket.user.userId);
  
  //send users list, done in unread messages.
  //getUsersList();

  socket.join(String(myUserId))

  // store presence
  const userId_ = Number(socket.user.userId);

  onlineUsers.set(userId_, socket.id);
  //onlineUsers.set(String(userId), socket.id);
  console.log("User online:", userId_);
  
  //console.log("onlineUsers : ", onlineUsers);
  console.log("online users:", Array.from(onlineUsers.keys()));
  
  //set 'online' on db.
  setUserOnline(userId);//async function

  io.emit("user_status", {
    userId,
    status: "online"
  });

  // send snapshot to the new user
  socket.emit("online_users", Array.from(onlineUsers.keys()));
  
  //send users list with unread messages
  getUsersWithUnread(socket, myUserId);
  
  //console.log("Total clients:", pool.totalCount);
  //console.log("Idle clients:", pool.idleCount);
  //console.log("Waiting clients:", pool.waitingCount);

  // 🔥 DELIVER MISSED MESSAGES
  const { rows } = await pool.query(`
    SELECT * FROM chat.conversations
    WHERE id_to = $1 AND status = 'sent'
  `, [userId]);

for (const msg of rows) {

  // 1️⃣ send message to receiver
  socket.emit("chat:new_message", msg);

  // 2️⃣ update status to delivered
  await pool.query(`
    UPDATE chat.conversations
    SET status = 'delivered'
    WHERE id = $1
  `, [msg.id]);

  msg.status = "delivered";

  // 3️⃣ notify original sender (if online)
  const senderSocketId = onlineUsers.get(msg.id_from);
  console.log("notify original sender : map : ", onlineUsers);
  console.log("notify original sender : msg.id_from : ", msg.id_from);
  console.log("notify original sender : senderSocketId : ", senderSocketId);
  console.log("notify original sender : msg.id : ", msg.id);
  
  if (senderSocketId) {
    io.to(senderSocketId).emit("chat:message_status_update", {
      id: msg.id, //localId: msg.localId,
      status: "delivered"
    });
  }
}//end for
  
  socket.on("disconnect", async () => {
    const userId = socket.user.userId;

     console.log("user disconnect : userId : ", userId);
    
    if (!userId) return;
    const userId_ = Number(socket.user.userId);
    
    console.log("delete attempt:", userId_, typeof userId_, ' expected a number');
    console.log("keys before:", Array.from(onlineUsers.keys()));
    
    onlineUsers.delete(userId_);
    
    console.log("keys after:", Array.from(onlineUsers.keys()));
    
    await setUserOffline(userId);
    io.emit("user_status", {
      userId,
      status: "offline"
    });
});

  socket.on("user_status_change", async (status) => {
    const userId = Number(socket.user.userId);
    console.log("user_status_change:", userId, status);
    if (status === "standby") {
      await setUserStandby(userId);
      io.emit("user_status", {
        userId,
        status: "standby"
      });
    }

    if (status === "online") {
      await setUserOnline(userId);
      io.emit("user_status", {
        userId,
        status: "online"
      });
  }
});
  
  socket.on("presence_ping", async () => {
    const userId = Number(socket.user.userId);
    console.log("presence_ping : userId : ", userId);
    await pool.query(
      `
        UPDATE chat.users
        SET last_heartbeat_at = NOW(),
          status = 1
        WHERE id = $1
      `,
    [userId]
  );
});
  
  socket.onAny((event) => {
    console.log("any............📡 From", socket.id, "event:", event);
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

  // ⭐ FORCE stop typing
  const from = socket.user.userId;
  const to   = String(toUserId);
  
  io.to(String(message.to)).emit("typing:stop", { from });
    
  try {
    const fromUserId = socket.user.userId;
    const status     = isUserOnline(toUserId) ? "delivered" : "sent";
    
    console.log("chat:send_message :  status : ", status);  
    
    const query = `
      INSERT INTO chat.conversations (id_from, id_to, message, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const { rows } = await pool.query(query, [
      fromUserId,
      toUserId,
      message,
      status
    ]);
    
    const savedMessage = rows[0];
    //console.log("chat:send_message : savedMessage", savedMessage);

    // 🔥 Attach localId so sender can match optimistic message
    savedMessage.localId   = localId;
    //savedMessage.serverId = id;

    // 🔥 Emit to sender
    socket.emit("chat:new_message", savedMessage);
    console.log("chat:emit to : ", toUserId);
    console.log("chat:emit message : ", savedMessage);
    
    // send to receiver ONLY if online
    console.log("chat:emit message : toUserId : ", toUserId, " isUserOnline : ",  isUserOnline(toUserId));
    console.log("chat:emit message : map : ");
    console.log("chat:emit message : map : ", onlineUsers);
    console.log("chat:emit message : onlineUsers.get(toUserId) : ", onlineUsers.get(toUserId));

    /*
    if (isUserOnline(toUserId)) {
      console.log("chat:emit message to receiver : ", savedMessage);
      io.to(onlineUsers.get(String(toUserId))) .emit("chat:new_message", savedMessage);
    }
    */
    if (isUserOnline(toUserId)) {
      // ✅ Send via Socket.io
      io.to(String(to)).emit("chat:new_message", savedMessage);
      console.log("Sent via socket");
    }else{
      console.log("User offline → sending FCM");

    try {
      //get 'fcm_token'
      const result = await pool.query(
        'SELECT fcm_token FROM fcm_tokens WHERE user_id = $1',
        [toUserId]
      );

      if (result.rows.length > 0) {
        const fcmToken = result.rows[0].fcm_token;

        //Get the sender name
        const senderName = await getUserName(fromUserId);

        //format the message
        const preview = formatMessagePreview(savedMessage);
        
        const profileImageUrl = 'null';
        // with 'data', the client: 'MyFirebaseMessagingService.onMessageReceived' is called to buil notication.
        await admin.messaging().send({
          token: fcmToken,
          data: {
            senderName: senderName,
            message: preview,
            senderId: String(fromUserId),
            messageId: String(savedMessage.id),
            profileImageUrl: profileImageUrl
          }
        });

      console.log("FCM notification sent");

    } else {
      console.log("No FCM token found for user");
    }

  } catch (error) {
    console.error("Error sending FCM:", error);

    if (error.code === 'messaging/registration-token-not-registered') {
      console.log("Invalid token → removing from DB");

      await pool.query(
        "DELETE FROM fcm_tokens WHERE fcm_token = $1",
        [fcmToken]
      );
    }
  }
}
    
    // If delivered immediately → notify sender if the receiver is online.
    if (isUserOnline(toUserId)) {
      socket.emit("chat:message_status_update", {
        serverId: savedMessage.id,
        status: "delivered"
      });
    }

    //Recalculate unread for receiver
    //await getUsersWithUnread(toUserId);
    ///////////////////////////////////////
  const currentUserId = socket.user.userId;
  console.log("chat:get_users_with_unread in send_message : currentUserId : ", currentUserId);
  console.log("chat:get_users_with_unread in send_message : toUserId : ", toUserId);

    const query_ = `
      SELECT u.id,
             u.nickname,
             u.status,
             u.connected_at,
             u.last_seen_at,
             COALESCE(COUNT(c.id), 0) AS unread_count
      FROM chat.users u
      LEFT JOIN chat.conversations c
             ON c.id_from = u.id
             AND c.id_to = $1
             AND c.status != 'seen'
      WHERE u.id != $1
      GROUP BY u.id
      ORDER BY u.nickname
    `;

    //const { rows_ } = await pool.query(query_, [currentUserId]);
    const { rows: rows_ } = await pool.query(query_, [toUserId]);
    
    //console.log("chat:get_users_with_unread in send_message : rows : ", rows_);
    
    //socket.emit("chat:users_with_unread", rows);
    //io.to(toUserId).emit("chat:users_with_unread", rows_);
    io.to(String(toUserId)).emit("chat:users_with_unread", rows_);
    //////////////////////////////////////////////////////////////////////////
    
  } catch (err) {
    console.error("❌ send_message error", err);
  }
});

  //receive an image message
  socket.on("chat:send_image", async ({ toUserId, image_url, message, localId }) => {
  console.log("chat:send_image start ...");
    
  const fromUserId = socket.user.userId;

  const query = `
    INSERT INTO chat.conversations (id_from, id_to, message, image_url, status)
    VALUES ($1, $2, $3, $4, 'sent')
    RETURNING *
  `;

  const { rows } = await pool.query(query, [
    fromUserId,
    toUserId,
    message || null,
    image_url
  ]);

  const savedMessage    = rows[0];
  savedMessage.localId  = localId; // ⭐ CRITICAL
  //savedMessage.serverId =  rows[0].id;
    
  socket.emit("chat:new_message", savedMessage);
  io.to(String(toUserId)).emit("chat:new_message", savedMessage);
 
    // send to receiver ONLY if online
    console.log("chat:send_image : emit message to receiver : toUserId : ", toUserId, " isUserOnline(toUserId)", isUserOnline(toUserId));
    if (isUserOnline(toUserId)) {
      console.log("chat:emit message to receiver : ", savedMessage);
      io.to(onlineUsers.get(String(toUserId))) .emit("chat:new_message", savedMessage);
    }
    
    // If delivered immediately → notify sender if the receiver is online.
    if (isUserOnline(toUserId)) {
      console.log("delivered immediately → notify sender : chat:message_status_update : ", savedMessage.id);
      io.to(socket.id).emit("chat:message_status_update", {
        serverId: savedMessage.id,
        status: "delivered"
      });
    }
});

/*
socket.on("chat:mark_seen", ({ withUserId }) => {
  console.log("chat:mark_seen start ...");
    io.to(String(withUserId)).emit("chat:seen", {
        fromUserId: socket.user.userId
    });
});
*/

/*
socket.on("chat:mark_seen", async ({ withUserId }) => {

  const myUserId = socket.user.userId;
  console.log("chat:mark_seen start ...myUserId : ", myUserId, " withUserId : ", withUserId);
  
  // 1️⃣ Update DB
  await pool.query(`
    UPDATE chat.conversations
    SET status = 'seen'
    WHERE id_from = $1 AND id_to = $2
      AND status != 'seen'
  `, [withUserId, myUserId]);

  // 2️⃣ Notify sender
  io.to(String(withUserId)).emit("chat:seen", {
      fromUserId: myUserId
  });
});
*/

socket.on("chat:mark_seen", async ({ fromUserId }) => {
  console.log("chat:mark_seen start ...fromUserId : ", fromUserId);
  const { rows } = await pool.query(`
      UPDATE chat.conversations
      SET status = 'seen'
      WHERE id_from = $1
      AND id_to = $2
      AND status != 'seen'
      RETURNING id
  `, [fromUserId, socket.user.userId]);

  // notify sender (Fanny)
  rows.forEach(r => {
      io.to(String(fromUserId)).emit("chat:message_status_update", {
          serverId: r.id,
          status: "seen"
      });
  });

});

socket.on("typing:start", ({ to }) => {
    const from = socket.user.userId;
    console.log("✏️ typing:start", from, "→", to);
    io.to(String(to)).emit("typing:start", { from });
});

 socket.on("typing:stop", ({ to }) => {
    const from = socket.user.userId;

    console.log("🛑 typing:stop", from, "→", to);

    io.to(String(to)).emit("typing:stop", { from });
}); 

socket.on("chat:get_conversation", async ({ withUserId }) => {
  console.log("chat:get_conversation start ");
  try {
    const myId = socket.user.userId;

    console.log("📥 get_conversation:", myId, "<->", withUserId);

    const messages = await pool.query(
      `
      SELECT *
      FROM chat.conversations
      WHERE (id_from = $1 AND id_to = $2)
         OR (id_from = $3 AND id_to = $4)
      ORDER BY sent_at ASC
      `,
      [myId, withUserId, withUserId, myId]
    );

    console.log("chat:get_conversation : messages.rows : ", messages.rows);
    socket.emit("chat:conversation", messages.rows);

  } catch (err) {
    console.error("❌ get_conversation error:", err);
  }
});
  
  //io.to(socket.id).emit("chat:get_users_with_unread",
                        
/////////////////////////////////////////////////////////////////////////////////
async function getUserName(userId) {
  try {
    const result = await pool.query(
      "SELECT nickname FROM chat.users WHERE id = $1",
      [userId]
    );
    if (result.rows.length === 0) {
      return "Unknown"; // fallback
    }
    return result.rows[0].nickname;
  } catch (err) {
    console.error("Error fetching username:", err);
    return "Unknown";
  }
}
//////////////////////////////////////////////////////////////////
  function formatMessagePreview(message, maxLength = 37) { //37 + ... = 40
  if (!message) return "";

  if (message.message.length <= maxLength) {
    return message.message;
  }
  console.log("formatMessagePreview : message : ", message.message);
  return message.message.substring(0, maxLength) + "...";
}
//////////////////////////////////////////////////////////////////////
async function getUsersWithUnread(socket, userId) {
  try {
    console.log("chat:get_users_with_unread : start ...");
    console.log("chat:get_users_with_unread : userId : ", userId);

    const query = `
      SELECT 
        u.id,
        u.nickname,
        u.status,
        u.connected_at,
        u.last_seen_at,
        COUNT(c.id) AS unread_count
      FROM chat.users u
      LEFT JOIN chat.conversations c
           ON c.id_from = u.id
          AND c.id_to = $1
          AND c.status != 'seen'
      WHERE u.id != $1
      GROUP BY u.id
      ORDER BY u.nickname;
    `;

    const { rows } = await pool.query(query, [userId]);

    // inject live presence
    const users = rows.map(u => ({
      ...u,
      status: onlineUsers.has(u.id) ? 1 : 0
    }));

    //console.log("chat:get_users_with_unread : users : ", users);
    
    io.to(String(userId)).emit("chat:users_with_unread", users);

  } catch (err) {
    console.error("❌ get_users_with_unread error", err);
  }
}
  
 /////////////////////////////////////////////////////////////////
async function updateConversations(id) {
  console.log('updateConversations : id :', id);
  try {
    const result = await pool.query("UPDATE chat.conversations SET status = 'delivered' WHERE id = $1, [id]");

    /*
    if (result.rows.length > 0) {
      return result.rows;
    } else {
      throw new Error('No sent messages found for this user');
    }
    */
    
  } catch (error) {
      console.error('Error fetching FCM token from the database:', error);
    throw error;
  }
} 

//////////////////////////////////////////////////////////////////
async function sendNotification(token, title, body) {
  const message = {
    token: token,
    notification: {
      title: title,
      body: body
    },
    data: {
      type: "chat_message"
    }
  };

  return admin.messaging().send(message);
}
/////////////////////////////////////////////////////////////////  
  async function getMessagesWithSentStatus(userIdTo) {
    console.log('getMessagesWithSentStatus(userId) :', userIdTo);
    try {
      //const result = await pool.query("SELECT * FROM chat.conversations WHERE id_to = $1 AND status = 'sent', [userIdTo]");
      const result = await pool.query(`SELECT * FROM chat.conversations WHERE id_to = $1 AND status = 'sent'`, [userIdTo]);
      console.log('getMessagesWithSentStatus : result.rows:', result.rows);
      
      if (result != null) {
        return result.rows || [];
      } else {
        throw new Error('No sent messages found for this user');
      }
    } catch (error) {
        console.error('Error fetching FCM token from the database:', error);
      throw error;
    }
}
/////////////////////////////////
function isUserOnline(userId) {
  return onlineUsers.has(String(userId));
}
///////////////////////////////
async function getUsersList() {
  
  const users = [
      { id: 426, nickname: "Alice" },
      { id: 901, nickname: "Bob" },
      { id: 902, nickname: "Charly" },
      { id: 427, nickname: "Fanny" },
      { id: 909, nickname: "Jilian" },
      { id: 910, nickname: "Karine" },
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
}
/////////////////////////////////////////////////////////////////////////////////
async function setUserOnline(userId) {
  await pool.query(
    `UPDATE chat.users
    SET status = 1,
        connected_at = NOW()
    WHERE id = $1`,
    [userId]
  );
}

async function setUserOffline(userId) {
  await pool.query(
    `UPDATE chat.users
    SET status = 0,
        last_seen_at = NOW()
    WHERE id = $1`,
    [userId]
  );
}
  
async function setUserStandby(userId) {
  try {
    const query = `
      UPDATE chat.users
      SET status = 2,
          last_seen_at = NOW()
      WHERE id = $1
    `;

    await pool.query(query, [userId]);
    console.log("User standby:", userId);
  } catch (err) {
    console.error("❌ setUserStandby error", err);
  }
}
  
/////////////////////////////////////////////////////////////////////////////////  
});//end io.on("connection", async (socket) =>

// Start server
httpServer.listen(PORT, () => console.log("Server listening on port", PORT));

