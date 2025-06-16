import { auth } from "./firebase-config.js";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

import { db } from './firebase-config.js';
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

async function logUserActivity(user) {
    const baseData = {
        email: user.email,
        lastLogin: serverTimestamp(),
        location: {
            opencage: null,
            ipBased: null,
        }
    };

    // 1️⃣ IP-based location (immediate)
    try {
        const ipRes = await fetch("https://ipapi.co/json/");
        const ipData = await ipRes.json();

        baseData.location.ipBased = {
            city: ipData.city || null,
            region: ipData.region || null,
            country: ipData.country_name || null,
            ip: ipData.ip || null,
        };

    } catch (err) {
        console.warn("⚠️ IP-based location fetch failed:", err);
    }

    // 2️⃣ Store base data (IP + timestamp)
    try {
        await setDoc(doc(db, "user_visits", user.uid), baseData, { merge: true });
    } catch (err) {
        console.error("❌ Failed to write base user data:", err);
    }

    // 3️⃣ GPS-based OpenCage location (non-blocking)
    console.log("🌐 Checking for GPS support...");
    if (navigator.geolocation) {
        console.log("📍 Requesting GPS location...");
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                console.log("✅ GPS callback triggered");

                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                const apiKey = "ca31a585a69d48f59f7a505024ae9b2b";
                const ocUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

                try {
                    const ocRes = await fetch(ocUrl);
                    const ocData = await ocRes.json();

                    if (ocData.results && ocData.results.length > 0) {
                        const components = ocData.results[0].components;
                        baseData.location.opencage = {
                            latitude,
                            longitude,
                            road: components.road || null,
                            suburb: components.suburb || null,
                            city: components.city || components.town || components.village || null,
                            state: components.state || null,
                            postcode: components.postcode || null,
                            country: components.country || null,
                            formatted: ocData.results[0].formatted || null
                        };

                        // 🔁 merge OpenCage without overwriting ipBased
                        await setDoc(doc(db, "user_visits", user.uid), baseData, { merge: true });

                    } else {
                        console.warn("⚠️ OpenCage returned empty results");
                    }
                } catch (err) {
                    console.error("❌ OpenCage fetch failed:", err);
                }
            },
            (error) => {
                console.warn("❌ Geolocation error:", error);
            }
        );
    } else {
        console.warn("❌ Geolocation is not supported by this browser");
    }
}

window.showSignIn = function () {
    document.getElementById("signInDiv").style.display = "block";
    document.getElementById("signUpDiv").style.display = "none";
};

window.showSignUp = function () {
    document.getElementById("signInDiv").style.display = "none";
    document.getElementById("signUpDiv").style.display = "block";
};

function showMessage(text, type) {
    const messageBox = document.getElementById("messageBox");
    messageBox.textContent = text;
    messageBox.className = type;
    messageBox.style.display = "block";

    setTimeout(() => {
        messageBox.style.display = "none";
    }, 5000);
}

window.registerUser = function () {
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const name = document.getElementById("registerName").value;

    if (!email || !password || !name) {
        showMessage("Please enter all credentials.", "error");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password, name)
        .then((userCredential) => {
            const user = userCredential.user;
            document.getElementById("loginEmail").value = "";
            document.getElementById("loginPassword").value = "";
            document.getElementById("loginName").value = "";

            sendEmailVerification(user)
                .then(() => {
                    showMessage("Verification email sent! Check your inbox.", "success");
                    logUserActivity(user);

                    const checkVerification = setInterval(() => {
                        user.reload().then(() => {
                            if (user.emailVerified) {
                                clearInterval(checkVerification); // Stop checking
                                showMessage("Email verified! Redirecting to Sign In...", "success");

                                setTimeout(() => {
                                    showSignIn();
                                }, 2000);
                            }
                        });
                    }, 500);
                })
                .catch((error) => {
                    console.error("Error sending verification email:", error);
                    showMessage(error.message);
                });
        })
        .catch((error) => {
            console.error("Error registering user:", error);
            showMessage(error.message);
        });
};

window.loginUser = async function () {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const name = document.getElementById("loginName").value;

    if (!email || !password || !name) {
        showMessage("Please enter all credentials.", "error");
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        document.getElementById("loginEmail").value = "";
        document.getElementById("loginPassword").value = "";
        document.getElementById("loginName").value = "";

        if (user.emailVerified) {
            showMessage("Login successful! Redirecting to home page.....Please wait as this may take some time.....", "success");

            sessionStorage.setItem("isLoggedIn", "true");

            // ✅ Log location info before redirect
            await logUserActivity(user);

            setTimeout(() => {
                window.location.href = "/";
            }, 8000);

        } else {
            showMessage("Please verify your email before logging in.", "error");
        }

    } catch (error) {
        console.error("Error logging in:", error);
        showMessage(error.message);
    }
};


