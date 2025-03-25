// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBUfXMYNSSJ3C6z-DeMfhBfvozKSFeMRbk",
    authDomain: "devlinks-7e076.firebaseapp.com",
    projectId: "devlinks-7e076",
    storageBucket: "devlinks-7e076.firebasestorage.app",
    messagingSenderId: "210402368395",
    appId: "1:210402368395:web:6551e1c7a9ba6100afad8e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
export { database, ref, set, push };
