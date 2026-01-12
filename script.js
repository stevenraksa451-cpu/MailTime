const loginBtn = document.getElementById("loginBtn");
const mainLoginBtn = document.getElementById("mainLoginBtn");
const avatar = document.getElementById("avatar");
const landing = document.getElementById("landing");
const dashboard = document.getElementById("dashboard");
const emailsDiv = document.getElementById("emails");

function login() {
  window.open(
    "http://127.0.0.1:3001/auth/google",
    "_blank",
    "width=500,height=600"
  );
}

loginBtn.onclick = login;
mainLoginBtn.onclick = login;

async function checkAuth() {
  const res = await fetch("http://127.0.0.1:3001/me");
  if (!res.ok) return;

  const user = await res.json();

  loginBtn.style.display = "none";
  mainLoginBtn.style.display = "none";
  avatar.src = user.picture;
  avatar.style.display = "block";

  landing.style.display = "none";
  dashboard.style.display = "block";

  loadEmails();
}

async function loadEmails() {
  const res = await fetch("http://127.0.0.1:3001/emails/today");
  const emails = await res.json();

  emailsDiv.innerHTML = "";
  if (!emails.length) {
    emailsDiv.innerHTML = "<p>Aucun email aujourd’hui.</p>";
    return;
  }

  emails.forEach(e => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${e.from}</strong><br>${e.subject}`;
    emailsDiv.appendChild(div);
  });
}

checkAuth();
