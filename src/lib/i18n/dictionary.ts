// Manual FR -> EN dictionary. Edit/extend via Admin > Traductions EN.
// Keys are the EXACT visible French strings (trimmed). Values are the English version.
// Strings not present here stay in French (no AI fallback).

export const BASE_DICTIONARY: Record<string, string> = {
  // ============ Navigation / Header ============
  "Accueil": "Home",
  "Pôle Artiste": "Artist Pole",
  "Pôle Entreprise": "Business Pole",
  "Contact": "Contact",
  "Découvrir nos pôles": "Discover our poles",
  "Découvrir nos services": "Discover our services",
  "Menu": "Menu",

  // ============ Common CTA / actions ============
  "En savoir plus": "Learn more",
  "Voir plus": "See more",
  "Voir tout": "See all",
  "Découvrir": "Discover",
  "Nous contacter": "Contact us",
  "Demander un devis": "Request a quote",
  "Réserver": "Book now",
  "Envoyer": "Send",
  "Envoyer le message": "Send message",
  "Suivant": "Next",
  "Précédent": "Previous",
  "Retour": "Back",
  "Fermer": "Close",
  "Valider": "Confirm",
  "Annuler": "Cancel",
  "Continuer": "Continue",
  "Charger plus": "Load more",
  "Chargement...": "Loading...",
  "Chargement…": "Loading…",
  "Obligatoire": "Required",
  "Optionnel": "Optional",

  // ============ Form fields ============
  "Nom": "Name",
  "Prénom": "First name",
  "Nom complet": "Full name",
  "Email": "Email",
  "Téléphone": "Phone",
  "Message": "Message",
  "Sujet": "Subject",
  "Service": "Service",
  "Budget": "Budget",
  "Échéance": "Deadline",
  "Description du projet": "Project description",
  "Votre nom": "Your name",
  "Votre email": "Your email",
  "Votre téléphone": "Your phone",
  "Votre message": "Your message",
  "Votre projet": "Your project",
  "Votre secteur": "Your sector",
  "Type de demande": "Request type",

  // ============ Sections / headings ============
  "Nos services": "Our services",
  "Nos pôles": "Our poles",
  "Nos packs": "Our packs",
  "Notre équipe": "Our team",
  "Nos références": "Our references",
  "Nos clients": "Our clients",
  "Nos partenaires": "Our partners",
  "Nos chiffres": "Our numbers",
  "Notre process": "Our process",
  "Notre expertise": "Our expertise",
  "Ce qu'on fait pour vous": "What we do for you",
  "Ce qu’on fait pour vous": "What we do for you",
  "Pour les artistes": "For artists",
  "Pour les entreprises": "For brands",
  "Vous êtes": "You are",
  "Un artiste": "An artist",
  "Une entreprise": "A brand",
  "Découvrez nos services": "Discover our services",
  "Parlons de votre projet": "Let's talk about your project",
  "Prêt à passer au niveau supérieur ?": "Ready to take it to the next level?",

  // ============ Footer ============
  "Mentions légales": "Legal notice",
  "Politique de confidentialité": "Privacy policy",
  "Politique cookies": "Cookie policy",
  "CGV": "Terms of sale",
  "CGU": "Terms of use",
  "Tous droits réservés": "All rights reserved",
  "Suivez-nous": "Follow us",
  "Retrouvez-nous": "Find us",
  "Liens utiles": "Useful links",
  "Newsletter": "Newsletter",

  // ============ Cookies ============
  "Nous utilisons des cookies pour améliorer votre expérience.": "We use cookies to improve your experience.",
  "Accepter": "Accept",
  "Refuser": "Decline",
  "Personnaliser": "Customize",
  "Tout accepter": "Accept all",
  "Tout refuser": "Decline all",

  // ============ Pricing / Packs ============
  "À partir de": "From",
  "Sur devis": "On quote",
  "Le plus populaire": "Most popular",
  "Recommandé": "Recommended",
  "HT": "excl. VAT",
  "TTC": "incl. VAT",
  "/ mois": "/ month",
  "par mois": "per month",
  "Choisir ce pack": "Choose this pack",
  "Voir le détail": "See details",

  // ============ Stats / labels ============
  "artistes accompagnés": "artists supported",
  "marques accompagnées": "brands supported",
  "années d'expérience": "years of experience",
  "années d’expérience": "years of experience",
  "projets livrés": "projects delivered",
  "campagnes": "campaigns",
  "vues générées": "views generated",
  "millions de vues": "million views",

  // ============ Misc UI ============
  "Oui": "Yes",
  "Non": "No",
  "Bientôt disponible": "Coming soon",
  "Nouveau": "New",
  "Voir la vidéo": "Watch video",
  "Lecture": "Play",
  "Pause": "Pause",
  "Muet": "Mute",
  "Son activé": "Sound on",
  "Plein écran": "Fullscreen",

  // ============ Legal page titles ============
  "Mentions légales du site": "Site legal notice",
  "Politique de confidentialité du site": "Site privacy policy",
  "Conditions générales de vente": "Terms and conditions of sale",
  "Conditions générales d'utilisation": "Terms and conditions of use",
  "Conditions générales d’utilisation": "Terms and conditions of use",

  // ============ Status messages ============
  "Message envoyé !": "Message sent!",
  "Merci, nous revenons vers vous rapidement.": "Thank you, we'll get back to you shortly.",
  "Une erreur est survenue.": "An error occurred.",
  "Champ obligatoire": "Required field",
  "Email invalide": "Invalid email",
  "Téléphone invalide": "Invalid phone",
};

let RUNTIME_OVERRIDES: Record<string, string> = {};

export function setRuntimeOverrides(map: Record<string, string>) {
  RUNTIME_OVERRIDES = map || {};
}

export function lookup(fr: string): string | null {
  const key = fr.trim();
  if (!key) return null;
  if (RUNTIME_OVERRIDES[key]) return RUNTIME_OVERRIDES[key];
  if (BASE_DICTIONARY[key]) return BASE_DICTIONARY[key];
  return null;
}

export function getAllKeys(): string[] {
  const set = new Set<string>([
    ...Object.keys(BASE_DICTIONARY),
    ...Object.keys(RUNTIME_OVERRIDES),
  ]);
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}
