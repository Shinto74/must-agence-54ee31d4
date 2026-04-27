import { useAdminCrud } from "../../useAdminCrud";
import AdminField from "../../AdminField";
import AdminForm from "../../AdminForm";
import AdminList from "../../AdminList";

export interface FieldDef {
  key: string;
  label: string;
  type?: "text" | "textarea" | "image" | "number" | "select" | "checkbox";
  options?: { label: string; value: string }[];
  imageFolder?: string;
  hint?: string;
  placeholder?: string;
  fullWidth?: boolean;
}

interface Props {
  table: string;
  title: string;
  description?: string;
  fields: FieldDef[];
  initialRecord?: Record<string, any>;
  /** filter rows displayed (e.g., page === "home") */
  filter?: (row: any) => boolean;
  /** how to render the list item summary */
  renderItem: (item: any) => React.ReactNode;
  label: string; // singular noun for "Ajouter un X"
  orderBy?: string;
  idField?: string;
  /** extra content rendered inside the editing form (e.g. media gallery for the row) */
  renderExtra?: (row: any) => React.ReactNode;
  /** extra react-query keys to invalidate after CRUD (so front-site queries refresh) */
  extraInvalidateKeys?: string[][];
}

export default function TableEditor({
  table, title, description, fields, initialRecord, filter, renderItem, label, orderBy, idField, renderExtra, extraInvalidateKeys,
}: Props) {
  const crud = useAdminCrud(table, { orderBy, idField, extraInvalidateKeys });
  const baseItems = filter ? (crud.data as any[]).filter(filter) : (crud.data as any[]);
  const items = baseItems.map((it: any, __index: number) => ({ ...it, __index }));

  const startAdd = () => {
    const base: any = { display_order: items.length, ...(initialRecord || {}) };
    crud.setEditing(base);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 lg:p-6">
      <header className="mb-4">
        <h3 className="font-clash text-base font-bold text-slate-900">{title}</h3>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </header>

      <AdminList
        items={items}
        isLoading={crud.isLoading}
        label={label}
        idField={idField}
        onAdd={startAdd}
        onEdit={(item: any) => {
          const { __index, ...clean } = item;
          crud.setEditing(clean as any);
        }}
        onDelete={(id) => crud.remove(id)}
        renderItem={renderItem}
      />

      {crud.editing && (
        <AdminForm
          onSave={() => crud.save(crud.editing!)}
          onCancel={() => crud.setEditing(null)}
          saving={crud.saving}
        >
          {fields.map((f) => (
            <AdminField
              key={f.key}
              label={f.label || f.key}
              type={f.type as any}
              options={f.options}
              placeholder={f.placeholder}
              imageFolder={f.imageFolder}
              hint={f.hint}
              value={(crud.editing as any)[f.key]}
              onChange={(v) => {
                const val = f.type === "number" ? (parseInt(v) || 0) : v;
                crud.setEditing({ ...(crud.editing as any), [f.key]: val });
              }}
            />
          ))}
          {renderExtra && crud.editing && (crud.editing as any).id && (
            <div className="mt-4 -mx-2">{renderExtra(crud.editing)}</div>
          )}
        </AdminForm>
      )}
    </section>
  );
}
