import SettingsBlock from "../SettingsBlock";
import MarqueeEditor from "./editors/MarqueeEditor";
import StatsEditor from "./editors/StatsEditor";
import SectorsEditor from "./editors/SectorsEditor";
import ServicesEntrepriseEditor from "./editors/ServicesEntrepriseEditor";
import ExpertiseEntrepriseEditor from "./editors/ExpertiseEntrepriseEditor";
import ProcessEntrepriseEditor from "./editors/ProcessEntrepriseEditor";

export default function PageEntreprisePanel() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="px-1">
        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Site / Pages</p>
        <h2 className="font-clash text-2xl font-bold text-slate-900">Page Entreprise</h2>
        <p className="text-xs text-slate-500 mt-1">Pôle Corporate & Business.</p>
      </div>

      <SettingsBlock
        title="Hero — Bannière Entreprise"
        fields={[
          { key: "hero_entreprise_badge", label: "Badge / Tag" },
          { key: "hero_entreprise_title_line1", label: "Titre — ligne 1" },
          { key: "hero_entreprise_title_line2", label: "Titre — ligne 2" },
          { key: "hero_entreprise_subtitle", label: "Sous-titre", type: "textarea" },
          { key: "hero_entreprise_description", label: "Description", type: "textarea" },
          { key: "hero_entreprise_cta_primary", label: "Bouton principal" },
          { key: "hero_entreprise_cta_secondary", label: "Bouton secondaire" },
          { key: "hero_entreprise_video_url", label: "Vidéo de fond", type: "image", hint: "URL d'une vidéo MP4" },
        ]}
      />

      <SettingsBlock
        title="Hero — Statistiques affichées"
        description="Trois chiffres-clés affichés sur le hero entreprise"
        fields={[
          { key: "hero_entreprise_stat1_value", label: "Stat 1 — valeur" },
          { key: "hero_entreprise_stat1_suffix", label: "Stat 1 — suffixe" },
          { key: "hero_entreprise_stat1_label", label: "Stat 1 — libellé" },
          { key: "hero_entreprise_stat2_value", label: "Stat 2 — valeur" },
          { key: "hero_entreprise_stat2_suffix", label: "Stat 2 — suffixe" },
          { key: "hero_entreprise_stat2_label", label: "Stat 2 — libellé" },
          { key: "hero_entreprise_stat3_value", label: "Stat 3 — valeur" },
          { key: "hero_entreprise_stat3_suffix", label: "Stat 3 — suffixe" },
          { key: "hero_entreprise_stat3_label", label: "Stat 3 — libellé" },
        ]}
      />

      <MarqueeEditor page="entreprise" title="Bandeau défilant — Entreprise" />

      <StatsEditor page="entreprise" title="Statistiques Entreprise" />

      <SettingsBlock
        title="Secteurs — Orbite 3D"
        fields={[
          { key: "entreprise_sectors_title", label: "Titre" },
          { key: "entreprise_sectors_subtitle", label: "Sous-titre", type: "textarea" },
          { key: "entreprise_orbit_title", label: "Titre orbite 3D" },
        ]}
      />
      <SectorsEditor />

      <ServicesEntrepriseEditor />

      <ExpertiseEntrepriseEditor />

      <ProcessEntrepriseEditor />
    </div>
  );
}
