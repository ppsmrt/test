// 📁 header.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDt86oFFa-h04TsfMWSFGe3UHw26WYoR-U",
  authDomain: "tamilgeoapp.firebaseapp.com",
  databaseURL: "https://tamilgeoapp-default-rtdb.firebaseio.com",
  projectId: "tamilgeoapp",
  storageBucket: "tamilgeoapp.appspot.com",
  messagingSenderId: "1092623024431",
  appId: "1:1092623024431:web:ea455dd68a9fcf480be1da"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
  const placeholder = document.getElementById("shared-header");

  onAuthStateChanged(auth, (user) => {
    let navContent = "";

    if (user) {
      navContent = `
        <div class="flex items-center gap-3 text-sm font-medium">
          <!-- Home -->
          <a href="index.html" class="flex items-center gap-1 text-gray-700 hover:text-green-600">
            <i class="fa-regular fa-house"></i> Home
          </a>

          <!-- Account -->
          <a href="dashboard.html" class="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition">
            <i class="fa-regular fa-circle-user"></i> Account
          </a>

          <!-- Sign Out -->
          <button id="logout-btn" class="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full hover:bg-red-200 transition">
            <i class="fa-solid fa-xmark"></i> Sign out
          </button>
        </div>
      `;
    } else {
      navContent = `
        <div class="flex items-center gap-4 text-sm font-medium">
          <!-- Home -->
          <a href="index.html" class="flex items-center gap-1 text-gray-700 hover:text-green-600">
            <i class="fa-regular fa-house"></i> Home
          </a>

          <!-- Login -->
          <a href="login.html" class="text-gray-700 hover:text-green-600">Login</a>

          <!-- Sign Up -->
          <a href="signup.html" class="text-gray-700 hover:text-green-600">Sign Up</a>
        </div>
      `;
    }

    const headerHTML = `
      <header class="flex justify-between items-center bg-white shadow px-4 py-3 sticky top-0 z-50">
        <a href="index.html" class="text-2xl font-bold text-green-600">TamilGeo</a>
        ${navContent}
      </header>
    `;

    if (placeholder) {
      placeholder.innerHTML = headerHTML;

      const logoutBtn = document.getElementById("logout-btn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          signOut(auth).then(() => {
            window.location.href = "index.html";
          });
        });
      }
    }
  });
});
