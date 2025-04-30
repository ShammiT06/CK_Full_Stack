// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFx2oa-tuv2LC-Ulq0Yk4vB1TzaxebyNE",
  authDomain: "cavinkart-c4142.firebaseapp.com",
  projectId: "cavinkart-c4142",
  storageBucket: "cavinkart-c4142.firebasestorage.app",
  messagingSenderId: "394724497155",
  appId: "1:394724497155:web:221cca728af3d9fa23fb36",
  measurementId: "G-MJLVP1W4YZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export {auth}