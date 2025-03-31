// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3yVmCBcHJyJp6nifWSlZVTqNr8x-YGW0",
  authDomain: "twiller-proj.firebaseapp.com",
  projectId: "twiller-proj",
  storageBucket: "twiller-proj.firebasestorage.app",
  messagingSenderId: "838605253662",
  appId: "1:838605253662:web:d8120218e5de55b5f1120f",
  measurementId: "G-8M8DSF93LK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)
export default app

// const analytics = getAnalytics(app);