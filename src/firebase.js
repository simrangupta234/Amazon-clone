import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAu_cadmjYvmyztJkVHzAke8-8_g2Rkwfw",
  authDomain: "clone-e2310.firebaseapp.com",
  projectId: "clone-e2310",
  storageBucket: "clone-e2310.appspot.com",
  messagingSenderId: "121179847040",
  appId: "1:121179847040:web:1ea258e64fd34f7cf46965",
  measurementId: "G-YJ2YN1FSPH",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };
