// URL BACKEND
const BACKEND_URL = "http://127.0.0.1:3001";

// ÉLÉMENTS DOM
const loginBtn = document.getElementById("loginBtn");
const mainLoginBtn = document.getElementById("mainLoginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const landing = document.getElementById("landing");
const dashboard = document.getElementById("dashboard");

const avatar = document.getElementById("avatar");
const userMenu = document.getElementById("userMenu");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const emailsDiv = document.getElementById("emails");

// =======================
// CONNEXION GOOGLE
// =======================
function loginWithGoogle() {
  window.open(
    `${BACKEND_URL}/auth/google`,
    "_blank",
    "width=500,height=600"
  );
}

loginBtn?.addEventListener("click", loginWithGoogle);
mainLoginBtn?.addEventListener("click", loginWithGoogle);

// =======================
// RÉCEPTION MESSAGE BACKEND
// =======================
window.addEventListener("message", async (event) => {
  if (event.origin !== "http://127.0.0.1:3001") return;
  if (event.data?.type !== "AUTH_SUCCESS") return;

  await loadUserAndDashboard();
});

// =======================
// CHARGEMENT UTILISATEUR
// =======================
async function loadUserAndDashboard() {
  try {
    const res = await fetch(`${BACKEND_URL}/me`);
    if (!res.ok) return;

    const user = await res.json();
    showDashboard(user);
    loadEmails();
  } catch (err) {
    console.error("Erreur utilisateur :", err);
  }
}

// =======================
// AFFICHAGE DASHBOARD
// =======================
function showDashboard(user) {
  landing.style.display = "none";
  dashboard.style.display = "block";

  avatar.src = user.picture;
  avatar.style.display = "block";

  userName.textContent = user.name;
  userEmail.textContent = user.email;
}

// =======================
// MENU AVATAR
// =======================
avatar?.addEventListener("click", () => {
  userMenu.style.display =
    userMenu.style.display === "block" ? "none" : "block";
});

// =======================
// CHARGEMENT EMAILS
// =======================
async function loadEmails() {
  emailsDiv.innerHTML = "Chargement des emails...";

  try {
    const res = await fetch(`${BACKEND_URL}/emails/today`);
    if (!res.ok) {
      emailsDiv.innerHTML = "Impossible de charger les emails.";
      return;
    }

    const emails = await res.json();
    emailsDiv.innerHTML = "";

    if (emails.length === 0) {
      emailsDiv.innerHTML = "<p>Aucun email aujourd’hui</p>";
      return;
    }

    emails.forEach(email => {
      const div = document.createElement("div");
      div.className = "email-card";
      div.innerHTML = `
        <strong>${email.subject || "Sans sujet"}</strong>
        <p>${email.from || "Expéditeur inconnu"}</p>
      `;
      emailsDiv.appendChild(div);
    });

  } catch (err) {
    emailsDiv.innerHTML = "Erreur de chargement.";
  }
}

// =======================
// DÉCONNEXION
// =======================
logoutBtn?.addEventListener("click", async () => {
  await fetch(`${BACKEND_URL}/logout`, { method: "POST" });

  dashboard.style.display = "none";
  landing.style.display = "block";

  avatar.style.display = "none";
  userMenu.style.display = "none";
});
