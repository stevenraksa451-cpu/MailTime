const API = "http://127.0.0.1:3001";

/* =====================
   PAGE LOGIN
===================== */
const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    window.location.href = `${API}/auth/google`;
  });
}

/* =====================
   PAGE DASHBOARD
===================== */
async function loadDashboard() {
  try {
    const res = await fetch(`${API}/me`, {
      credentials: "include"
    });

    if (!res.ok) {
      window.location.href = "index.html";
      return;
    }

    const user = await res.json();
    showUser(user);
    loadEmails();

  } catch (e) {
    console.error(e);
  }
}

function showUser(user) {
  document.getElementById("avatar").src = user.picture;
  document.getElementById("userName").textContent = user.name;
  document.getElementById("userEmail").textContent = user.email;
}

async function loadEmails() {
  const res = await fetch(`${API}/emails`, {
    credentials: "include"
  });

  const emails = await res.json();
  const container = document.getElementById("emails");

  emails.forEach(mail => {
    const div = document.createElement("div");
    div.className = "email-card";
    div.innerHTML = `
      <strong>${mail.from}</strong>
      <p>${mail.summary}</p>
      <em>${mail.date}</em>
    `;
    container.appendChild(div);
  });
}

/* =====================
   MENU AVATAR
===================== */
const avatar = document.getElementById("avatar");
const menu = document.getElementById("userMenu");

if (avatar) {
  avatar.addEventListener("click", () => {
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  });

  document.getElementById("logoutBtn").addEventListener("click", async () => {
    await fetch(`${API}/logout`, { credentials: "include" });
    window.location.href = "index.html";
  });

  loadDashboard();
}
