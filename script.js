const loginBtn = document.getElementById("loginBtn");
const mainLoginBtn = document.getElementById("mainLoginBtn");
const avatar = document.getElementById("avatar");

/* =====================
   LOGIN
===================== */
loginBtn.onclick = startLogin;
mainLoginBtn.onclick = startLogin;

function startLogin() {
  window.open(
    "http://127.0.0.1:3001/auth/google",
    "_blank",
    "width=500,height=600"
  );
}

/* =====================
   AUTH MESSAGE
===================== */
window.addEventListener("message", async (event) => {
  if (event.origin !== "http://127.0.0.1:3001") return;
  if (event.data?.type !== "AUTH_SUCCESS") return;

  const res = await fetch("http://127.0.0.1:3001/me", {
    credentials: "include"
  });

  const user = await res.json();
  onConnected(user);
});

/* =====================
   CONNECTED
===================== */
function onConnected(user) {
  document.getElementById("landing").style.display = "none";
  document.getElementById("dashboard").style.display = "block";

  avatar.src = user.picture;
  avatar.style.display = "block";

  document.getElementById("userName").innerText = user.name;
  document.getElementById("userEmail").innerText = user.email;

  loadEmails();
}

/* =====================
   EMAILS
===================== */
async function loadEmails() {
  const res = await fetch("http://127.0.0.1:3001/emails/today", {
    credentials: "include"
  });

  const emails = await res.json();
  const container = document.getElementById("emails");
  container.innerHTML = "";

  emails.forEach(e => {
    const div = document.createElement("div");
    div.className = "email-card";
    div.innerHTML = `
      <strong>${e.from}</strong>
      <p>${e.subject}</p>
      <em>Résumé automatique</em>
    `;
    container.appendChild(div);
  });
}

/* =====================
   LOGOUT
===================== */
document.getElementById("logoutBtn").onclick = async () => {
  await fetch("http://127.0.0.1:3001/logout", {
    method: "POST",
    credentials: "include"
  });
  location.reload();
};
