
/* =====================
   VARIABLES
===================== */
let isAuthenticating = false;

const loginBtn = document.getElementById("loginBtn");
const mainLoginBtn = document.getElementById("mainLoginBtn");
const avatar = document.getElementById("avatar");

/* =====================
   LOADER
===================== */
function showLoader() {
  document.getElementById("loadingOverlay").style.display = "flex";
}

function hideLoader() {
  document.getElementById("loadingOverlay").style.display = "none";
}

/* =====================
   LOGIN
===================== */
loginBtn.onclick = startLogin;
mainLoginBtn.onclick = startLogin;

function startLogin() {
  if (isAuthenticating) return;

  isAuthenticating = true;
  showLoader();

  window.open(
    "http://127.0.0.1:3001/auth/google",
    "_blank",
    "width=500,height=600"
  );
}

/* =====================
   LISTEN AUTH SUCCESS
===================== */
window.addEventListener("message", async (event) => {
  if (event.origin !== "http://127.0.0.1:3001") return;
  if (event.data?.type !== "AUTH_SUCCESS") return;

  try {
    const res = await fetch("http://127.0.0.1:3001/me", {
      credentials: "include"
    });
    if (!res.ok) return;

    const user = await res.json();
    onConnected(user);
  } catch {
    hideLoader();
  }
});

/* =====================
   CONNECTED
===================== */
function onConnected(user) {
  isAuthenticating = false;
  hideLoader();

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

/* =====================
   AVATAR MENU
===================== */
avatar.onclick = () => {
  const menu = document.getElementById("userMenu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
};

/* =====================
   LOGOUT
===================== */
document.getElementById("logoutBtn").onclick = async () => {
  await fetch("http://127.0.0.1:3001/logout", { method: "POST" });
  location.reload();
};

/* =====================
   EMAILS
===================== */
async function loadEmails() {
  const res = await fetch("http://127.0.0.1:3001/emails/today", {
    credentials: "include"
  });

  if (!res.ok) {
    console.error("Impossible de charger les emails");
    return;
  }

  const emails = await res.json();

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


/* =====================
   FAKE IA (placeholder)
===================== */
function fakeSummary(subject) {
  return `Email important concernant : "${subject}"`;
}
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://127.0.0.1:3001/me", {
      credentials: "include"
    });

    if (!res.ok) return;

    const user = await res.json();
    if (!user || !user.email) return;

    onConnected(user);
  } catch {
    // utilisateur non connecté
  }
});
