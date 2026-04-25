// socketState.js
const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const onlineUsers = new Map();
const activeChats = new Map();

//const admin = require('firebase-admin');
const pool  = require('./db');
console.log('pool : ', pool);
//const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
//admin.initializeApp({
//  credential: admin.credential.cert(serviceAccount),
//});



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

module.exports = {
  onlineUsers,
  activeChats,
  admin,
  getUserName
};
