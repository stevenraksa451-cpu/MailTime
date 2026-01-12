const loginBtn = document.getElementById("loginBtn");
const avatar = document.getElementById("avatar");
const userMenu = document.getElementById("userMenu");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");

const landing = document.getElementById("landing");
const dashboard = document.getElementById("dashboard");
const emailsList = document.getElementById("emailsList");

// Ouvrir popup Google OAuth
loginBtn.onclick = () => {
  window.open(
    "http://127.0.0.1:3001/auth/google",
    "_blank",
    "width=500,height=600"
  );
};

// Toggle menu utilisateur
avatar.onclick = () => {
  userMenu.style.display = userMenu.style.display === "none" ? "flex" : "none";
};

// Déconnexion
logoutBtn.onclick = async () => {
  await fetch("http://127.0.0.1:3001/logout");
  avatar.style.display = "none";
  userMenu.style.display = "none";
  loginBtn.style.display = "block";
  landing.style.display = "block";
  dashboard.style.display = "none";
  emailsList.innerHTML = "";
};

// Vérifie si l’utilisateur est connecté et charge dashboard
async function checkAuth() {
  try {
    const res = await fetch("http://127.0.0.1:3001/me");
    if (!res.ok) return;

    const user = await res.json();
    loginBtn.style.display = "none";
    avatar.src = user.picture;
    avatar.style.display = "block";

    userName.innerText = user.name;
    userEmail.innerText = user.email;

    landing.style.display = "none";
    dashboard.style.display = "block";

    await loadDashboard();
  } catch (e) {
    console.log("Utilisateur non connecté");
  }
}

// Charge les emails du jour
async function loadDashboard() {
  try {
    const res = await fetch("http://127.0.0.1:3001/emails/today");
    if (!res.ok) return;
    const emails = await res.json();

    emailsList.innerHTML = "";
    if (emails.length === 0) {
      emailsList.innerHTML = "<p>Aucun email reçu aujourd'hui.</p>";
      return;
    }

    emails.forEach(email => {
      const div = document.createElement("div");
      div.innerHTML = `<strong>${email.from}</strong> : ${email.subject}`;
      emailsList.appendChild(div);
    });
  } catch (e) {
    emailsList.innerHTML = "<p>Erreur lors de la récupération des emails.</p>";
  }
}

// Lancement au démarrage
checkAuth();
