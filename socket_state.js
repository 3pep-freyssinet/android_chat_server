// socketState.js
const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const onlineUsers = new Map();
const activeChats = new Map();


module.exports = {
  onlineUsers,
  activeChats,
  admin
};
