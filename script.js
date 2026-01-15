let isAuthenticating = false;

const loginBtn = document.getElementById("loginBtn");
const mainLoginBtn = document.getElementById("mainLoginBtn");
const avatar = document.getElementById("avatar");

// LOGIN BUTTONS
loginBtn.onclick = startLogin;
mainLoginBtn.onclick = startLogin;

function startLogin() {
  if (isAuthenticating) return;
  isAuthenticating = true;

  // Ouvre Google OAuth
  window.open(
    "http://127.0.0.1:3001/auth/google",
    "_blank",
    "width=500,height=600"
  );
}

// CHECK SESSION
async function checkSession() {
  try {
    const res = await fetch("http://127.0.0.1:3001/me", {
      credentials: "include"
    });

    if (!res.ok) return;

    const user = await res.json();
    if (!user || !user.email) return;

    onConnected(user);
  } catch (err) {
    console.error(err);
  }
}

// CONNECTED
function onConnected(user) {
  isAuthenticating = false;

  document.getElementById("landing").style.display = "none";
  document.getElementById("dashboard").style.display = "block";

  avatar.src = user.picture;
  avatar.style.display = "block";

  loginBtn.style.display = "none";
  mainLoginBtn.style.display = "none";

  document.getElementById("userName").innerText = user.name;
  document.getElementById("userEmail").innerText = user.email;

  loadEmails();
}

// AVATAR MENU
avatar.onclick = () => {
  const menu = document.getElementById("userMenu");
  menu.style.display =
    menu.style.display === "block" ? "none" : "block";
};

// LOGOUT
document.getElementById("logoutBtn").onclick = async () => {
  await fetch("http://127.0.0.1:3001/logout", {
    method: "POST",
    credentials: "include"
  });
  location.reload();
};

// LOAD EMAILS
async function loadEmails() {
  const res = await fetch("http://127.0.0.1:3001/emails/today", {
    credentials: "include"
  });

  if (!res.ok) return;

  const emails = await res.json();
  if (!Array.isArray(emails)) return;

  const container = document.getElementById("emails");
  container.innerHTML = "";

  emails.forEach(email => {
    const card = document.createElement("div");
    card.className = "email-card";
    card.innerHTML = `
      <strong>${email.from}</strong>
      <p>${email.subject}</p>
      <em>Résumé : ${fakeSummary(email.subject)}</em>
    `;
    container.appendChild(card);
  });
}

// FAKE IA SUMMARY
function fakeSummary(subject) {
  return `Email important concernant : "${subject}"`;
}

// AUTO CHECK
document.addEventListener("DOMContentLoaded", () => {
  checkSession();
});

// HANDLE MESSAGE FROM GOOGLE OAUTH
window.addEventListener("message", async (event) => {
  if (event.origin !== "http://127.0.0.1:3001") return;
  if (event.data?.type !== "AUTH_SUCCESS") return;

  const res = await fetch("http://127.0.0.1:3001/me", {
    credentials: "include"
  });

  if (!res.ok) return;

  const user = await res.json();
  onConnected(user);
});
const API = "http://127.0.0.1:3001";

/* =====================
   PAGE LOGIN
===================== */
const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    window.location.href = `${API}/auth/google`;
  });
}

/* =====================
   PAGE DASHBOARD
===================== */
async function loadDashboard() {
  try {
    const res = await fetch(`${API}/me`, {
      credentials: "include"
    });

    if (!res.ok) {
      window.location.href = "index.html";
      return;
    }

    const user = await res.json();
    showUser(user);
    loadEmails();

  } catch (e) {
    console.error(e);
  }
}

function showUser(user) {
  document.getElementById("avatar").src = user.picture;
  document.getElementById("userName").textContent = user.name;
  document.getElementById("userEmail").textContent = user.email;
}

async function loadEmails() {
  const res = await fetch(`${API}/emails`, {
    credentials: "include"
  });

  const emails = await res.json();
  const container = document.getElementById("emails");

  emails.forEach(mail => {
    const div = document.createElement("div");
    div.className = "email-card";
    div.innerHTML = `
      <strong>${mail.from}</strong>
      <p>${mail.summary}</p>
      <em>${mail.date}</em>
    `;
    container.appendChild(div);
  });
}

/* =====================
   MENU AVATAR
===================== */
const avatar = document.getElementById("avatar");
const menu = document.getElementById("userMenu");

if (avatar) {
  avatar.addEventListener("click", () => {
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  });

  document.getElementById("logoutBtn").addEventListener("click", async () => {
    await fetch(`${API}/logout`, { credentials: "include" });
    window.location.href = "index.html";
  });

  loadDashboard();
}
