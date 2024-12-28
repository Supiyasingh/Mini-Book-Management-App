document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (email === "admin@empher.com" && password === "empher@123") {
    alert("Logged in as Admin");
    localStorage.setItem("loginData", JSON.stringify({ email, role: "admin" }));
    window.location.href = "admin.html";
  } else if (email === "user@empher.com" && password === "user@123") {
    alert("Logged in as User");
    localStorage.setItem("loginData", JSON.stringify({ email, role: "user" }));
    window.location.href = "books.html";
  } else {
    document.getElementById("error-message").innerText = "Invalid Credentials!";
  }
});

