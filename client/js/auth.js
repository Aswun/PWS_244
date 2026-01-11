const API_URL = "http://localhost:3007/api";

/* =====================
   LOGIN
===================== */
function login() {
  fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      if (data.role === "admin") {
        window.location.href = "admin-dashboard.html";
      } else {
        window.location.href = "user-dashboard.html";
      }
    } else {
      document.getElementById("message").innerText = data.message;
    }
  })
  .catch(err => {
    document.getElementById("message").innerText = "Server error";
  });
}

/* =====================
   REGISTER
===================== */
function register() {
  fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("message").innerText = data.message;

    if (data.message === "Register success") {
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1000);
    }
  })
  .catch(err => {
    document.getElementById("message").innerText = "Server error";
  });
}
