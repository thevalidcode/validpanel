// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtp_o0LrYej5NwTAXqT7tND7pot5TQ3Oc",
  authDomain: "valid-smm.firebaseapp.com",
  projectId: "valid-smm",
  storageBucket: "valid-smm.appspot.com",
  messagingSenderId: "532842810367",
  appId: "1:532842810367:web:e57392a85314de5713f5ca",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Get a reference to the Firestore database service
const db = getFirestore(app);

// Get a reference to the Authentication service
const auth = getAuth(app);

// Export the Firestore database instance and Authentication instance
export { db, auth };
