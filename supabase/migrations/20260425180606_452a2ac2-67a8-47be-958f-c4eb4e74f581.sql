-- 1) Supprimer les fiches artist_details vides (créées automatiquement par erreur)
DELETE FROM public.artist_details
WHERE coalesce(strategie,'') = ''
  AND coalesce(description,'') = ''
  AND coalesce(chiffre,'') = ''
  AND coalesce(array_length(plateformes, 1), 0) = 0;

-- 2) Seed des nouveaux settings pour la page Entreprise
INSERT INTO public.site_settings (key, value, type) VALUES
  ('entreprise_services_kicker', 'Services', 'text'),
  ('entreprise_services_title', 'Ce qu''on fait pour vous', 'text'),
  ('entreprise_services_subtitle', 'Une approche complète qui combine stratégie, contenu et performance.', 'text'),

  ('entreprise_ref_kicker', 'Références', 'text'),
  ('entreprise_ref_title_part1', 'Ils nous font', 'text'),
  ('entreprise_ref_title_accent', 'confiance', 'text'),
  ('entreprise_ref_subtitle', 'Des marques ambitieuses qui ont choisi l''excellence.', 'text'),
  ('entreprise_ref_footer_note', '+ de 150 projets réalisés avec succès', 'text'),

  ('final_cta_kicker', 'Prêt à grandir ?', 'text'),
  ('final_cta_title_line1', 'Faites passer votre entreprise', 'text'),
  ('final_cta_title_line2', 'au niveau supérieur', 'text'),
  ('final_cta_subtitle', 'Stratégie sur-mesure, exécution premium et résultats mesurables.\nChaque projet est une mission.', 'text'),
  ('final_cta_button', 'Contactez-nous', 'text'),

  -- Page d'entrée Gateway — libellés éditables
  ('gateway_artiste_label', 'Je suis un Artiste', 'text'),
  ('gateway_artiste_subtitle', 'Musique · Influence · Lancement', 'text'),
  ('gateway_artiste_cta', 'Entrer', 'text'),
  ('gateway_entreprise_label', 'Je suis une Entreprise', 'text'),
  ('gateway_entreprise_subtitle', 'Branding · Stratégie · Croissance', 'text'),
  ('gateway_entreprise_cta', 'Entrer', 'text')
ON CONFLICT (key) DO NOTHING;

-- 3) Supprimer les anciennes clés ctaband_entreprise (remplacées par final_cta_*)
DELETE FROM public.site_settings WHERE key IN (
  'ctaband_entreprise_title',
  'ctaband_entreprise_subtitle',
  'ctaband_entreprise_button'
);