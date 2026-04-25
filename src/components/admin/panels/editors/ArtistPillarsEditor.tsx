import TableEditor from "./TableEditor";

/**
 * Éditeur des 5 piliers d'expertise (section ArtisteServicesV4B).
 * Pour les détails de chaque pilier (puces gauche/droite), voir PillarDetailsEditor.
 */
export default function ArtistPillarsEditor() {
  return (
    <TableEditor
      table="artist_pillars"
      title="Piliers Artiste — Section split-screen"
      description="Les 5 piliers de la section 'Comment on transforme votre talent en marque'. Le numéro 01, 02… est généré automatiquement selon la position."
      label="pilier"
      initialRecord={{
        statement: "",
        description: "",
        left_title: "Bénéfices clés",
        right_title: "Ce qu'on déploie",
        icon: "Zap",
        accent_hue: 73,
      }}
      fields={[
        { key: "statement", label: "Phrase principale (gauche)", type: "textarea" },
        { key: "description", label: "Description (sous-titre)", type: "textarea" },
        { key: "left_title", label: "Titre colonne gauche", placeholder: "Bénéfices clés" },
        { key: "right_title", label: "Titre colonne droite", placeholder: "Ce qu'on déploie" },
        { key: "icon", label: "Icône (Lucide)", placeholder: "Zap, Target, Sparkles…" },
        { key: "accent_hue", label: "Teinte couleur (0-360)", type: "number", hint: "73 = vert néon, 200 = bleu, 0 = rouge…" },
        { key: "display_order", label: "Position", type: "number" },
      ]}
      renderItem={(item: any) => {
        const idx = (item.__index ?? 0) + 1;
        const num = String(idx).padStart(2, "0");
        return (
          <p className="text-sm text-slate-900">
            <span className="font-mono text-xs text-slate-400">{num}</span>{" "}
            <strong>{item.statement?.slice(0, 60) || "(sans titre)"}</strong>
            <span className="text-slate-400 text-xs ml-2">hue {item.accent_hue}</span>
          </p>
        );
      }}
    />
  );
}
