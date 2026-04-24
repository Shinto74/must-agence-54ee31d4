import TableEditor from "./TableEditor";

export default function TeamEditor() {
  return (
    <TableEditor
      table="team_members"
      title="Équipe"
      description="Membres affichés sur la page d'accueil"
      label="membre"
      initialRecord={{ name: "", initials: "", role: "", description: "", image_url: "" }}
      fields={[
        { key: "name", label: "Nom" },
        { key: "initials", label: "Initiales" },
        { key: "role", label: "Rôle" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "image_url", label: "Photo", type: "image", imageFolder: "team" },
        { key: "display_order", label: "Ordre", type: "number" },
      ]}
      renderItem={(item) => (
        <div className="flex items-center gap-2.5">
          {item.image_url ? (
            <img src={item.image_url} alt="" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-[10px] font-bold">{item.initials}</div>
          )}
          <p className="text-sm text-slate-900"><strong>{item.name}</strong> <span className="text-slate-500">— {item.role}</span></p>
        </div>
      )}
    />
  );
}
