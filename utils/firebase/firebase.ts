// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyAjbIbcFxoLKrE7U7EEzLckwXw8X2kYp78",
    authDomain: "sicaram-next-js.firebaseapp.com",
    projectId: "sicaram-next-js",
    storageBucket: "sicaram-next-js.appspot.com",
    messagingSenderId: "1027188997148",
    appId: "1:1027188997148:web:519aa1ec6e5e0b0e43f3d9",
    measurementId: "G-31MMCY34CF"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;
