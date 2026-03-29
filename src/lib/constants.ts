// ═══════════════════════════════════════
// Must Agence — Static Data Constants
// Fallback data before Supabase connection
// ═══════════════════════════════════════

const GH = "https://raw.githubusercontent.com/Shinto74/IMAGES/1ca68ce299df011d586098dc6c1a4202bd2d8dfb/must-agence";

export const SITE = {
  name: "Must Agence",
  tagline: "Influence Agency",
  logoWhite: `${GH}/logos/logo_blanc.png`,
  logoGreen: `${GH}/logos/logo_vert.png`,
  hero: {
    label: "Must Agence",
    titleLine1: "We don't follow",
    titleAccent: "the algorithm.",
    subtitle: "On ne suit pas les tendances, on les crée. Agence d'influence spécialisée musique et marques.",
    ctaPrimary: "Démarrer un projet",
    ctaSecondary: "Découvrir nos pôles",
  },
  marqueeWords: ["INFLUENCE", "STRATÉGIE", "MUSIQUE", "TIKTOK", "BRANDING", "VIRAL", "CAMPAGNES", "CRÉATEURS", "DIGITAL", "GROWTH"],
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
    email: "contact@mustagence.com",
    phone: "+33 6 00 00 00 00",
    whatsappUrl: "https://wa.me/33600000000",
    location: "Paris, France",
    heading: "Parlons de votre projet.",
    text: "L'algorithme n'attend pas. Vous non plus.",
    subtext: "Artiste, label, marque ou agence – décrivez votre ambition. On revient vers vous en 24h.",
  },
};

export const TEAM = [
  { name: "Marving D.", initials: "MD", role: "Fondateur & CEO", description: "Fondateur visionnaire. De la musique au digital, il a bâti l'agence à partir de rien." },
  { name: "Sofia L.", initials: "SL", role: "Directrice Artistique", description: "Créative obsessionnelle. Direction artistique, clips, identités visuelles." },
  { name: "Maxime C.", initials: "MC", role: "Head of Growth", description: "Architecte de croissance. SEO, Ads, funnels – il optimise chaque euro." },
  { name: "Nina D.", initials: "ND", role: "Social Media Lead", description: "Reine des tendances sociales. Contenus viraux, stratégie TikTok." },
];

export const STATS = {
  home: [
    { value: "500", label: "Vues générées", suffix: "M+" },
    { value: "400", label: "Campagnes TikTok", suffix: "+" },
    { value: "28", label: "Singles d'Or", suffix: "" },
    { value: "5", label: "Singles Diamant", suffix: "" },
  ],
  artiste: [
    { value: "50", label: "Artistes accompagnés", suffix: "+" },
    { value: "400", label: "Campagnes lancées", suffix: "+" },
    { value: "500", label: "Vues générées", suffix: "M" },
    { value: "28", label: "Singles d'Or", suffix: "" },
  ],
  entreprise: [
    { value: "100", label: "Clients entreprises", suffix: "+" },
    { value: "8", label: "ROAS moyen", suffix: "x" },
    { value: "45", label: "Réduction CPA", suffix: "%" },
    { value: "98", label: "Renouvellement", suffix: "%" },
  ],
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
      "Promotion Playlisting 1 mois (Spotify, Deezer, Apple Music)",
      "Ads Pop-up Multi-plateformes (Google, Meta, TikTok)",
      "DA & Stratégie Social Media",
    ],
    bonus: "1 mois d'abonnement The Artiste offert",
    reassurance: "Un interlocuteur dédié vous accompagne de A à Z pour garantir la cohérence de votre lancement",
  },
  {
    number: "Pack 2", name: "L'Ascension", subtitle: "Une force de frappe supérieure pour transformer votre titre en succès",
    price: "550€", priceSuffix: "HT", featured: true, badge: "Recommandé",
    features: [
      "Playlisting Étendu (réseau élargi curateurs)",
      "Double Impact Publicitaire (2 teasers)",
      "Community Management 1 mois",
      "Content Design (visuels de résultats)",
    ],
    bonus: "2 mois d'abonnement The Artiste offert",
    reassurance: "Plus qu'une prestation, un véritable partenariat : votre équipe vit votre projet à vos côtés pour maximiser chaque opportunité",
  },
  {
    number: "Pack 3", name: "L'Explosion", subtitle: "La stratégie All-Inclusive pour installer votre carrière sur le long terme",
    price: "1 500€", priceSuffix: "HT", featured: false, badge: "",
    features: [
      "Pitch Éditorial (Focus Track)",
      "Playlisting Long Terme 3 mois",
      "YouTube & Google Ads",
      "Accompagnement VIP 2 mois + WhatsApp dédié",
      "Relations Presse & Médias 1 mois",
      "Ads Domination (Meta, TikTok, Google)",
      "SEO Musique",
    ],
    bonus: "3 mois d'abonnement The Artiste offert",
    reassurance: "Une War Room digitale à votre service : nous pilotons votre succès en temps réel avec une expertise 360°",
  },
];

export const SERVICES_ARTISTE = [
  {
    number: "01", title: "Influence & TikTok Activation",
    description: "Campagnes d'influence sur-mesure avec notre réseau exclusif de créateurs TikTok, Instagram Reels et YouTube Shorts.",
    chips: ["TikTok Activation", "Creator Network", "Sound Seeding", "Viral Engineering"],
  },
  {
    number: "02", title: "Création Visuelle",
    description: "Pochettes d'album, clips musicaux, visuels Instagram et contenus lifestyle premium.",
    chips: ["Pochettes", "Clips", "Visuels", "Lifestyle"],
  },
  {
    number: "03", title: "Stratégie de Lancement",
    description: "Chaque sortie est un événement. Teasing multi-plateforme, rollout marketing calibré.",
    chips: ["Rollout", "Teasing", "Release Strategy", "Multi-plateforme"],
  },
  {
    number: "04", title: "Campagnes Ads & RP",
    description: "Ads haute performance sur Meta, Google, TikTok et Snapchat. Relations presse pour amplifier la portée.",
    chips: ["Meta Ads", "Google Ads", "TikTok Ads", "Relations Presse"],
  },
  {
    number: "05", title: "Brand Content & Storytelling",
    description: "Construire une image iconique, raconter une histoire authentique. Stratégie de contenu long terme.",
    chips: ["Storytelling", "Brand Content", "Identité", "Long Terme"],
  },
  {
    number: "06", title: "Booking & Partenariats",
    description: "On connecte les artistes aux marques. Collaborations stratégiques et opportunités business.",
    chips: ["Booking", "Partenariats", "Placements", "Événements"],
  },
];

export const SERVICES_ENTREPRISE = [
  {
    number: "01", title: "Influencer Marketing",
    description: "Campagnes d'influence end-to-end pour marques. Sélection de créateurs, brief, production UGC et suivi.",
    chips: ["Campagnes Influence", "Creator Selection", "UGC Strategy", "Performance Tracking"],
  },
  {
    number: "02", title: "Social Media Management",
    description: "Community management expert et gestion d'image de marque sur tous les réseaux sociaux.",
    chips: ["Community Management", "Planning éditorial", "Gestion d'Image", "Modération"],
  },
  {
    number: "03", title: "Production de Contenu",
    description: "Photographes et vidéastes mobiles. Contenu lifestyle, institutionnel et brand content premium.",
    chips: ["Photo Sur Site", "Vidéo Corporate", "Lifestyle", "Brand Content"],
  },
  {
    number: "04", title: "Growth Marketing",
    description: "SEO, Google Ads et Social Ads. Stratégie d'acquisition complète, optimisation de funnels.",
    chips: ["SEO", "Google Ads", "Social Ads", "Conversion Funnels"],
  },
  {
    number: "05", title: "Branding & Design",
    description: "Logos, chartes graphiques complètes et interfaces UI/UX. Identités visuelles qui marquent.",
    chips: ["Logo", "Charte Graphique", "UI/UX Design", "Identité Visuelle"],
  },
  {
    number: "06", title: "E-Réputation",
    description: "Protégez et renforcez votre image digitale. Gestion proactive des avis et veille concurrentielle.",
    chips: ["Gestion Avis", "Image Digitale", "Veille", "Réputation Online"],
  },
];

export const EXPERTISE_ARTISTE = [
  { number: "01", title: "Viral Engineering", text: "L'algorithme n'est pas une loterie, c'est une science. On capture l'attention là où elle est la plus chère." },
  { number: "02", title: "Icon Architecture", text: "On ne gère pas des carrières, on bâtit des dynasties. Branding, direction artistique, positionnement." },
  { number: "03", title: "Monetization", text: "La hype sans revenus ne sert à rien. On convertit l'influence en business model pérenne." },
];

export const EXPERTISE_ENTREPRISE = [
  { number: "01", title: "Influence Marketing", text: "Campagnes d'influence end-to-end. Sélection de créateurs, brief créatif, production et suivi des KPIs." },
  { number: "02", title: "Growth Hacking", text: "Testing, itération et optimisation de vos funnels d'acquisition. SEO, SEA, Social Ads." },
  { number: "03", title: "Brand Identity", text: "Positionnement, messaging et identité visuelle pour l'ère digitale. Des marques qui résonnent." },
];

export const PROCESS_ARTISTE = [
  { number: "01", title: "Brief & Audit", text: "Analyse de votre univers, audience, objectifs et potentiel viral." },
  { number: "02", title: "Stratégie", text: "Plan sur mesure, sélection créateurs, budgets et KPIs." },
  { number: "03", title: "Activation", text: "Lancement campagnes, seeding, production et diffusion." },
  { number: "04", title: "Reporting", text: "Analytics temps réel, Shazam lifts, streaming impact." },
];

export const PROCESS_ENTREPRISE = [
  { number: "01", title: "Audit Digital", text: "Analyse complète de votre présence, concurrents et opportunités marché." },
  { number: "02", title: "Stratégie Data-Driven", text: "Plan chiffré, objectifs SMART, KPIs clairs et budgets optimisés." },
  { number: "03", title: "Déploiement", text: "Lancement campagnes, production contenu, activation de tous les canaux." },
  { number: "04", title: "Reporting & Scale", text: "Dashboards temps réel, optimisation continue et stratégie de scale." },
];

export const PORTFOLIO = [
  {
    icon: "🎵", tag: "Artiste – TikTok Activation",
    title: "Lancement Single – Artiste Urban FR",
    description: "Campagne d'influence TikTok, 50+ créateurs activés, teasing viral et Ads multi-plateforme.",
    metrics: [{ value: "5M+", label: "Vues" }, { value: "+340%", label: "Streams" }, { value: "12x", label: "ROAS" }],
  },
  {
    icon: "🏷️", tag: "Brand – Influence Campaign",
    title: "Campagne Influence – Marque Mode",
    description: "Stratégie d'influence Instagram & TikTok avec 30 créateurs pour lancement nouvelle collection.",
    metrics: [{ value: "+180%", label: "CA en 6 mois" }, { value: "-45%", label: "CPA" }, { value: "8.5x", label: "ROAS" }],
  },
  {
    icon: "⭐", tag: "Artiste – Brand Building",
    title: "Repositionnement – Artiste Pop",
    description: "Refonte storytelling, DA complète, contenus lifestyle et partenariats marques stratégiques.",
    metrics: [{ value: "3", label: "Deals marques" }, { value: "+500%", label: "Engagement" }, { value: "Top 10", label: "Charts FR" }],
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
  marqueeWords: ["TIKTOK", "INFLUENCE", "CLIPS", "POCHETTES", "SOUND SEEDING", "RP", "BOOKING", "STORYTELLING", "ROLLOUT", "VIRAL"],
  ctaBand: {
    title: "Prêt à propulser votre carrière ?",
    subtitle: "On transforme votre talent en marque.",
    button: "Nous contacter",
  },
  contact: {
    heading: "Parlons de votre musique.",
    text: "Votre talent mérite une stratégie.",
    subtext: "Single, album, clip, campagne TikTok ou repositionnement – décrivez votre projet. On revient vers vous en 24h.",
    email: "artiste@mustagence.com",
    formOptions: ["Campagne TikTok / Influence", "Lancement single/album", "Clip musical", "Branding complet", "Autre"],
  },
  customOffer: {
    text: "Vous avez un projet hors-norme ou des besoins spécifiques pour votre entreprise ? Nous construisons votre stratégie à la carte.",
    button: "Demander un devis personnalisé",
  },
};

export const ENTREPRISE_PAGE = {
  hero: {
    tag: "Pôle Entreprise",
    titleLine1: "Corporate &",
    titleAccent: "Business",
    description: "Marketing d'influence, growth hacking, social media et production de contenu premium. Approche 100% ROIste et data-driven pour des résultats mesurables et une croissance durable.",
    ctaPrimary: "Démarrer mon projet",
    ctaSecondary: "Nos services",
  },
  marqueeWords: ["INFLUENCE", "SOCIAL MEDIA", "GROWTH", "BRANDING", "CONTENU", "E-RÉPUTATION", "SEO", "GOOGLE ADS", "UGC"],
  ctaBand: {
    title: "Prêt à accélérer votre croissance ?",
    subtitle: "On transforme votre budget en machine à résultats.",
    button: "Lancer mon projet",
  },
  contact: {
    heading: "Parlons business.",
    text: "Votre marque mérite de la performance.",
    subtext: "Détaillez vos objectifs. On revient avec une stratégie sur mesure en 24h.",
    email: "business@mustagence.com",
    formOptions: ["Influencer Marketing", "Social Media", "Production Contenu", "Growth / SEO / Ads", "Branding & Design", "E-Réputation"],
  },
};
