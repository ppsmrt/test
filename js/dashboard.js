// dashboard.js import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js"; import { getAuth, onAuthStateChanged, updatePassword, signOut, } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"; import { getDatabase, ref, get, set, update, onValue, remove, } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = { apiKey: "AIzaSyDt86oFFa-h04TsfMWSFGe3UHw26WYoR-U", authDomain: "tamilgeoapp.firebaseapp.com", databaseURL: "https://tamilgeoapp-default-rtdb.firebaseio.com", projectId: "tamilgeoapp", storageBucket: "tamilgeoapp.appspot.com", messagingSenderId: "1092623024431", appId: "1:1092623024431:web:ea455dd68a9fcf480be1da", };

const app = initializeApp(firebaseConfig); const auth = getAuth(app); const db = getDatabase(app);

onAuthStateChanged(auth, async (user) => { if (!user) return; const userRef = ref(db, users/${user.uid}); const snapshot = await get(userRef);

if (!snapshot.exists()) return; const data = snapshot.val(); const isAdmin = data.role === "admin";

document.getElementById("name").value = data.name || ""; document.getElementById("username").value = data.username || ""; document.getElementById("photoURL").value = data.photoURL || "";

// Hide quick actions for admin if (isAdmin) { document.getElementById("user-actions").classList.add("hidden"); }

// Load live analytics loadAnalytics();

// Load all users (for admin) if (isAdmin) loadUsers();

// Load submitted posts (for admin) if (isAdmin) loadSubmittedPosts(); });

async function loadAnalytics() { const usersRef = ref(db, "users"); const usersSnap = await get(usersRef); const totalUsers = usersSnap.exists() ? Object.keys(usersSnap.val()).length : 0; document.getElementById("analytics-users").textContent = totalUsers; }

async function loadUsers() { const usersRef = ref(db, "users"); const snap = await get(usersRef); if (!snap.exists()) return; const users = snap.val(); const tbody = document.getElementById("user-table"); tbody.innerHTML = "";

Object.entries(users).forEach(([uid, user]) => { const tr = document.createElement("tr"); tr.innerHTML = <td class="p-2">${user.name || "-"}</td> <td class="p-2">${user.email}</td> <td class="p-2">${user.role || "user"}</td> <td class="p-2">${user.username || "-"}</td> <td class="p-2 text-blue-600 underline cursor-pointer">Edit</td>; tbody.appendChild(tr); }); }

async function loadSubmittedPosts() { const postsRef = ref(db, "submissions"); const snap = await get(postsRef); if (!snap.exists()) return;

const posts = snap.val(); const tbody = document.getElementById("post-table"); tbody.innerHTML = "";

Object.entries(posts).forEach(([postId, post]) => { const tr = document.createElement("tr"); tr.innerHTML = <td class="p-2">${post.title}</td> <td class="p-2">${post.author || "Unknown"}</td> <td class="p-2">${post.date || "-"}</td> <td class="p-2">${post.status || "pending"}</td> <td class="p-2 space-x-2"> <button class="bg-green-500 text-white px-2 py-1 rounded text-sm" onclick="approvePost('${postId}')">Approve</button> <button class="bg-red-500 text-white px-2 py-1 rounded text-sm" onclick="rejectPost('${postId}')">Reject</button> </td>; tbody.appendChild(tr); }); }

window.approvePost = async function (postId) { const postRef = ref(db, submissions/${postId}); await update(postRef, { status: "approved" }); loadSubmittedPosts(); };

window.rejectPost = async function (postId) { const postRef = ref(db, submissions/${postId}); await update(postRef, { status: "rejected" }); loadSubmittedPosts(); };

// Handle profile save const profileForm = document.getElementById("profile-form"); profileForm.addEventListener("submit", async (e) => { e.preventDefault(); const user = auth.currentUser; if (!user) return;

const updates = { name: document.getElementById("name").value, photoURL: document.getElementById("photoURL").value, }; await update(ref(db, users/${user.uid}), updates);

const newPassword = document.getElementById("newPassword").value; if (newPassword) await updatePassword(user, newPassword);

alert("✅ Profile updated!"); });

