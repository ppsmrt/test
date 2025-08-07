import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDt86oFFa-h04TsfMWSFGe3UHw26WYoR-U",
  authDomain: "tamilgeoapp.firebaseapp.com",
  databaseURL: "https://tamilgeoapp-default-rtdb.firebaseio.com",
  projectId: "tamilgeoapp",
  storageBucket: "tamilgeoapp.appspot.com",
  messagingSenderId: "1092623024431",
  appId: "1:1092623024431:web:ea455dd68a9fcf480be1da"
};

// ✅ Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const blogURL = "https://public-api.wordpress.com/wp/v2/sites/tamilgeo.wordpress.com";
const container = document.getElementById("posts-container");
const searchInput = document.getElementById("searchInput");
const loadMoreBtn = document.getElementById("loadMoreBtn");

let currentPage = 1;
const postsPerPage = 6;
let totalPages = null;
let isLoading = false;
let isLoggedIn = false;

// ✅ Track auth state
onAuthStateChanged(auth, user => {
  isLoggedIn = !!user;
  container.innerHTML = "";      // Clear previous content
  currentPage = 1;               // Reset pagination
  fetchPosts();                  // Re-render posts with correct bookmark visibility
});

// ✅ Search functionality
searchInput?.addEventListener("input", (e) => {
  const query = e.target.value.trim();
  currentPage = 1;
  if (query.length > 2) {
    fetch(`${blogURL}/posts?search=${query}&per_page=${postsPerPage}&page=1`)
      .then(res => res.json())
      .then(posts => {
        container.innerHTML = "";
        displayPosts(posts);
        loadMoreBtn.style.display = "none";
      });
  } else {
    container.innerHTML = "";
    fetchPosts();
  }
});

// ✅ Load More functionality
loadMoreBtn?.addEventListener("click", () => {
  if (!isLoading) {
    currentPage++;
    fetchPosts();
  }
});

// ✅ Fetch posts
function fetchPosts() {
  isLoading = true;
  fetch(`${blogURL}/posts?per_page=${postsPerPage}&page=${currentPage}`)
    .then(res => {
      totalPages = parseInt(res.headers.get("X-WP-TotalPages"));
      return res.json();
    })
    .then(posts => {
      displayPosts(posts);
      isLoading = false;

      // Toggle Load More
      loadMoreBtn.style.display = currentPage >= totalPages ? "none" : "block";
    })
    .catch(err => console.error("Error fetching posts:", err));
}

// ✅ Strip HTML tags
function stripHTML(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

// ✅ Format "time ago"
function timeAgo(dateString) {
  const now = new Date();
  const postDate = new Date(dateString);
  const diff = Math.floor((now - postDate) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;

  return postDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

// ✅ Display posts
function displayPosts(posts) {
  const bookmarkedIds = JSON.parse(localStorage.getItem("bookmarkedPosts") || "[]");

  posts.forEach(post => {
    const isBookmarked = bookmarkedIds.includes(post.id);
    const authorName = "TamilGeo";

    const image = post.jetpack_featured_media_url
      ? `<img src="${post.jetpack_featured_media_url}" class="w-full h-40 object-cover rounded-t-md">`
      : "";

    const bookmarkBtn = isLoggedIn
      ? `
        <button
          class="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-green-100 transition text-green-600 text-xl bookmark-btn"
          data-id="${post.id}"
          title="${isBookmarked ? 'Remove Bookmark' : 'Add to Bookmarks'}"
        >
          ${isBookmarked ? '✅' : '📌'}
        </button>
      `
      : "";

    const postHTML = `
      <div class="relative group">
        <a href="post.html?id=${post.id}" class="block bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition duration-300 transform hover:-translate-y-1 card">
          ${image}
          <div class="p-4">
            <h2 class="text-lg font-bold mb-2">${post.title.rendered}</h2>
            <p class="text-sm text-gray-600 mb-2">${stripHTML(post.excerpt.rendered).slice(0, 100)}...</p>
            <div class="flex justify-between text-xs text-gray-500 mt-4">
              <span>👤 ${authorName}</span>
              <span>🗓️ ${timeAgo(post.date)}</span>
            </div>
          </div>
        </a>
        ${bookmarkBtn}
      </div>
    `;

    container.innerHTML += postHTML;
  });

  // ✅ Bookmark click events (only if logged in)
  if (isLoggedIn) {
    document.querySelectorAll(".bookmark-btn").forEach(button => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        const id = parseInt(this.dataset.id);
        let bookmarks = JSON.parse(localStorage.getItem("bookmarkedPosts") || "[]");

        if (bookmarks.includes(id)) {
          bookmarks = bookmarks.filter(bid => bid !== id);
          this.innerText = "📌";
          this.title = "Add to Bookmarks";
        } else {
          bookmarks.push(id);
          this.innerText = "✅";
          this.title = "Remove Bookmark";
        }

        localStorage.setItem("bookmarkedPosts", JSON.stringify(bookmarks));
      });
    });
  }
}