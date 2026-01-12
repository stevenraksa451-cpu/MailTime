const loginBtn = document.getElementById("loginBtn");
const mainLoginBtn = document.getElementById("mainLoginBtn");
const avatar = document.getElementById("avatar");

function openGoogleLogin() {
  const popup = window.open(
    "http://127.0.0.1:3001/auth/google",
    "googleLogin",
    "width=500,height=600"
  );

  const timer = setInterval(async () => {
    if (popup.closed) {
      clearInterval(timer);
      await fetchUser();
    }
  }, 500);
}

loginBtn.addEventListener("click", openGoogleLogin);
mainLoginBtn.addEventListener("click", openGoogleLogin);

async function fetchUser() {
  const res = await fetch("http://127.0.0.1:3001/me", {
    credentials: "include"
  });

  if (!res.ok) return;

  const user = await res.json();

  // Avatar réel Gmail
  avatar.src = user.picture;
  avatar.style.display = "block";

  loginBtn.style.display = "none";
  mainLoginBtn.style.display = "none";
}
