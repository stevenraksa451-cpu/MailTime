/* =====================
   VARIABLES GLOBALES
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
loginBtn.onclick = login;
mainLoginBtn.onclick = login;

function login() {
  if (isAuthenticating) return;

  isAuthenticating = true;
  showLoader();

  const authWindow = window.open(
    "http://127.0.0.1:3001/auth/google",
    "_blank",
    "width=500,height=600"
  );

  checkAuth(authWindow);
}

/* =====================
   CHECK AUTH
===================== */
async function checkAuth(authWindow) {
  const interval = setInterval(async () => {

    // Tant que la popup est ouverte, on attend
    if (authWindow && !authWindow.closed) return;

    try {
      const res = await fetch("http://127.0.0.1:3001/me", {
        credentials: "include"
      });

      if (!res.ok) {
        stopAuth(interval);
        return;
      }

      const user = await res.json();

      if (!user || !user.email) {
        stopAuth(interval);
        return;
      }

      clearInterval(interval);
      onConnected(user);

    } catch {
      stopAuth(interval);
    }

  }, 800);
}

function stopAuth(interval) {
  clearInterval(interval);
  isAuthenticating = false;
  hideLoader();
}

/* =====================
   CONNECTÉ
===================== */
function onConnected(user) {
  isAuthenticating = false;
  hideLoader();

  avatar.src = user.picture;
  avatar.style.display = "block";

  loginBtn.style.display = "none";
  mainLoginBtn.style.display = "none";

  document.getElementById("userName").innerText = user.name;
  document.getElementById("userEmail").innerText = user.email;

  loadEmails();
}

/* =====================
   MENU AVATAR
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
  const res = await fetch("http://127.0.0.1:3001/emails/today");
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
   FAUX RÉSUMÉ IA
===================== */
function fakeSummary(subject) {
  return `Email important concernant : "${subject}"`;
}
