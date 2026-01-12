const loginBtn = document.getElementById("loginBtn");
const mainLoginBtn = document.getElementById("mainLoginBtn");
const avatar = document.getElementById("avatar");
const landing = document.getElementById("landing");
const dashboard = document.getElementById("dashboard");
const emailsDiv = document.getElementById("emails");

let authCheckInterval = null;

/* 🔐 OUVERTURE GOOGLE LOGIN */
function loginWithGoogle() {
  window.open(
    "http://127.0.0.1:3001/auth/google",
    "_blank",
    "width=500,height=600"
  );

  // Commence à vérifier si l'utilisateur est connecté
  startAuthPolling();
}

loginBtn.onclick = loginWithGoogle;
mainLoginBtn.onclick = loginWithGoogle;

/* 🔄 VÉRIFIE SI L'UTILISATEUR EST CONNECTÉ */
function startAuthPolling() {
  if (authCheckInterval) return;

  authCheckInterval = setInterval(async () => {
    try {
      const res = await fetch("http://127.0.0.1:3001/me");
      if (!res.ok) return;

      const user = await res.json();
      clearInterval(authCheckInterval);
      authCheckInterval = null;

      onUserAuthenticated(user);
    } catch (err) {
      // ignore
    }
  }, 1000);
}

/* ✅ UTILISATEUR CONNECTÉ */
function onUserAuthenticated(user) {
  loginBtn.style.display = "none";
  mainLoginBtn.style.display = "none";

  avatar.src = user.picture;
  avatar.style.display = "block";

  landing.style.display = "none";
  dashboard.style.display = "block";

  loadEmails();
}

/* 📩 CHARGEMENT DES EMAILS */
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

/* 🔁 AU RECHARGEMENT DE LA PAGE */
startAuthPolling();
