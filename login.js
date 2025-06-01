document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const foundUser = users.find(user => user.email === email && user.password === password);
  // const foundUser = true;

  if (foundUser) {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("user", JSON.stringify(foundUser));
    window.location.href = "/store-1/store.html";
  } else {
    document.getElementById("loginMessage").textContent = "Email or password is incorrect.";
  }
});

