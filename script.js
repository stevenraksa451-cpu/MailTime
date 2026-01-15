const loginBtn = document.getElementById("loginBtn");
const mainLoginBtn = document.getElementById("mainLoginBtn");
const avatar = document.getElementById("avatar");

loginBtn.onclick = login;
mainLoginBtn.onclick = login;

function login() {
  window.open("http://127.0.0.1:3001/auth/google", "_blank", "width=500,height=600");
  checkAuth();
}

async function checkAuth() {
  const interval = setInterval(async () => {
    try {
      const res = await fetch("http://127.0.0.1:3001/me");
      if (!res.ok) return;

      clearInterval(interval);
      const user = await res.json();
      onConnected(user);
    } catch {}
  }, 1000);
}

function onConnected(user) {
  avatar.src = user.picture;
  avatar.style.display = "block";
  loginBtn.style.display = "none";
  mainLoginBtn.style.display = "none";

  document.getElementById("userName").innerText = user.name;
  document.getElementById("userEmail").innerText = user.email;

  loadEmails();
}

// MENU AVATAR
avatar.onclick = () => {
  const menu = document.getElementById("userMenu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
};

// LOGOUT
document.getElementById("logoutBtn").onclick = async () => {
  await fetch("http://127.0.0.1:3001/logout", { method: "POST" });
  location.reload();
};

// EMAILS + RÉSUMÉ
async function loadEmails() {
  const res = await fetch("http://127.0.0.1:3001/emails/today");
  const emails = await res.json();

  const container = document.createElement("div");
  container.className = "emails";

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

  document.body.appendChild(container);
}

// FAUX résumé (placeholder IA)
function fakeSummary(subject) {
  return `Email important concernant : "${subject}"`;
}
