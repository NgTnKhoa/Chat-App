// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBhzzsz1aU42KFbeEtkZlQTyeKFtBIjN0c",
    authDomain: "chat-app-a443c.firebaseapp.com",
    projectId: "chat-app-a443c",
    storageBucket: "chat-app-a443c.appspot.com",
    messagingSenderId: "515996440240",
    appId: "1:515996440240:web:43b5450fb50555559ecd75",
    measurementId: "G-J6ZGZEP6W6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
