import TableEditor from "./TableEditor";

export default function TheArtistFeaturesEditor() {
  return (
    <TableEditor
      table="theartist_features"
      title="TheArtist — Features"
      description="Pills affichés dans la section TheArtist"
      label="feature"
      initialRecord={{ title: "", description: "" }}
      fields={[
        { key: "title", label: "Titre" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "display_order", label: "Ordre", type: "number" },
      ]}
      renderItem={(item) => <p className="text-sm text-slate-900"><strong>{item.title}</strong> <span className="text-slate-500">— {item.description}</span></p>}
    />
  );
}
