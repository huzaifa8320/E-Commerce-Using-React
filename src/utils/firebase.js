import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAVymLX3z2GYj_ZISLKxjUmF_jPFeqecdw",
    authDomain: "react-projects-9240a.firebaseapp.com",
    projectId: "react-projects-9240a",
    storageBucket: "react-projects-9240a.appspot.com",
    messagingSenderId: "944739034295",
    appId: "1:944739034295:web:53251dfb80113ec4e31932",
    measurementId: "G-7Q2Y2ZD8D7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);
const storage = getStorage();

export{
    app,
    auth,
    db,
    storage
}