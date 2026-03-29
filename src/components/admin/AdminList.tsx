import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";

interface Props<T> {
  items: T[];
  isLoading: boolean;
  label: string;
  onAdd: () => void;
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
  renderItem: (item: T) => React.ReactNode;
  idField?: string;
}

export default function AdminList<T extends Record<string, any>>({
  items, isLoading, label, onAdd, onEdit, onDelete, renderItem, idField = "id",
}: Props<T>) {
  const [confirmId, setConfirmId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-8 justify-center text-muted-foreground">
        <Loader2 size={16} className="animate-spin" /> Chargement…
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <p className="text-xs text-muted-foreground font-mono uppercase">
          {items.length} {label}{items.length > 1 ? "s" : ""}
        </p>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-mono hover:brightness-110 transition-all"
        >
          <Plus size={14} /> Ajouter
        </button>
      </div>

      <div className="space-y-1.5">
        {items.map((item) => {
          const id = item[idField];
          return (
            <div key={id} className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface hover:border-primary/20 transition-colors">
              <div className="flex-1 min-w-0">{renderItem(item)}</div>
              <div className="flex items-center gap-1.5 shrink-0 ml-3">
                <button onClick={() => onEdit(item)} className="px-2.5 py-1 rounded-lg text-xs font-mono text-primary hover:bg-primary/10 transition-colors">
                  Modifier
                </button>
                {confirmId === id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { onDelete(id); setConfirmId(null); }}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-destructive text-destructive-foreground"
                    >
                      Confirmer
                    </button>
                    <button
                      onClick={() => setConfirmId(null)}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono text-muted-foreground hover:text-foreground"
                    >
                      Non
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmId(id)}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
