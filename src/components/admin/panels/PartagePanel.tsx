import SettingsBlock from "../SettingsBlock";
import TeamEditor from "./editors/TeamEditor";
import ArtistesEditor from "./editors/ArtistesEditor";
import ClientsEditor from "./editors/ClientsEditor";
import PortfolioEditor from "./editors/PortfolioEditor";

/**
 * Sections PARTAGÉES entre plusieurs pages du site.
 * Vision, Équipe et Références (artistes + clients) apparaissent sur Accueil ET Artiste.
 * On les regroupe ici pour éviter le doublon dans les éditeurs par page.
 */
export default function PartagePanel() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="px-1">
        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Site / Global</p>
        <h2 className="font-clash text-2xl font-bold text-slate-900">Sections partagées</h2>
        <p className="text-xs text-slate-500 mt-1">
          Ces blocs apparaissent sur plusieurs pages (Accueil, Artiste…). Une seule modification met à jour partout.
        </p>
      </div>

      <SettingsBlock
        title="Vision — bloc « Notre vision »"
        description="Affiché sur la page d'accueil et sur la page Artiste."
        fields={[
          { key: "vision_kicker", label: "Sur-titre", placeholder: "Notre vision" },
          { key: "vision_title", label: "Titre" },
          { key: "vision_text", label: "Texte", type: "textarea" },
        ]}
      />

      <TeamEditor />

      <ArtistesEditor />

      <ClientsEditor />

      <PortfolioEditor />
    </div>
  );
}
