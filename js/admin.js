
const baseUrl = "https://holly-messy-navy.glitch.me/books";

function checkAdmin() {
  const loginData = JSON.parse(localStorage.getItem("loginData"));
  if (!loginData || loginData.email !== "admin@empher.com") {
    alert("Admin Not Logged In");
    window.location.href = "index.html";
  }
}

function renderBooks(books) {
  const grid = document.getElementById("books-grid");
  grid.innerHTML = books.map((book) => `
    <div>
      <img src="${book.imageUrl}" alt="${book.title}" />
      <p>Title: ${book.title}</p>
      <p>Author: ${book.author}</p>
      <p>Category: ${book.category}</p>
      <p>Status: ${book.isAvailable ? "Available" : "Borrowed"}</p>
      <button onclick="verifyBook(${book.id})" ${book.isVerified ? "disabled" : ""}>Verify</button>
      <button onclick="deleteBook(${book.id})">Delete</button>
    </div>
  `).join("");
}

function fetchBooks() {
  fetch(baseUrl)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch books");
      return res.json();
    })
    .then(renderBooks)
    .catch((err) => alert(err.message));
}

function addBook(e) {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const category = document.getElementById("category").value;

  fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      author,
      category,
      isAvailable: true,
      isVerified: false,
      borrowedDays: null,
      imageUrl: "https://m.media-amazon.com/images/I/71ZB18P3inL._SY522_.jpg",
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to add book");
      return res.json();
    })
    .then(() => {
      alert("Book Added Successfully");
      fetchBooks();
    })
    .catch((err) => alert(err.message));
}

function verifyBook(id) {
  if (confirm("Are you sure to Verify..?")) {
    fetch(`${baseUrl}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isVerified: true }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to verify book");
        return res.json();
      })
      .then(() => {
        alert("Book Verified Successfully");
        fetchBooks();
      })
      .catch((err) => alert(err.message));
  }
}

function deleteBook(id) {
  if (confirm("Are you sure to Delete..?")) {
    fetch(`${baseUrl}/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete book");
        return res.json();
      })
      .then(() => {
        alert("Book Deleted Successfully");
        fetchBooks();
      })
      .catch((err) => alert(err.message));
  }
}

document.getElementById("book-form").addEventListener("submit", addBook);

checkAdmin();
fetchBooks();
