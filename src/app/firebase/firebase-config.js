// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA3O_j5AmZ-AkEUt_PGsymfV_vgpnTHw8Q",
  authDomain: "e-commerce-e113e.firebaseapp.com",
  projectId: "e-commerce-e113e",
  storageBucket: "e-commerce-e113e.appspot.com",
  messagingSenderId: "947794709242",
  appId: "1:947794709242:web:9c50bf2c7bbc30c0c01743",
  measurementId: "G-FKTMQXL1V6"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
// Import the functions you need from the SDKs you need
// import { initializeApp, getApps, getApp } from "firebase/app";
// import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyA3O_j5AmZ-AkEUt_PGsymfV_vgpnTHw8Q",
//   authDomain: "e-commerce-e113e.firebaseapp.com",
//   projectId: "e-commerce-e113e",
//   storageBucket: "e-commerce-e113e.appspot.com",
//   messagingSenderId: "947794709242",
//   appId: "1:947794709242:web:9c50bf2c7bbc30c0c01743",
//   measurementId: "G-FKTMQXL1V6"
// };

// // Initialize Firebase
// const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// export const storage = getStorage(firebaseApp);
