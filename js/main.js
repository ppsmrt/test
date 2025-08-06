const blogURL = "https://public-api.wordpress.com/wp/v2/sites/tamilgeo.wordpress.com";
const container = document.getElementById("posts-container");
const searchInput = document.getElementById("searchInput");

// ✅ Fetch & display initial posts
fetch(`${blogURL}/posts`)
  .then(res => res.json())
  .then(displayPosts)
  .catch(err => console.error('Error fetching posts:', err));

// ✅ Search posts as user types
searchInput?.addEventListener("input", (e) => {
  const query = e.target.value.trim();
  if (query.length > 2) {
    fetch(`${blogURL}/posts?search=${query}`)
      .then(res => res.json())
      .then(displayPosts)
      .catch(err => console.error("Search error:", err));
  } else {
    fetch(`${blogURL}/posts`)
      .then(res => res.json())
      .then(displayPosts);
  }
});

// ✅ Utility to strip HTML from excerpt
function stripHTML(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

// ✅ Display posts
function displayPosts(posts) {
  container.innerHTML = ""; // Clear old posts

  const bookmarkedIds = JSON.parse(localStorage.getItem("bookmarkedPosts") || "[]");

  posts.forEach(post => {
    const isBookmarked = bookmarkedIds.includes(post.id);
    const authorName = "TamilGeo";

    const image = post.jetpack_featured_media_url
      ? `<img src="${post.jetpack_featured_media_url}" class="w-full h-40 object-cover rounded-t-md">`
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
              <span>🗓️ ${new Date(post.date).toLocaleDateString()}</span>
            </div>
          </div>
        </a>

        <!-- 📌 Bookmark Button -->
        <button
          class="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-green-100 transition text-green-600 text-xl bookmark-btn"
          data-id="${post.id}"
          title="${isBookmarked ? 'Remove Bookmark' : 'Add to Bookmarks'}"
        >
          ${isBookmarked ? '✅' : '📌'}
        </button>
      </div>
    `;

    container.innerHTML += postHTML;
  });

  // ✅ Bookmark Button Events
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