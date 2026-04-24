import TableEditor from "./TableEditor";
import { useAdminCrud } from "../../useAdminCrud";

export default function ClientsEditor() {
  const cats = useAdminCrud("client_categories");
  const catOptions = (cats.data as any[]).map((c) => ({ label: c.name, value: c.id }));
  const getCatName = (id: string) => (cats.data as any[]).find((c) => c.id === id)?.name || "—";

  return (
    <div className="space-y-5">
      <TableEditor
        table="client_categories"
        title="Catégories de clients"
        label="catégorie"
        initialRecord={{ name: "" }}
        fields={[
          { key: "name", label: "Nom" },
          { key: "display_order", label: "Ordre", type: "number" },
        ]}
        renderItem={(item) => <p className="text-sm text-slate-900"><strong>{item.name}</strong></p>}
      />

      <TableEditor
        table="clients"
        title="Clients / Références"
        description="Logos affichés dans le carrousel références entreprises"
        label="client"
        initialRecord={{ name: "", logo_url: "", category_id: catOptions[0]?.value || "" }}
        fields={[
          { key: "name", label: "Nom" },
          { key: "logo_url", label: "Logo", type: "image", imageFolder: "clients" },
          { key: "category_id", label: "Catégorie", type: "select", options: catOptions },
          { key: "display_order", label: "Ordre", type: "number" },
        ]}
        renderItem={(item) => (
          <div className="flex items-center gap-2.5">
            {item.logo_url && <img src={item.logo_url} alt="" className="w-12 h-8 object-contain bg-slate-50 rounded p-1" />}
            <p className="text-sm text-slate-900">
              <strong>{item.name}</strong>{" "}
              <span className="text-indigo-600 text-xs">{getCatName(item.category_id)}</span>
            </p>
          </div>
        )}
      />
    </div>
  );
}
