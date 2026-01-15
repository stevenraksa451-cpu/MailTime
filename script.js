const loginBtn = document.getElementById("loginBtn");
const mainLoginBtn = document.getElementById("mainLoginBtn");
const avatar = document.getElementById("avatar");
const landing = document.getElementById("landing");
const dashboard = document.getElementById("dashboard");
const emailsContainer = document.getElementById("emails");

/* ===== LOGIN ===== */
function startLogin() {
  window.open(
    "http://127.0.0.1:3001/auth/google",
    "_blank",
    "width=500,height=600"
  );
}

loginBtn.onclick = startLogin;
mainLoginBtn.onclick = startLogin;

/* ===== POST MESSAGE GOOGLE ===== */
window.addEventListener("message", async (event) => {
  if (event.origin !== "http://127.0.0.1:3001") return;
  if (event.data?.type !== "AUTH_SUCCESS") return;

  await loadUser();
});

/* ===== LOAD USER ===== */
async function loadUser() {
  const res = await fetch("http://127.0.0.1:3001/me", {
    credentials: "include"
  });

  if (!res.ok) return;

  const user = await res.json();

  landing.style.display = "none";
  dashboard.style.display = "block";

  avatar.src = user.picture;
  avatar.style.display = "block";

  document.getElementById("userName").textContent = user.name;
  document.getElementById("userEmail").textContent = user.email;

  loadEmails();
}

/* ===== EMAILS ===== */
async function loadEmails() {
  const res = await fetch("http://127.0.0.1:3001/emails/today", {
    credentials: "include"
  });

  if (!res.ok) return;

  const emails = await res.json();
  emailsContainer.innerHTML = "";

  emails.forEach(e => {
    const div = document.createElement("div");
    div.className = "email-card";
    div.innerHTML = `<strong>${e.from}</strong><p>${e.subject}</p>`;
    emailsContainer.appendChild(div);
  });
}

/* ===== AUTO SESSION ===== */
loadUser();
