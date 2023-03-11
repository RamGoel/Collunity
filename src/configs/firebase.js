// Import the functions you need from the SDKs you need
import { initializeApp, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

var app;
var storage;

try {
  app = getApp();
} catch (error) {

  const firebaseConfig = {
    apiKey: "AIzaSyCTRGcxm0ZmUVTRMFdA72qYTKTr6SLbMaA",
    authDomain: "kalakriti-e95b0.firebaseapp.com",
    projectId: "kalakriti-e95b0",
    storageBucket: "kalakriti-e95b0.appspot.com",
    messagingSenderId: "1033465116600",
    appId: "1:1033465116600:web:d90833e9b3409b77c8414d",
    measurementId: "G-EHGMJC9TCG"
  };
  app = initializeApp(firebaseConfig);
}
storage = getStorage(app);

// Initialize Firebase

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, storage };



