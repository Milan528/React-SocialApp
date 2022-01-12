const admin=require('firebase-admin');
const {firebaseConfig}=require('./firebaseConfig')
var serviceAccount = require('../social-app-78f47-firebase-adminsdk-45tve-45a8b48477.json');
const firebase=require('firebase')
firebase.initializeApp(firebaseConfig)
//ovo je zbog lokalnog testiranja 
admin.initializeApp();

const db=admin.firestore();

module.exports = { admin,db,firebase };