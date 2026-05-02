-- Pages légales + flags d'affichage + champs hero brand
INSERT INTO public.site_settings (key, value, type) VALUES
  -- Hero brand éditable
  ('hero_artiste_brand_text', 'MUST AGENCE', 'text'),
  ('hero_artiste_brand_accent_index', '5', 'text'),
  -- Société (mentions légales)
  ('legal_company_name', 'MUST AGENCE', 'text'),
  ('legal_company_form', 'SASU', 'text'),
  ('legal_company_capital', '1 000 €', 'text'),
  ('legal_company_siret', '000 000 000 00000', 'text'),
  ('legal_company_rcs', 'Paris', 'text'),
  ('legal_company_vat', 'FR00 000000000', 'text'),
  ('legal_company_address', 'Paris, France', 'text'),
  ('legal_publication_director', 'Baptiste Gachet', 'text'),
  ('legal_host_name', 'Lovable Cloud (Supabase)', 'text'),
  ('legal_host_address', '970 Toa Payoh North, Singapore', 'text'),
  -- Pages légales (textes longs)
  ('legal_mentions_intro', 'Conformément aux dispositions des articles 6-III et 19 de la Loi n° 2004-575 du 21 juin 2004 pour la Confiance dans l''économie numérique, dite L.C.E.N., il est porté à la connaissance des utilisateurs et visiteurs du site les présentes mentions légales.', 'textarea'),
  ('legal_privacy_intro', 'La présente politique de confidentialité a pour but d''informer les utilisateurs du site sur la manière dont leurs informations personnelles sont collectées et traitées, conformément au Règlement Général sur la Protection des Données (RGPD).', 'textarea'),
  ('legal_privacy_data', 'Données collectées : nom, prénom, email, téléphone, contenu des messages envoyés via les formulaires, données de navigation (cookies). Finalités : répondre aux demandes de contact, gérer les devis et commandes, améliorer le site. Base légale : consentement et exécution contractuelle. Durée de conservation : 3 ans à compter du dernier contact pour les prospects, 10 ans pour les factures (obligation légale).', 'textarea'),
  ('legal_privacy_rights', 'Conformément au RGPD, vous disposez des droits d''accès, de rectification, d''effacement, de portabilité, de limitation et d''opposition concernant vos données personnelles. Pour exercer ces droits, contactez-nous à contact@mustagence.com. Vous pouvez également introduire une réclamation auprès de la CNIL.', 'textarea'),
  ('legal_cgv_intro', 'Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre MUST AGENCE et toute personne physique ou morale procédant à l''achat de prestations via le site.', 'textarea'),
  ('legal_cgv_prices', 'Les prix sont indiqués en euros hors taxes (HT). Le paiement s''effectue en ligne via Stripe, par carte bancaire. Les prestations sont livrées selon le calendrier convenu après confirmation de paiement.', 'textarea'),
  ('legal_cgv_withdrawal', 'Conformément à l''article L.221-28 du Code de la consommation, le droit de rétractation ne peut être exercé pour les prestations de services pleinement exécutées avant la fin du délai de rétractation et dont l''exécution a commencé après accord préalable exprès du consommateur. Pour les contrats B2B, le droit de rétractation ne s''applique pas.', 'textarea'),
  ('legal_cgu_intro', 'Les présentes Conditions Générales d''Utilisation (CGU) ont pour objet de définir les modalités de mise à disposition du site et son utilisation par l''utilisateur.', 'textarea'),
  ('legal_cgu_rules', 'L''utilisateur s''engage à utiliser le site conformément à sa destination, à ne pas porter atteinte aux droits de propriété intellectuelle de MUST AGENCE et à ne pas diffuser de contenus illicites.', 'textarea'),
  ('legal_cookies_intro', 'Le site utilise des cookies pour améliorer l''expérience utilisateur, mesurer l''audience et personnaliser les contenus. Vous pouvez à tout moment modifier vos préférences depuis le bandeau de consentement.', 'textarea'),
  ('legal_cookies_list', 'Cookies essentiels : nécessaires au fonctionnement du site (session, panier). Cookies de mesure d''audience : statistiques de visite anonymisées. Cookies tiers : Stripe (paiement), réseaux sociaux (boutons de partage).', 'textarea'),
  -- Flags d'affichage
  ('show_contact_email', 'true', 'text'),
  ('show_contact_phone', 'true', 'text'),
  ('show_contact_location', 'true', 'text'),
  ('show_social_instagram', 'true', 'text'),
  ('show_social_tiktok', 'true', 'text'),
  ('show_social_linkedin', 'true', 'text'),
  ('show_social_youtube', 'true', 'text'),
  ('show_logo_white', 'true', 'text'),
  ('show_logo_green', 'true', 'text')
ON CONFLICT (key) DO NOTHING;