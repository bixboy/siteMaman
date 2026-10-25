// --- Consentement aux cookies de mesure d'audience (RGPD, recommandations CNIL) ---
// Google Tag Manager n'est chargé qu'après « Accepter ». Le choix est mémorisé 6 mois puis redemandé ;
// « Gérer les cookies » (pied de page) rouvre le bandeau. Refuser = aussi simple qu'accepter.

const STORAGE_KEY = 'consentement-audience';
const DURATION_MS = 182 * 24 * 60 * 60 * 1000; // 6 mois

function readChoice() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Date.now() - saved.date < DURATION_MS) return saved.choix;
  } catch {
    // stockage indisponible (navigation privée stricte) : le bandeau sera redemandé
  }
  return null;
}

function saveChoice(choice) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ choix: choice, date: Date.now() }));
  } catch {
    // choix non mémorisé : sans conséquence, le bandeau réapparaîtra
  }
}

function loadTagManager(id) {
  if (!id || document.querySelector('script[data-gtm]')) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${id}`;
  script.dataset.gtm = '';
  document.head.append(script);
}

// Retrait du consentement : supprime les cookies Google Analytics (_ga, _gid…) de ce domaine
function deleteGoogleCookies() {
  const domains = ['', window.location.hostname, `.${window.location.hostname.replace(/^www\./, '')}`];
  document.cookie.split(';').map((cookie) => cookie.split('=')[0].trim())
    .filter((name) => /^_(ga|gid|gat)/.test(name))
    .forEach((name) => domains.forEach((domain) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain ? `; domain=${domain}` : ''}`;
    }));
}

export function initConsent() {
  const banner = document.querySelector('[data-consentement]');
  if (!banner) return;
  const gtmId = banner.dataset.gtm;

  const choose = (choice) => {
    const hadTagManager = Boolean(document.querySelector('script[data-gtm]'));
    saveChoice(choice);
    banner.hidden = true;
    if (choice === 'accepte') {
      loadTagManager(gtmId);
    } else {
      deleteGoogleCookies();
      // Le script déjà chargé ne peut pas être « déchargé » : on recharge la page sans lui
      if (hadTagManager) window.location.reload();
    }
  };

  banner.querySelectorAll('[data-consentement-choix]').forEach((button) => {
    button.addEventListener('click', () => choose(button.dataset.consentementChoix));
  });
  document.querySelectorAll('[data-consentement-ouvrir]').forEach((button) => {
    button.addEventListener('click', () => {
      banner.hidden = false;
      banner.querySelector('button')?.focus();
    });
  });

  const choice = readChoice();
  if (choice === 'accepte') loadTagManager(gtmId);
  else if (choice === null) banner.hidden = false;
}
