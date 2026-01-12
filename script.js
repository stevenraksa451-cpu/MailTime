// ---------------------------------------------------
// script.js - MailTime Front-End
// ---------------------------------------------------

const connectBtn = document.getElementById("connectBtn");
const signInBtn = document.getElementById("signInBtn");
const emailsContainer = document.getElementById("emailsContainer");

// ---------------------------
// 1️⃣ Connexion à Gmail
// ---------------------------
if(connectBtn){
  connectBtn.addEventListener("click", () => {
    // Ouvre la page d'autorisation OAuth dans un nouvel onglet
    window.open("http://127.0.0.1:3001/auth/google", "_blank");
    alert("Une nouvelle fenêtre va s'ouvrir pour autoriser MailTime à accéder à vos emails.");
  });
}

// Simuler Sign In pour rediriger vers le dashboard
if(signInBtn){
  signInBtn.addEventListener("click", () => {
    window.location.href = "dashboard.html";
  });
}

// ---------------------------
// 2️⃣ Fonction pour calculer l'importance
// ---------------------------
function importance(email){
  if(!email.subject) return 0;
  const subject = email.subject.toLowerCase();
  if(subject.includes("urgent")) return 3;
  if(subject.includes("important")) return 2;
  return 1; // faible
}

// ---------------------------
// 3️⃣ Fonction pour récupérer les emails
// ---------------------------
async function fetchEmails(){
  if(!emailsContainer) return;

  try{
    const res = await fetch("http://127.0.0.1:3001/emails/today");
    
    if(res.status === 401){
      emailsContainer.innerHTML = "<p>Non connecté à Gmail. Retournez à la page d'accueil.</p>";
      return;
    }

    const emails = await res.json();

    if(emails.length === 0){
      emailsContainer.innerHTML = "<p>Aucun email aujourd'hui.</p>";
      return;
    }

    // Trier les emails par importance
    emails.sort((a,b) => importance(b) - importance(a));

    // Affichage
    emailsContainer.innerHTML = emails.map(email => `
      <div class="email-card">
        <strong>De : ${email.from}</strong>
        <span class="subject">Sujet : ${email.subject}</span>
        <span class="importance">Importance : ${["Faible","Moyenne","Haute","Très haute"][importance(email)]}</span>
        <div>
          <button onclick="alert('Fonction réponse à implémenter')">Répondre</button>
          <button onclick="alert('Fonction marquer comme lu à implémenter')">Marquer comme lu</button>
        </div>
      </div>
    `).join("");

  } catch(err){
    emailsContainer.innerHTML = "<p>Erreur : " + err.message + "</p>";
  }
}

// ---------------------------
// 4️⃣ Rafraîchissement automatique
// ---------------------------
setInterval(fetchEmails, 10000); // toutes les 10 secondes
fetchEmails(); // appel initial

