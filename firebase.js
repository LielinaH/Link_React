import firebase from "firebase";
import "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBS8nSyO3mTK2EvJyCOAOAjZkaHtYX47Mg",
  authDomain: "finalyearpro-558d9.firebaseapp.com",
  projectId: "finalyearpro-558d9",
  storageBucket: "finalyearpro-558d9.appspot.com",
  messagingSenderId: "105235165212",
  appId: "1:105235165212:web:c9f008f88b389c5035afd9",
  measurementId: "G-HK9YWG66XC"
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();
const realTimeDb = app.database();
const db = app.firestore();
const auth = app.auth();
const storage = firebase.storage();

export { auth, db, storage, realTimeDb };
