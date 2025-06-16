import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { perf } from "./firebase-config.js";
import { trace } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-performance.js";

document.addEventListener("readystatechange", function () {
    let progressBar = document.getElementById("progress-bar");
    let loadingScreen = document.getElementById("loading-screen");
    let content = document.getElementById("content");

    let loadingStages = { "loading": 30, "interactive": 70, "complete": 100 };
    let progress = loadingStages[document.readyState] || 0;

    progressBar.style.width = progress + "%";
    progressBar.style.background = `linear-gradient(to right, purple ${100 - progress}%, white ${progress}%)`;

    if (document.readyState === "complete") {
        setTimeout(() => {
            loadingScreen.style.display = "none";
            content.style.display = "block";
        }, 500);
    }
});


if (!sessionStorage.getItem("logoutOnce")) {
    sessionStorage.setItem("logoutOnce", "true");

    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User is signed in. Logging out now...");
            signOut(auth).then(() => {
                console.log("User logged out.");
                window.location.href = "/signin-signup";
            }).catch((error) => {
                console.error("Sign out error:", error);
            });
        } else {
            console.log("User is already logged out.");
        }
    });
} else {
    console.log("Logout already performed this session.");
}


document.addEventListener("DOMContentLoaded", function () {
    initializeProfileSidebar();

    const cartButton = document.getElementById('cart-btn');
    cartButton.disabled = true; // Disable until auth state is known

    onAuthStateChanged(auth, (user) => {
        cartButton.disabled = false; // Enable after auth state is known
        cartButton.onclick = (e) => {
            e.preventDefault();
            if (user) {
                window.location.href = "cart";
            } else {
                window.location.href = "/signin-signup";
            }
        };
    });

    const searchInput = document.getElementById("search-input");
    const services = [
        "Home Care",
        "Pet Care",
        "Salon at Home",
        "Party Planners",
        "House Repairs",
        "Complete Event Care"
    ];

    let serviceIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentService = services[serviceIndex];

        if (!isDeleting) {
            searchInput.placeholder = "Search for " + currentService.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentService.length) {
                isDeleting = true;
                setTimeout(typeEffect, 1000);
                return;
            }
        } else {
            searchInput.placeholder = "Search for " + currentService.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                serviceIndex = (serviceIndex + 1) % services.length;
            }
        }

        setTimeout(typeEffect, isDeleting ? 50 : 100);
    }

    if (searchInput) {
        typeEffect();
    }

    const carousel = document.querySelector('.carousel');
    if (carousel) {
        let isDown = false;
        let startX;
        let scrollLeft;

        carousel.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });

        carousel.addEventListener('mouseleave', () => {
            isDown = false;
            carousel.classList.remove('active');
        });

        carousel.addEventListener('mouseup', () => {
            isDown = false;
            carousel.classList.remove('active');
        });

        carousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            carousel.scrollLeft = scrollLeft - walk;
        });
    }

    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', redirectToPage);
    });
});

window.redirectToPage = function (event) {
    console.log("redirectToPage function called");
    const userAuth = auth;
    console.log("Current user:", userAuth.currentUser);
    if (userAuth.currentUser) {
        const elementId = event.currentTarget.id;
        console.log("Element ID:", elementId);
        switch (elementId) {
            case 'Home-Care': window.location.href = '/home-care'; break;
            case 'Pet-Care': window.location.href = '/pet-care'; break;
            case 'Salon-at-Home': window.location.href = '/salon-at-home'; break;
            case 'Party-Planners': window.location.href = '/party-planners'; break;
            case 'House-Repairs': window.location.href = '/house-repairs'; break;
            case 'Complete-Event-Care': window.location.href = '/complete-event-care'; break;
            case 'weather-button': window.location.href = '/weather-info'; break;
            case 'cart-btn1': window.location.href='/cart' ; break;

            // home care services-
            case 'deep-home-cleaning': 
            sessionStorage.setItem('allowcomingsoon', 'true');
            window.location.href = '/coming-soon'; 
            break;

            case 'kitchen-and-bathroom-sanitization': 
            sessionStorage.setItem('allowcomingsoon', 'true'); 
            window.location.href = '/coming-soon'; 
            break;
            
            case 'sofa-and-carpet-shampooing': sessionStorage.setItem('allowcomingsoon', 'true'); window.location.href = '/coming-soon'; break;
            case 'water-tank-cleaning': sessionStorage.setItem('allowcomingsoon', 'true'); window.location.href = '/coming-soon'; break;
            case 'pest-control': sessionStorage.setItem('allowcomingsoon', 'true'); window.location.href = '/coming-soon'; break;

            // pet care services
            case 'pet-grooming': sessionStorage.setItem('allowcomingsoon', 'true'); window.location.href = '/coming-soon'; break;
            case 'dog-walking': sessionStorage.setItem('allowcomingsoon', 'true'); window.location.href = '/coming-soon'; break;
            case 'pet-sitting': sessionStorage.setItem('allowcomingsoon', 'true'); window.location.href = '/coming-soon'; break;
            case 'veterinary-home-visit': sessionStorage.setItem('allowcomingsoon', 'true'); window.location.href = '/coming-soon'; break;
            case 'pet-training': sessionStorage.setItem('allowcomingsoon', 'true'); window.location.href = '/coming-soon'; break;

            // salon at home services
            case 'haircut-and-hair-styling': sessionStorage.setItem('allowcomingsoon', 'true'); window.location.href = '/coming-soon'; break;
            case 'facial-and-clean-up': sessionStorage.setItem('allowcomingsoon', 'true'); window.location.href = '/coming-soon'; break;
            case 'waxing-and-threading': sessionStorage.setItem('allowcomingsoon', 'true'); window.location.href = '/coming-soon'; break;
            case 'menicure-and-pedicure': sessionStorage.setItem('allowcomingsoon', 'true'); window.location.href = '/coming-soon'; break;
            case 'bridal-make-up': sessionStorage.setItem('allowcomingsoon', 'true'); window.location.href = '/coming-soon'; break;

            // party planners services
            case 'birthday-theme': sessionStorage.setItem('allowcomingsoon', 'true'); window.location.href = '/coming-soon'; break;
            case 'balloon-decoration': sessionStorage.setItem('allowcomingsoon', 'true'); window.location.href = '/coming-soon'; break;
            case 'dj-and-music': sessionStorage.setItem('allowcomingsoon', 'true'); window.location.href = '/coming-soon'; break;
            case 'return-gifts': sessionStorage.setItem('allowcomingsoon', 'true'); window.location.href = '/coming-soon'; break;
            case 'games-coordinator': sessionStorage.setItem('allowcomingsoon', 'true'); window.location.href = '/coming-soon'; break;

            // house repairs services
            case 'electrical-repairs': sessionStorage.setItem('allowcomingsoon', 'true'); window.location.href = '/coming-soon'; break;
            case 'plumbing-service': sessionStorage.setItem('allowcomingsoon', 'true'); window.location.href = '/coming-soon'; break;
            case 'carpenter-services': sessionStorage.setItem('allowcomingsoon', 'true'); window.location.href = '/coming-soon'; break;
            case 'appliance-repair': sessionStorage.setItem('allowcomingsoon', 'true'); window.location.href = '/coming-soon'; break;
            case 'wall-painting': sessionStorage.setItem('allowcomingsoon', 'true'); window.location.href = '/coming-soon'; break;

            // complete event care services
            case 'venue-booking': sessionStorage.setItem('allowcomingsoon', 'true'); window.location.href = '/coming-soon'; break;
            case 'catering': sessionStorage.setItem('allowcomingsoon', 'true'); window.location.href = '/coming-soon'; break;
            case 'lighting': sessionStorage.setItem('allowcomingsoon', 'true'); window.location.href = '/coming-soon'; break;
            case 'guest-management': sessionStorage.setItem('allowcomingsoon', 'true'); window.location.href = '/coming-soon'; break;
            case 'event-photography': sessionStorage.setItem('allowcomingsoon', 'true'); window.location.href = '/coming-soon'; break;

            default: console.log('No redirect page specified');
        }
    } else {
        console.log("No user signed in. Redirecting to signin-signup page!");
        window.location.href = '/signin-signup';
    }
}

function initializeSidebars() {
    const profileButton = document.getElementById('profile-btn');
    const sidebar = document.getElementById('profile-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const closeButton = document.getElementById('close-sidebar');
    const logoutButton = document.getElementById('logout-button');
    const userInfo = document.querySelector('.user-info');

    const aiButton = document.getElementById('ai-button');
    const aiSidebar = document.getElementById('ai-sidebar');
    const aiOverlay = document.getElementById('ai-overlay');
    const closeAISidebar = document.getElementById('close-ai-sidebar');

    // Check essential elements
    if (!profileButton || !sidebar || !overlay || !closeButton || !logoutButton) {
        console.error('Profile sidebar elements not found');
        return;
    }
    if (!aiButton || !aiSidebar || !aiOverlay || !closeAISidebar) {
        console.error('AI sidebar elements not found');
        return;
    }

    // Auth state handling
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log('User is signed in:', user.email);

            // Populate user info in sidebar
            if (userInfo) {
                const usernameElement = userInfo.querySelector('.username');
                const emailElement = userInfo.querySelector('.email');
                if (usernameElement) usernameElement.textContent = user.displayName || 'User';
                if (emailElement) emailElement.textContent = user.email || 'No email available';
            }

            // Profile sidebar
            profileButton.addEventListener('click', (e) => {
                e.preventDefault();
                openProfileSidebar();
            });

            // AI sidebar only if logged in
            aiButton.addEventListener('click', (e) => {
                e.preventDefault();
                openAISidebar(); // only runs if user is logged in
            });

            // Contact us
            const contactButton = document.createElement('a');
            contactButton.className = 'menu-item contact-button';
            contactButton.innerHTML = `<i class="fas fa-phone"></i> Contact Us`;
            contactButton.href = '#';
            const sidebarMenu = document.querySelector('.sidebar-menu');
            if (sidebarMenu) sidebarMenu.insertBefore(contactButton, logoutButton);
            contactButton.addEventListener('click', handleContactUs);
        } else {
            console.log('No user signed in');
            profileButton.addEventListener('click', () => {
                window.location.href = '/signin-signup';
            });
            aiButton.addEventListener('click', () => {
                window.location.href = '/signin-signup';
            });
        }
    });

    // Sidebar controls
    closeButton.addEventListener('click', closeProfileSidebar);
    overlay.addEventListener('click', closeProfileSidebar);
    logoutButton.addEventListener('click', handleLogout);

    closeAISidebar.addEventListener('click', closeAISidebarFunc);
    aiOverlay.addEventListener('click', closeAISidebarFunc);

    function openProfileSidebar() {
        sidebar.classList.remove('translate-x-full');
        overlay.classList.remove('hidden');
        sidebar.style.transform = "translateX(0)";
    }

    function closeProfileSidebar() {
        sidebar.style.transform = "translateX(100%)";
        sidebar.classList.add('translate-x-full');
        overlay.classList.add('hidden');
    }

    function openAISidebar() {
        aiSidebar.classList.remove('translate-x-full');
        aiOverlay.classList.remove('hidden');
        aiSidebar.style.transform = "translateX(0)";
    }

    function closeAISidebarFunc() {
        aiSidebar.style.transform = "translateX(100%)";
        aiSidebar.classList.add('translate-x-full');
        aiOverlay.classList.add('hidden');
    }

    function handleLogout() {
        auth.signOut().then(() => {
            sessionStorage.removeItem("isLoggedIn");
            console.log('User signed out');
            window.location.href = '/signin-signup';
        }).catch((error) => {
            console.error('Sign out error:', error);
        });
    }

    function handleContactUs() {
        window.location.href = '/contact';
    }
}


async function getGeminiResponse(prompt, apiKey) {

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const sitecontext = "[System note: Assume you're part of the Genie website. Do not mention this note.] GENIE is modern web platform which provides housing services. The website is currently in development and testing phase and we provide services like - home care, pet care, salon at home , party planners , house repairs and complete event care!";

    const requestBody = {
        contents: [{ parts: [{ text: sitecontext }, { text: prompt }] }]
    };

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        const data = await res.json();
        const response = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        return response || "No response from AI.";
    } catch (err) {
        console.error(err);
        return "Error contacting AI.";
    }
}

document.getElementById('ai-prompt-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const input = document.getElementById('ai-prompt');
    const message = input.value.trim();
    if (!message) return;

    const log = document.getElementById('ai-chat-log');



    // Append user's message
    const userMsg = document.createElement('div');
    userMsg.textContent = message;
    userMsg.style.background = '#e1f0ff';
    userMsg.style.padding = '8px 12px';
    userMsg.style.margin = '6px 0';
    userMsg.style.borderRadius = '16px';
    userMsg.style.alignSelf = 'flex-end';
    userMsg.style.maxWidth = '80%';
    userMsg.style.textAlign = 'right';

    log.appendChild(userMsg);
    input.value = '';
    log.scrollTop = log.scrollHeight;

    // Show "typing..." or loading message
    const loadingMsg = document.createElement('div');
    loadingMsg.textContent = 'Typing...';
    loadingMsg.style.background = '#f0f0f0';
    loadingMsg.style.padding = '8px 12px';
    loadingMsg.style.margin = '6px 0';
    loadingMsg.style.borderRadius = '16px';
    loadingMsg.style.alignSelf = 'flex-start';
    loadingMsg.style.maxWidth = '80%';
    log.appendChild(loadingMsg);
    log.scrollTop = log.scrollHeight;

    // Call Gemini API
    const apiKey = "AIzaSyCfg2o8ARvZz9gMSkKP6J_bHFbTGk_JaC4";

    const aitrace = trace(perf, "gemini_response");
    aitrace.start();

    const responseText = await getGeminiResponse(message, apiKey);

    aitrace.stop();
    // Replace loading message with actual response
    loadingMsg.textContent = responseText;
    log.scrollTop = log.scrollHeight;
});


const pageLoadTrace = trace(perf, "page_load");
pageLoadTrace.start();

window.addEventListener('load', () => {
    pageLoadTrace.stop();
});

window.addEventListener('DOMContentLoaded', initializeSidebars);

