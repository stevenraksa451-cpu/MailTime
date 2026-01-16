/* =====================
   URL BACKEND
===================== */
const BACKEND = "http://127.0.0.1:3001";

/* =====================
   ELEMENTS
===================== */
const loginBtn = document.getElementById("loginBtn");
const mainLoginBtn = document.getElementById("mainLoginBtn");
const landing = document.getElementById("landing");
const dashboard = document.getElementById("dashboard");
const avatar = document.getElementById("avatar");
const userMenu = document.getElementById("userMenu");

/* =====================
   LOGIN
===================== */
function startLogin() {
  window.open(
    `${BACKEND}/auth/google`,
    "_blank",
    "width=500,height=600"
  );
}

loginBtn?.addEventListener("click", startLogin);
mainLoginBtn?.addEventListener("click", startLogin);

/* =====================
   GOOGLE AUTH SUCCESS (PRIORITAIRE)
===================== */
window.addEventListener("message", async (event) => {
  if (event.origin !== BACKEND) return;
  if (event.data?.type !== "AUTH_SUCCESS") return;

  await forceDisplayDashboard();
});

/* =====================
   FORCE AFFICHAGE DASHBOARD
===================== */
async function forceDisplayDashboard() {
  try {
    const res = await fetch(`${BACKEND}/me`, {
      credentials: "include"
    });

    if (!res.ok) {
      console.error("Utilisateur non connecté");
      return;
    }

    const user = await res.json();

    // AFFICHAGE FORCÉ
    landing.style.display = "none";
    dashboard.style.display = "block";

    avatar.src = user.picture;
    avatar.style.display = "block";

    document.getElementById("userName").textContent = user.name;
    document.getElementById("userEmail").textContent = user.email;

    loginBtn.style.display = "none";
    mainLoginBtn.style.display = "none";

    loadEmails();

  } catch (e) {
    console.error("Erreur affichage dashboard", e);
  }
}

/* =====================
   CHARGER EMAILS
===================== */
async function loadEmails() {
  const res = await fetch(`${BACKEND}/emails/today`, {
    credentials: "include"
  });

  if (!res.ok) return;

  const emails = await res.json();
  const container = document.getElementById("emails");
  container.innerHTML = "";

  emails.forEach(email => {
    const card = document.createElement("div");
    card.className = "email-card";
    card.innerHTML = `
      <strong>${email.from}</strong>
      <p>${email.subject}</p>
      <em>Résumé automatique</em>
    `;
    container.appendChild(card);
  });
}

/* =====================
   MENU AVATAR
===================== */
avatar?.addEventListener("click", () => {
  userMenu.style.display =
    userMenu.style.display === "block" ? "none" : "block";
});

/* =====================
   LOGOUT
===================== */
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  await fetch(`${BACKEND}/logout`, {
    method: "POST",
    credentials: "include"
  });
  location.reload();
});

/* =====================
   CHECK SESSION AU RECHARGEMENT
===================== */
window.addEventListener("load", forceDisplayDashboard);
