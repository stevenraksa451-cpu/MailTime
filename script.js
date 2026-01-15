/* =====================
   ELEMENTS
===================== */
const loginBtn = document.getElementById("loginBtn");
const mainLoginBtn = document.getElementById("mainLoginBtn");
const avatar = document.getElementById("avatar");

/* =====================
   LOGIN
===================== */
loginBtn.onclick = login;
mainLoginBtn.onclick = login;

function login() {
  window.open(
    "http://127.0.0.1:3001/auth/google",
    "_blank",
    "width=500,height=600"
  );
}

/* =====================
   MESSAGE GOOGLE (IMPORTANT)
===================== */
window.addEventListener("message", async (event) => {
  // 🔴 LE MESSAGE VIENT DU BACKEND
  if (event.origin !== "http://127.0.0.1:3001") return;
  if (event.data?.type !== "AUTH_SUCCESS") return;

  try {
    const res = await fetch("http://127.0.0.1:3001/me");
    if (!res.ok) throw new Error("Non connecté");

    const user = await res.json();
    showDashboard(user);

  } catch (err) {
    console.error("Erreur auth :", err);
  }
});

/* =====================
   DASHBOARD
===================== */
function showDashboard(user) {
  if (!user || !user.email) return;

  // cacher landing
  document.getElementById("landing").style.display = "none";

  // afficher dashboard
  document.getElementById("dashboard").style.display = "block";

  // infos utilisateur
  document.getElementById("userName").innerText = user.name;
  document.getElementById("userEmail").innerText = user.email;

  avatar.src = user.picture;
  avatar.style.display = "block";

  loginBtn.style.display = "none";
  mainLoginBtn.style.display = "none";

  loadEmails();
}

/* =====================
   EMAILS
===================== */
async function loadEmails() {
  try {
    const res = await fetch("http://127.0.0.1:3001/emails/today");
    if (!res.ok) return;

    const emails = await res.json();
    const container = document.getElementById("emails");
    container.innerHTML = "";

    emails.forEach(email => {
      const card = document.createElement("div");
      card.className = "email-card";
      card.innerHTML = `
        <strong>${email.from || "Inconnu"}</strong>
        <p>${email.subject || "(sans sujet)"}</p>
      `;
      container.appendChild(card);
    });
  } catch (e) {
    console.error("Erreur emails", e);
  }
}

/* =====================
   LOGOUT
===================== */
document.getElementById("logoutBtn").onclick = async () => {
  await fetch("http://127.0.0.1:3001/logout", { method: "POST" });
  location.reload();
};
