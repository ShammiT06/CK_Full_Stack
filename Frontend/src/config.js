// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyDFx2oa-tuv2LC-Ulq0Yk4vB1TzaxebyNE",
//   authDomain: "cavinkart-c4142.firebaseapp.com",
//   projectId: "cavinkart-c4142",
//   storageBucket: "cavinkart-c4142.firebasestorage.app",
//   messagingSenderId: "394724497155",
//   appId: "1:394724497155:web:221cca728af3d9fa23fb36",
//   measurementId: "G-MJLVP1W4YZ"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app)

// export {auth}




import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyChHucK9DiZIxpZOIOpC2h8WduGdQliEyc",
  authDomain: "cavinkart-54163.firebaseapp.com",
  projectId: "cavinkart-54163",
  storageBucket: "cavinkart-54163.firebasestorage.app",
  messagingSenderId: "338109866355",
  appId: "1:338109866355:web:f1d3192166129e6215e506",
  measurementId: "G-YGG6VXTLFQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)

export {auth}