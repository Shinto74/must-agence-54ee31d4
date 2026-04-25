import PortfolioEditor from "./editors/PortfolioEditor";

/**
 * Référentiels globaux — uniquement les données qui n'appartiennent à aucune page
 * en particulier. Vision, Équipe, Artistes et Clients sont désormais éditables
 * directement dans les panneaux de leur page (et sont partagés entre celles-ci).
 */
export default function PartagePanel() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="px-1">
        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Site / Global</p>
        <h2 className="font-clash text-2xl font-bold text-slate-900">Référentiels globaux</h2>
        <p className="text-xs text-slate-500 mt-1">
          Données transverses qui ne dépendent pas d'une page spécifique. La plupart
          des contenus partagés (Vision, Équipe, Artistes, Clients) sont gérés directement
          dans le panneau de leur page principale.
        </p>
      </div>

      <PortfolioEditor />
    </div>
  );
}
