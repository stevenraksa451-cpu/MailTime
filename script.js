const connectBtn = document.getElementById("connectBtn");
const signInBtn = document.getElementById("signInBtn");
const avatar = document.getElementById("avatar");
const avatarDropdown = document.getElementById("avatarDropdown");
const logoutBtn = document.getElementById("logoutBtn");

// Simulation d'un utilisateur connecté
let isConnected = false; // false par défaut
let avatarUrl = "https://i.pravatar.cc/150?u=stevenraksa"; // avatar Gmail simulé

// ---------------------------
// 1️⃣ Connexion Gmail
// ---------------------------
connectBtn.addEventListener("click", () => {
  window.open("http://127.0.0.1:3001/auth/google", "_blank");
  alert("Une nouvelle fenêtre s'ouvre pour autoriser MailTime.");
  // Après connexion simulate
  setTimeout(() => {
    isConnected = true;
    showAvatar();
  }, 1000); // simulation délai OAuth
});

// ---------------------------
// 2️⃣ Afficher avatar si connecté
// ---------------------------
function showAvatar() {
  if(isConnected){
    avatar.src = avatarUrl;
    avatar.style.display = "inline-block";
    connectBtn.style.display = "none";
    signInBtn.style.display = "none";
  }
}

// ---------------------------
// 3️⃣ Menu déroulant au clic sur avatar
// ---------------------------
avatar.addEventListener("click", () => {
  avatarDropdown.style.display = avatarDropdown.style.display === "flex" ? "none" : "flex";
});

// Fermer le menu si clic en dehors
window.addEventListener("click", (e) => {
  if(!avatar.contains(e.target) && !avatarDropdown.contains(e.target)){
    avatarDropdown.style.display = "none";
  }
});

// ---------------------------
// 4️⃣ Déconnexion
// ---------------------------
logoutBtn.addEventListener("click", () => {
  isConnected = false;
  avatar.style.display = "none";
  connectBtn.style.display = "inline-block";
  signInBtn.style.display = "inline-block";
  avatarDropdown.style.display = "none";
});
