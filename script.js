
const btn = document.getElementById("testLogin");
const dashboard = document.getElementById("dashboard");

btn.addEventListener("click", () => {
  // données FAKE pour test
  const user = {
    name: "Test User",
    email: "test@gmail.com",
    picture: "https://i.pravatar.cc/150"
  };

  const emails = [
    { subject: "Bienvenue sur MailTime", from: "Google" },
    { subject: "Votre facture", from: "Stripe" },
    { subject: "Nouveau message", from: "Support" }
  ];

  // afficher infos
  document.getElementById("avatar").src = user.picture;
  document.getElementById("name").textContent = user.name;
  document.getElementById("email").textContent = user.email;

  // afficher emails
  const emailsDiv = document.getElementById("emails");
  emailsDiv.innerHTML = "";

  emails.forEach(e => {
    const div = document.createElement("div");
    div.className = "email";
    div.innerHTML = `<strong>${e.subject}</strong><br><em>${e.from}</em>`;
    emailsDiv.appendChild(div);
  });

  // 🔴 LIGNE LA PLUS IMPORTANTE
  dashboard.style.display = "block";
});
