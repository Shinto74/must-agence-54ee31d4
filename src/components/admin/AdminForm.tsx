import { Loader2 } from "lucide-react";

interface Props {
  children: React.ReactNode;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}

export default function AdminForm({ children, onSave, onCancel, saving }: Props) {
  return (
    <div className="mt-4 rounded-xl border border-primary/20 bg-surface p-5 space-y-4 animate-in fade-in duration-200">
      {children}
      <div className="flex gap-2 pt-2">
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-mono hover:brightness-110 transition-all disabled:opacity-50"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-2.5 rounded-lg border border-border text-foreground text-sm font-mono hover:bg-muted/20 transition-colors"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
