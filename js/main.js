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

// ✅ Function to render posts
function displayPosts(posts) {
  container.innerHTML = ""; // Clear old posts
  posts.forEach(post => {
    const authorName = "TamilGeo";

    const image = post.jetpack_featured_media_url
      ? `<img src="${post.jetpack_featured_media_url}" class="w-full h-40 object-cover rounded-t-md">`
      : "";

    const postHTML = `
      <a href="post.html?id=${post.id}" class="block bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
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
    `;
    container.innerHTML += postHTML;
  });
}

// ✅ Utility to strip HTML from excerpt
function stripHTML(html) {
  let div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}