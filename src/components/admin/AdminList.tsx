import { useState } from "react";
import { Plus, Loader2, Pencil, Trash2, Inbox } from "lucide-react";

interface Props<T> {
  items: T[];
  isLoading: boolean;
  label: string;
  onAdd: () => void;
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
  renderItem: (item: T) => React.ReactNode;
  idField?: string;
  hideAdd?: boolean;
}

export default function AdminList<T extends Record<string, any>>({
  items, isLoading, label, onAdd, onEdit, onDelete, renderItem, idField = "id", hideAdd = false,
}: Props<T>) {
  const [confirmId, setConfirmId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-8 justify-center text-slate-400">
        <Loader2 size={16} className="animate-spin" /> Chargement…
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <p className="text-[11px] text-slate-500 font-mono uppercase tracking-wider">
          {items.length} {label}{items.length > 1 ? "s" : ""}
        </p>
        {!hideAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Plus size={13} /> Ajouter
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 px-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
          <Inbox size={24} className="text-slate-300 mb-2" />
          <p className="text-xs text-slate-500">Aucun {label} pour le moment</p>
          {!hideAdd && (
            <button
              onClick={onAdd}
              className="mt-3 text-xs font-medium text-indigo-600 hover:text-indigo-700"
            >
              + Ajouter le premier
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-1.5">
          {items.map((item) => {
            const id = item[idField];
            return (
              <div
                key={id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div className="flex-1 min-w-0">{renderItem(item)}</div>
                <div className="flex items-center gap-1 shrink-0 ml-3">
                  <button
                    onClick={() => onEdit(item)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="Modifier"
                  >
                    <Pencil size={12} /> <span className="hidden sm:inline">Modifier</span>
                  </button>
                  {confirmId === id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { onDelete(id); setConfirmId(null); }}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                      >
                        Confirmer
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                      >
                        Non
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmId(id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={12} /> <span className="hidden sm:inline">Supprimer</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
