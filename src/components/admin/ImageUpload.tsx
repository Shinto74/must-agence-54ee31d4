import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  folder?: string;
  className?: string;
}

export default function ImageUpload({ value, onChange, bucket = "site-assets", folder = "uploads", className }: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeName = file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9-_]+/g, "-").replace(/^-+|-+$/g, "");
    const path = `${folder}/${Date.now()}-${safeName || "image"}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) {
      toast.error("Erreur lors de l'upload : " + error.message);
      setPreview(null);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    onChange(data.publicUrl);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
    toast.success("Image envoyée ✓");
    setUploading(false);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Show preview immediately
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
    upload(file);
  };

  const displayUrl = preview || value;

  return (
    <div className={className}>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      {displayUrl ? (
        <div className="relative group w-full aspect-video rounded-lg overflow-hidden border border-border bg-muted/20">
          <img src={displayUrl} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-mono"
            >
              {uploading ? <Loader2 size={14} className="animate-spin" /> : "Changer"}
            </button>
            <button
              onClick={() => { onChange(""); setPreview(null); }}
              className="px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-xs font-mono"
            >
              Retirer
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full aspect-video rounded-lg border-2 border-dashed border-border bg-muted/10 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
        >
          {uploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
          <span className="text-xs font-mono">Cliquer pour uploader</span>
        </button>
      )}
    </div>
  );
}
