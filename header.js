// 📁 js/header.js

document.addEventListener("DOMContentLoaded", () => {
  const headerHTML = `
  <header class="flex justify-between items-center bg-white shadow px-4 py-3 sticky top-0 z-50">
    <h1 class="text-2xl font-bold text-green-600">TamilGeo</h1>
    <nav class="flex space-x-4">
      <a href="index.html" class="text-gray-700 hover:text-green-600 font-medium">Home</a>
      <a href="about.html" class="text-gray-700 hover:text-green-600 font-medium">About</a>
      <a href="bookmarks.html" class="text-gray-700 hover:text-green-600 font-medium">Bookmarks</a>
    </nav>
  </header>
  `;

  const placeholder = document.getElementById("shared-header");
  if (placeholder) {
    placeholder.innerHTML = headerHTML;
  }
});