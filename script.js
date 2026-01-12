const loginBtn = document.getElementById("loginBtn");
const mainLoginBtn = document.getElementById("mainLoginBtn");
const avatar = document.getElementById("avatar");

// Lancer la connexion Google
function loginWithGoogle() {
  window.open(
    "http://127.0.0.1:3001/auth/google",
    "_blank",
    "width=500,height=600"
  );

  startAuthPolling();
}

// Vérifie si l'utilisateur est connecté
function startAuthPolling() {
  const interval = setInterval(async () => {
    try {
      const res = await fetch("http://127.0.0.1:3001/me");
      if (!res.ok) return;

      const user = await res.json();

      clearInterval(interval);
      showLoggedInUI(user);
      loadEmails();
    } catch (e) {}
  }, 1000);
}

// Affichage utilisateur connecté
function showLoggedInUI(user) {
  loginBtn.style.display = "none";
  mainLoginBtn.style.display = "none";

  avatar.src = user.picture;
  avatar.style.display = "block";
}

// Charger les emails
async function loadEmails() {
  const res = await fetch("http://127.0.0.1:3001/emails/today");
  const emails = await res.json();

  console.log("Emails :", emails);
}

// Déconnexion (optionnel pour plus tard)
async function logout() {
  await fetch("http://127.0.0.1:3001/logout", { method: "POST" });
  location.reload();
}
