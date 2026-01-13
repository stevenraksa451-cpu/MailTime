function onConnected(user) {
  isAuthenticating = false;
  hideLoader();

let isAuthenticating = false;
function showLoader() {
  document.getElementById("loadingOverlay").style.display = "flex";
}

function hideLoader() {
  document.getElementById("loadingOverlay").style.display = "none";
}

const loginBtn = document.getElementById("loginBtn");
const mainLoginBtn = document.getElementById("mainLoginBtn");
const avatar = document.getElementById("avatar");
@@ -6,24 +19,61 @@ loginBtn.onclick = login;
mainLoginBtn.onclick = login;

function login() {
  window.open("http://127.0.0.1:3001/auth/google", "_blank", "width=500,height=600");
  checkAuth();
  if (isAuthenticating) return; // sécurité

  isAuthenticating = true;
  showLoader();

  const authWindow = window.open(
    "http://127.0.0.1:3001/auth/google",
    "_blank",
    "width=500,height=600"
  );

  checkAuth(authWindow);
}

async function checkAuth() {
async function checkAuth(authWindow) {
  const interval = setInterval(async () => {
    // Tant que la popup est ouverte → on attend
    if (authWindow && !authWindow.closed) return;

    try {
      const res = await fetch("http://127.0.0.1:3001/me");
      if (!res.ok) return;
      const res = await fetch("http://127.0.0.1:3001/me", {
        credentials: "include"
      });

      if (!res.ok) {
        isAuthenticating = false;
        hideLoader();
        clearInterval(interval);
        return;
      }

      clearInterval(interval);
      const user = await res.json();

      // Sécurité finale
      if (!user || !user.email) {
        isAuthenticating = false;
        hideLoader();
        clearInterval(interval);
        return;
      }

      clearInterval(interval);
      onConnected(user);
    } catch {}
  }, 1000);

    } catch {
      isAuthenticating = false;
      hideLoader();
      clearInterval(interval);
    }
  }, 800);
}

function onConnected(user) {
  hideLoader();

  avatar.src = user.picture;
  avatar.style.display = "block";
  loginBtn.style.display = "none";
