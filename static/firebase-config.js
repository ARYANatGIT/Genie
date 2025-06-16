import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getPerformance } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-performance.js";

const firebaseConfig = {
    apiKey: "AIzaSyBJoyDIiDP_aaUJqrVWzKrzZgVa7uw_p0A",
    authDomain: "loginpage-8b56d.firebaseapp.com",
    projectId: "loginpage-8b56d",
    storageBucket: "loginpage-8b56d.appspot.com",
    messagingSenderId: "469050315102",
    appId: "1:469050315102:web:2d5448eee34b902a16bfcf",
    measurementId: "G-NY7RN2PMPV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const perf = getPerformance(app);


export { app, auth , db , perf};


