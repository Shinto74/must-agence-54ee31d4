// ═══════════════════════════════════════
// Must Agence — Static Data Constants
// Fallback data before Supabase connection
// ═══════════════════════════════════════

// Toutes les images sont stockées dans Supabase Storage et servies via la BDD.
// Les valeurs ci-dessous sont des fallbacks vides — les composants lisent les vraies URL via site_settings.

export const SITE = {
  name: "Must Agence",
  tagline: "Influence Agency",
  logoWhite: "",
  logoGreen: "",
  hero: {
    label: "Must Agence",
    titleLine1: "On ne suit pas les tendances",
    titleAccent: "on les crée",
    subtitle: "On ne suit pas les tendances, on les crée.",
    subtitle2: "\n",
    ctaPrimary: "Démarrer un projet",
    ctaSecondary: "Découvrir nos pôles",
  },
  marqueeWords: ["MUSIQUE", "INFLUENCE", "MARKETING", "PRODUCTION", "ARTISTES", "MARQUES", "SOCIAL MEDIA", "BOOKING", "PLAYLISTING", "IDENTITÉ VISUELLE"],
  poles: {
    artiste: {
      tag: "Pôle Artiste",
      title: "Music & Entertainment",
      description: "Campagnes d'influence TikTok, activation de créateurs, stratégie de lancement et développement de carrière artistique.",
      chips: ["TikTok Ads", "Playlisting", "Sound Seeding", "Clips", "RP", "Booking"],
    },
    entreprise: {
      tag: "Pôle Entreprise",
      title: "Corporate & Business",
      description: "Marketing d'influence, growth hacking, social media et production de contenu premium. Approche 100% ROIste.",
      chips: ["Influence", "Social Media", "Growth", "Branding", "Contenu", "E-Réputation"],
    },
  },
  vision: {
    label: "Notre vision",
    titleLine1: "L'influence est",
    titleLine2: "une science.",
    quote: "Dans un monde de bruit, nous créons le signal. Nous ne cherchons pas des influenceurs, nous bâtissons des marques durables.",
    text: "L'algorithme n'est pas une loterie, c'est une science. On capture l'attention là où elle est la plus chère, on transforme la hype en business model pérenne, et on construit des empires digitaux.",
  },
  ctaBand: {
    title: "Prêt à propulser votre projet ?",
    subtitle: "On transforme la hype en résultats concrets.",
    button: "Nous contacter",
  },
  contact: {
    heading: "Parlons de votre projet.",
    text: "Votre projet mérite une stratégie sur mesure.",
    subtext: "Musique, influence ou branding — décrivez vos objectifs. On revient vers vous en 24h.",
    email: "contact@mustagence.com",
    phone: "+33 6 00 00 00 00",
    location: "Paris, France",
    whatsappUrl: "https://wa.me/33600000000",
  },
};

export const ARTIST_REFERENCES = {
  titleLine1: "Ils nous ont fait confiance",
  titleLine2: "pour leurs sorties",
  label: "Références Artistes",
  categories: [
    {
      name: "Urbain", slug: "urbain",
      artists: [
        { name: "Zola", image: `${GH}/artistes/zola.jpg` },
        { name: "Vegedream", image: `${GH}/artistes/vegedream.jpg` },
        { name: "Franglish", image: `${GH}/artistes/franglish.jpg` },
        { name: "Keblack", image: `${GH}/artistes/keblack.jpg` },
        { name: "Ridsa", image: `${GH}/artistes/ridsa.jpg` },
        { name: "Uzi", image: `${GH}/artistes/uzi.jpg` },
        { name: "Bouss", image: `${GH}/artistes/bouss.jpg` },
      ],
    },
    {
      name: "Pop / Variété", slug: "pop",
      artists: [
        { name: "Santa", image: `${GH}/artistes/santa.jpg` },
        { name: "Pierre Garnier", image: `${GH}/artistes/pierre-garnier.jpg` },
        { name: "Héléna Bailly", image: `${GH}/artistes/helena-bailly.jpg` },
        { name: "Jeck", image: `${GH}/artistes/jeck.jpg` },
      ],
    },
    {
      name: "Électro / International", slug: "electro",
      artists: [
        { name: "Diamond Platnumz", image: `${GH}/artistes/diamond-platnumz.jpeg` },
        { name: "Beéle", image: `${GH}/artistes/beele.jpg` },
        { name: "Benny Adam", image: `${GH}/artistes/benny-adam.jpg` },
        { name: "Theodora", image: `${GH}/artistes/theodora.jfif` },
        { name: "RnBoi", image: `${GH}/artistes/rnboi.jpg` },
        { name: "Moral", image: `${GH}/artistes/moral.jfif` },
        { name: "Ofenbach", image: `${GH}/artistes/ofenbach.jfif` },
        { name: "The Avener", image: `${GH}/artistes/the-avener.jfif` },
      ],
    },
  ],
};

export const ARTIST_DETAILS: Record<string, {
  strategie: string;
  description: string;
  plateformes: string[];
  chiffre?: string;
}> = {
  "Zola": {
    strategie: "Ingénierie Média & Visibilité",
    description: "Élaboration et pilotage de stratégies média en synergie avec les relations presse. Croissance via YouTube Ads ciblées pour maximiser l'impact des sorties.",
    plateformes: ["YouTube", "Spotify", "Presse"],
  },
  "Vegedream": {
    strategie: "Stratégie Marketing 360°",
    description: "Déploiement d'un écosystème promotionnel complet. Activation multi-plateformes et gestion budgétaire publicitaire pour une domination digitale totale.",
    plateformes: ["YouTube", "Spotify", "TikTok", "Instagram"],
  },
  "Ridsa": {
    strategie: "Direction Artistique & Lancement Album",
    description: "Conception de l'identité visuelle pour deux albums studios. Orchestration de la stratégie de sortie 360° incluant marketing opérationnel et campagnes d'acquisition.",
    plateformes: ["Spotify", "Instagram", "YouTube"],
  },
  "Benny Adam": {
    strategie: "Développement Artiste & Viral",
    description: "Accompagnement stratégique en amont du succès viral. Stratégie organique TikTok/IG, campagnes RP Radio/TV et déploiement publicitaire intensif.",
    chiffre: "+20M streams",
    plateformes: ["TikTok", "Instagram", "Spotify", "YouTube"],
  },
  "Diamond Platnumz": {
    strategie: "Export & Rayonnement International",
    description: "Pitch éditorial pour intégration dans les playlists majeures françaises. Campagnes TV et relations presse à l'échelle internationale.",
    plateformes: ["Spotify", "YouTube", "Presse"],
  },
  "Beéle": {
    strategie: "Export & Rayonnement International",
    description: "Pitch éditorial pour intégration dans les playlists majeures françaises. Campagnes TV et relations presse à l'échelle internationale.",
    plateformes: ["Spotify", "YouTube", "Presse"],
  },
  "Keblack": {
    strategie: "Optimisation Stream & Performance",
    description: "Spécialisation Playlist Game sur 2 mois. Maîtrise des outils publicitaires YouTube Ads, Spotify Ads et TikTok pour entrée en charts et rétention audience.",
    plateformes: ["Spotify", "YouTube", "TikTok"],
  },
  "Uzi": {
    strategie: "Optimisation Stream & Performance",
    description: "Spécialisation Playlist Game sur 2 mois. Maîtrise des outils publicitaires YouTube Ads, Spotify Ads et TikTok pour entrée en charts et rétention audience.",
    plateformes: ["Spotify", "YouTube", "TikTok"],
  },
  "Bouss": {
    strategie: "Optimisation Stream & Performance",
    description: "Spécialisation Playlist Game sur 2 mois. Maîtrise des outils publicitaires YouTube Ads, Spotify Ads et TikTok pour entrée en charts et rétention audience.",
    plateformes: ["Spotify", "YouTube", "TikTok"],
  },
};

export const COMPANY_REFERENCES = {
  titleLine1: "Ils nous accompagnent",
  titleLine2: "au quotidien",
  label: "Références Entreprises",
  categories: [
    {
      name: "Hôtellerie & Luxe",
      clients: [
        { name: "Novotel", logo: `${GH}/clients/novotel.webp` },
        { name: "Hilton", logo: `${GH}/clients/hilton.webp` },
        { name: "Jean Claude Biguine", logo: `${GH}/clients/jean-claude-biguine.png` },
      ],
    },
    {
      name: "Lifestyle & Sport",
      clients: [
        { name: "Fitness Park", logo: `${GH}/clients/fitness-park.webp` },
        { name: "Basic-Fit", logo: `${GH}/clients/basic-fit.webp` },
        { name: "JD Sports", logo: `${GH}/clients/jd-sports.webp` },
      ],
    },
    {
      name: "Habitat & Services",
      clients: [
        { name: "Leroy Merlin", logo: `${GH}/clients/leroy-merlin.webp` },
        { name: "Point P", logo: `${GH}/clients/point-p.webp` },
        { name: "Leclerc", logo: `${GH}/clients/leclerc.webp` },
        { name: "Norauto", logo: `${GH}/clients/norauto.webp` },
      ],
    },
    {
      name: "Food & Restauration",
      clients: [
        { name: "Les Grands Buffets", logo: `${GH}/clients/grands-buffets-narbonne.jpg` },
        { name: "Big Fernand", logo: `${GH}/clients/big-fernand.webp` },
        { name: "Five Guys", logo: `${GH}/clients/five-guys.webp` },
        { name: "Le Pain Quotidien", logo: `${GH}/clients/le-pain-quotidien.webp` },
        { name: "Columbus Café & Co", logo: `${GH}/clients/columbus-cafe.webp` },
      ],
    },
  ],
};

export const PACKS = [
  {
    number: "Pack 1", name: "L'Essentiel", subtitle: "La base solide pour un lancement réussi et une visibilité ciblée",
    price: "350€", priceSuffix: "HT", featured: false, badge: "",
    features: [
      "Promotion Playlisting (1 mois)",
      "Ads « Pop-up » Multi-plateformes",
      "DA & Stratégie Social Media",
    ],
    bonus: "3 mois TheArtist offert",
    reassurance: "Un interlocuteur dédié vous accompagne de A à Z pour garantir la cohérence de votre lancement",
  },
  {
    number: "Pack 2", name: "L'Ascension", subtitle: "Une force de frappe supérieure pour transformer votre titre en succès",
    price: "550€", priceSuffix: "HT", featured: true, badge: "Recommandé",
    features: [
      "Playlisting Étendu",
      "Double Impact Publicitaire",
      "Community Management (1 mois)",
      "Content Design",
    ],
    bonus: "6 mois TheArtist offert",
    reassurance: "Plus qu'une prestation, un véritable partenariat : votre équipe vit votre projet à vos côtés pour maximiser chaque opportunité",
  },
  {
    number: "Pack 3", name: "L'Explosion", subtitle: "La stratégie All-Inclusive pour installer votre carrière sur le long terme",
    price: "1 500€", priceSuffix: "HT", featured: false, badge: "",
    features: [
      "Pitch Éditorial",
      "Playlisting Long Terme",
      "YouTube & Google Ads",
      "Accompagnement VIP",
      "Relations Presse & Médias",
      "Ads Domination",
      "SEO Musique",
    ],
    bonus: "1 an TheArtist offert",
    reassurance: "Une War Room digitale à votre service : nous pilotons votre succès en temps réel avec une expertise 360°",
  },
  {
    number: "Pack 4", name: "Devis sur mesure", subtitle: "Votre vision mérite une stratégie sans limite, construite entièrement pour vous.",
    price: "Sur devis", priceSuffix: "", featured: false, badge: "Personnalisé",
    features: [
      "Diagnostic Complet (Deep Dive)",
      "Stratégie Propriétaire",
      "Exécution Full-Stack",
      "Creative Direction Personnalisée",
      "Reporting & Analytics Temps Réel",
      "Accès VIP War Room",
      "Réseau Partenaires Déverrouillé",
    ],
    bonus: "2 ans TheArtist offert",
    reassurance: "Aucun devis standard. Juste votre solution, sur mesure.",
  },
];

export const QUOTE_STEPS = [
  {
    title: "Votre profil", question: "Qui êtes-vous ?", type: "radio" as const,
    options: [
      { label: "Artiste Indépendant", icon: "🎤" },
      { label: "Label", icon: "🏢" },
      { label: "Entreprise", icon: "💼" },
    ],
  },
  {
    title: "Votre projet", question: "Décrivez votre vision", type: "textarea" as const,
    placeholder: "Décrivez votre projet, vos objectifs, votre univers...",
  },
  {
    title: "Votre budget", question: "Votre budget indicatif", type: "radio" as const,
    options: [
      { label: "Moins de 1k€", icon: "💰" },
      { label: "1k€ – 3k€", icon: "💰" },
      { label: "3k€ – 5k€", icon: "💎" },
      { label: "+5k€", icon: "🚀" },
    ],
  },
  {
    title: "Votre échéance", question: "Votre échéance", type: "date" as const,
  },
  {
    title: "Vos attentes", question: "Qu'attendez-vous de nous ?", type: "checkbox" as const,
    options: [
      { label: "Notoriété", icon: "📢" },
      { label: "Ventes", icon: "📈" },
      { label: "Image de marque", icon: "🎨" },
      { label: "Accompagnement humain", icon: "🤝" },
    ],
  },
];

export const ARTISTE_PAGE = {
  hero: {
    tag: "Pôle Artiste",
    titleLine1: "Music &",
    titleAccent: "Entertainment",
    description: "Campagnes d'influence TikTok, activation de créateurs, stratégie de lancement et développement de carrière artistique. Un accompagnement clé en main pour transformer votre talent en marque.",
    ctaPrimary: "Démarrer mon projet",
    ctaSecondary: "Nos services",
  },
  marqueeWords: ["SPOTIFY", "TIKTOK", "YOUTUBE", "UNIVERSAL MUSIC", "THE ARTIST"],
  marqueeLogos: [
    { name: "SPOTIFY", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg" },
    { name: "TIKTOK", logoUrl: "https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg" },
    { name: "YOUTUBE", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" },
    { name: "UNIVERSAL MUSIC", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Universal_Music_Group_logo.svg" },
    { name: "THE ARTIST", logoUrl: "https://raw.githubusercontent.com/Shinto74/IMAGES/5cd68f68ab87bf75e69b4962ee444f69d4620d7f/theartist.png", label: "THEARTIST" },
  ],
  ctaBand: {
    title: "Prêt à propulser votre carrière ?",
    subtitle: "On transforme votre talent en marque.",
    button: "Nous contacter",
  },
  contact: {
    heading: "Parlons de votre musique.",
    text: "Votre talent mérite une stratégie.",
    subtext: "Single, album, clip, campagne TikTok ou repositionnement – décrivez votre projet. On revient vers vous en 24h.",
    email: "contact@mustagence.com",
    formOptions: ["Single", "Album", "Clip", "Campagne TikTok", "Autre"],
  },
};

export const ENTREPRISE_PAGE = {
  hero: {
    tag: "Pôle Entreprise",
    titleLine1: "Corporate &",
    titleAccent: "Business",
    description: "Marketing d'influence, growth hacking, social media et production de contenu premium. Approche 100% ROIste.",
    ctaPrimary: "Démarrer mon projet",
    ctaSecondary: "Nos services",
  },
  marqueeWords: ["TIKTOK", "INSTAGRAM", "YOUTUBE", "GROWTH", "INFLUENCE"],
  marqueeLogos: [
    { name: "TIKTOK", logoUrl: "https://www.logo.wine/a/logo/TikTok/TikTok-Logo.wine.svg" },
    { name: "INSTAGRAM", logoUrl: "https://www.logo.wine/a/logo/Instagram/Instagram-Logo.wine.svg" },
    { name: "YOUTUBE", logoUrl: "https://www.logo.wine/a/logo/YouTube/YouTube-Logo.wine.svg" },
  ],
  ctaBand: {
    title: "Prêt à booster votre entreprise ?",
    subtitle: "On transforme votre marque en leader d'influence.",
    button: "Nous contacter",
  },
  contact: {
    heading: "Parlons de votre marque.",
    text: "Votre entreprise mérite une stratégie digitale puissante.",
    subtext: "Campagne influenceurs, social media, contenu premium – décrivez vos objectifs. On revient vers vous en 24h.",
    email: "contact@mustagence.com",
    formOptions: ["Influence Marketing", "Social Media", "Contenu Premium", "Growth Hacking", "Autre"],
  },
};

// Minimal exports to prevent import errors
export const TEAM: any[] = [];
export const STATS: any = { home: [], artiste: [], entreprise: [] };
export const SERVICES_ARTISTE: any[] = [];
export const SERVICES_ENTREPRISE: any[] = [];
export const EXPERTISE_ARTISTE: any[] = [];
export const EXPERTISE_ENTREPRISE: any[] = [];
export const PROCESS_ARTISTE: any[] = [];
export const PROCESS_ENTREPRISE: any[] = [];
export const PORTFOLIO: any[] = [];
