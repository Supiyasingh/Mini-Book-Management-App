const baseUrl = "https://holly-messy-navy.glitch.me/books";

function checkUser() {
  const loginData = JSON.parse(localStorage.getItem("loginData"));
  if (!loginData || loginData.email !== "user@empher.com") {
    alert("User Not Logged In");
    window.location.href = "index.html";
  }
}

function renderBooks(books, isAvailable) {
  const grid = document.getElementById("books-grid");
  grid.innerHTML = books.map((book) => `
    <div>
      <img src="${book.imageUrl}" alt="${book.title}" />
      <p>Title: ${book.title}</p>
      <p>Author: ${book.author}</p>
      <p>Category: ${book.category}</p>
      <p>Status: ${isAvailable ? "Available" : `Borrowed (${book.borrowedDays} days)`}</p>
      <button onclick="${isAvailable ? `borrowBook(${book.id})` : `returnBook(${book.id})`}">
        ${isAvailable ? "Borrow Book" : "Return Book"}
      </button>
    </div>
  `).join("");
}

function fetchBooks(filter) {
  fetch(baseUrl)
    .then((res) => res.json())
    .then((books) => renderBooks(books.filter(filter), filter === "isAvailable"));
}

function borrowBook(id) {
  const days = prompt("Enter Borrowing Duration (Max 10 days):");
  if (days > 10) return alert("Maximum borrowing limit is 10 days.");

  fetch(`${baseUrl}${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isAvailable: false, borrowedDays: days }),
  }).then(() => {
    alert("Book Borrowed Successfully");
    fetchBooks((b) => b.isAvailable);
  });
}

function returnBook(id) {
  if (confirm("Are you sure to return book..?")) {
    fetch(`${baseUrl}${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: true, borrowedDays: null }),
    }).then(() => {
      alert("Book Returned Successfully");
      fetchBooks((b) => !b.isAvailable);
    });
  }
}

document.getElementById("available-books").addEventListener("click", () => fetchBooks((b) => b.isAvailable));
document.getElementById("borrowed-books").addEventListener("click", () => fetchBooks((b) => !b.isAvailable));

checkUser();
