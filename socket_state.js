// socketState.js
const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const onlineUsers = new Map();
const activeChats = new Map();

const { Pool } = require('pg');

const admin = require('firebase-admin');

//const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
//admin.initializeApp({
//  credential: admin.credential.cert(serviceAccount),
//});

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
    ca: fs.readFileSync("../ca.pem").toString(),
  },
  max: 20,
  min: 1,
  idleTimeoutMillis: 1000, 
});

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
