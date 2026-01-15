const loginBtn = document.getElementById("loginBtn");
const mainLoginBtn = document.getElementById("mainLoginBtn");
const avatar = document.getElementById("avatar");
const userMenu = document.getElementById("userMenu");

loginBtn.onclick = startLogin;
mainLoginBtn.onclick = startLogin;

function startLogin() {
  window.open(
    "http://127.0.0.1:3001/auth/google",
    "_blank",
    "width=500,height=600"
  );
}

/* ===== ÉCOUTE SUCCÈS GOOGLE ===== */
window.addEventListener("message", async (event) => {
  if (event.origin !== "http://127.0.0.1:3001") return;
  if (event.data?.type !== "AUTH_SUCCESS") return;

  const res = await fetch("http://127.0.0.1:3001/me", {
    credentials: "include"
  });

  if (!res.ok) return;

  const user = await res.json();
  showDashboard(user);
});

/* ===== SESSION AUTO ===== */
document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("http://127.0.0.1:3001/me", {
    credentials: "include"
  });

  if (!res.ok) return;

  const user = await res.json();
  showDashboard(user);
});

/* ===== DASHBOARD ===== */
function showDashboard(user) {
  document.getElementById("landing").style.display = "none";
  document.getElementById("dashboard").style.display = "block";

  avatar.src = user.picture;
  avatar.style.display = "block";

  loginBtn.style.display = "none";

  document.getElementById("userName").innerText = user.name;
  document.getElementById("userEmail").innerText = user.email;

  loadEmails();
}

/* ===== EMAILS ===== */
async function loadEmails() {
  const res = await fetch("http://127.0.0.1:3001/emails/today", {
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
      <em>Résumé : Email important concernant "${email.subject}"</em>
    `;
    container.appendChild(card);
  });
}

/* ===== AVATAR MENU ===== */
avatar.onclick = () => {
  userMenu.style.display =
    userMenu.style.display === "block" ? "none" : "block";
};

/* ===== LOGOUT ===== */
document.getElementById("logoutBtn").onclick = async () => {
  await fetch("http://127.0.0.1:3001/logout", {
    method: "POST",
    credentials: "include"
  });
  location.reload();
};
