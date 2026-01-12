const loginBtn = document.getElementById("loginBtn");
const avatar = document.getElementById("avatar");
const userMenu = document.getElementById("userMenu");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");

// Ouvrir popup Google
loginBtn.onclick = () => {
  window.open(
    "http://127.0.0.1:3001/auth/google",
    "_blank",
    "width=500,height=600"
  );
};

// Afficher ou cacher le menu
avatar.onclick = () => {
  userMenu.style.display = userMenu.style.display === "none" ? "flex" : "none";
};

// Déconnexion
logoutBtn.onclick = () => {
  avatar.style.display = "none";
  userMenu.style.display = "none";
  loginBtn.style.display = "block";
  // Supprimer le token côté frontend
  fetch("http://127.0.0.1:3001/logout"); // Optionnel : à créer côté backend si besoin
};

// Vérifie si l’utilisateur est connecté et met à jour l’UI
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
    userMenu.style.display = "none";
  } catch (e) {
    console.log("Utilisateur non connecté");
  }
}

checkAuth();
