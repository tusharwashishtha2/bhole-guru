import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBzHSz4Li0-BtEa9kLyE8QGcfO_E3BNpCI",
    authDomain: "bhole-guru-fb58c.firebaseapp.com",
    projectId: "bhole-guru-fb58c",
    storageBucket: "bhole-guru-fb58c.firebasestorage.app",
    messagingSenderId: "872776784858",
    appId: "1:872776784858:web:1cd25b2185f1abd5c1bee3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
