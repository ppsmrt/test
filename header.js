onAuthStateChanged(auth, async (user) => {
  let navContent = "";

  if (user) {
    const role = await getUserRole(user.uid);
    const accountPage = (role === "admin" || role === "manager") ? "dashboard.html" : "account.html";

    // Get unread notifications count
    const unreadCount = await getUnreadNotificationCount(user.uid);
    const shakeClass = unreadCount > 0 ? "shake" : "";

    if (currentPath.endsWith("account.html")) {
      navContent = `
        <nav class="flex gap-2 text-sm font-medium items-center">
          <a href="notifications.html" aria-label="Notifications" class="relative text-gray-700 hover:text-gray-900 text-2xl">
            <i class="fa-solid fa-bell ${shakeClass}"></i>
            <span id="notif-count" class="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 ${unreadCount === 0 ? 'hidden' : ''}">
              ${unreadCount}
            </span>
          </a>
        </nav>
      `;
    } else {
      navContent = `
        <nav class="flex gap-2 text-sm font-medium items-center">
          ${!isHomePage ? `
            <a href="index.html" class="px-4 py-1 rounded-full bg-green-600 text-white hover:bg-green-700 transition">
              Home
            </a>` : ""}
          <a href="${accountPage}" class="px-4 py-1 rounded-full border border-green-600 text-green-600 bg-white hover:bg-green-50 transition">
            Account
          </a>
          <button id="logout-btn" class="px-4 py-1 rounded-full bg-red-600 text-white hover:bg-red-700 transition">
            Sign out
          </button>
          <a href="notifications.html" aria-label="Notifications" class="relative text-gray-700 hover:text-gray-900 text-2xl">
            <i class="fa-solid fa-bell ${shakeClass}"></i>
            <span id="notif-count" class="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 ${unreadCount === 0 ? 'hidden' : ''}">
              ${unreadCount}
            </span>
          </a>
        </nav>
      `;

      // Attach logout handler after DOM update
      setTimeout(() => {
        const logoutBtn = document.getElementById("logout-btn");
        if (logoutBtn) {
          logoutBtn.addEventListener("click", () => {
            signOut(auth)
              .then(() => {
                window.location.href = "index.html";
              })
              .catch(err => console.error("Sign out error:", err));
          });
        }
      }, 10);
    }
  } else {
    // Not logged in
    navContent = `
      <nav class="flex gap-2 text-sm font-medium">
        ${!isHomePage ? `
          <a href="index.html" class="px-4 py-1 rounded-full bg-green-600 text-white hover:bg-green-700 transition">
            Home
          </a>` : ""}
        <a href="login.html" class="px-4 py-1 rounded-full border border-gray-400 text-gray-700 hover:bg-gray-100 transition">
          Login
        </a>
        <a href="signup.html" class="px-4 py-1 rounded-full border border-gray-400 text-gray-700 hover:bg-gray-100 transition">
          Sign Up
        </a>
      </nav>
    `;
  }

  const headerHTML = `
    <header class="flex justify-between items-center bg-white shadow px-4 py-3 sticky top-0 z-50">
      <a href="index.html" class="text-xl sm:text-2xl font-bold text-green-600">TamilGeo</a>
      ${navContent}
    </header>
  `;

  if (placeholder) {
    placeholder.innerHTML = headerHTML;
  } else {
    console.warn("⚠️ shared-header element not found in DOM");
  }
}, err => {
  console.error("🔥 Firebase auth error:", err);
});