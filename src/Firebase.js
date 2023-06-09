import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBuo188T_HWUXR6yzJLLsJ8RcyGbr_a66s",
  authDomain: "emproductify.firebaseapp.com",
  projectId: "emproductify",
  storageBucket: "emproductify.appspot.com",
  messagingSenderId: "441578574595",
  appId: "1:441578574595:web:f87fadfd62ea919d7d0f36",
  // apiKey: "AIzaSyB1zSGf_k9o4TS-yVQUp5jDC-pJYwTPYdc",
  // authDomain: "student-side-8de2b.firebaseapp.com",
  // projectId: "student-side-8de2b",
  // storageBucket: "student-side-8de2b.appspot.com",
  // messagingSenderId: "1047113579143",
  // appId: "1:1047113579143:web:f1f6b81f20bffc34529622",
};

const app = firebase.initializeApp(firebaseConfig);
// export const auth = firebase.auth();

const db = getFirestore()

const auth = getAuth();

export { auth,db, app };
