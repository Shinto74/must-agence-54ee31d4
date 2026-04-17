import { Loader2, Check, X } from "lucide-react";

interface Props {
  children: React.ReactNode;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}

export default function AdminForm({ children, onSave, onCancel, saving }: Props) {
  return (
    <div className="mt-4 rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/40 to-white p-5 space-y-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="space-y-4">{children}</div>
      <div className="flex gap-2 pt-3 border-t border-slate-100">
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-all disabled:opacity-50 shadow-sm"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          <X size={14} /> Annuler
        </button>
      </div>
    </div>
  );
}
