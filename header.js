// 📁 header.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  get
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

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
const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {
  const placeholder = document.getElementById("shared-header");

  onAuthStateChanged(auth, async (user) => {
    let navContent = "";

    if (user) {
      // ✅ Get user's full name (displayName)
      const userRef = ref(db, "users/" + user.uid);
      const snapshot = await get(userRef);
      const userData = snapshot.val();

      const name = userData?.displayName || "User";

      navContent = `
        <div class="flex items-center space-x-4">
          <a href="dashboard.html" class="text-sm font-medium text-gray-800 bg-green-100 px-3 py-1 rounded-full hover:underline">${name}</a>
          <button id="logout-btn" class="text-sm font-medium text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded">Sign Out</button>
        </div>
      `;
    } else {
      navContent = `
        <nav class="flex space-x-4">
          <a href="login.html" class="text-sm font-medium text-gray-700 hover:text-green-600">Login</a>
          <a href="signup.html" class="text-sm font-medium text-gray-700 hover:text-green-600">Sign Up</a>
        </nav>
      `;
    }

    const headerHTML = `
      <header class="flex justify-between items-center bg-white shadow px-4 py-3 sticky top-0 z-50">
        <h1 class="text-2xl font-bold text-green-600">TamilGeo</h1>
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