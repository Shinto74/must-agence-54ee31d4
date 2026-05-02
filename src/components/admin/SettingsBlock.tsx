import { useState, useEffect } from "react";
import { useAdminCrud } from "./useAdminCrud";
import ImageUpload from "./ImageUpload";
import { Loader2, Check } from "lucide-react";

export type SettingFieldType = "text" | "textarea" | "image" | "video" | "media" | "url" | "boolean" | "number";

export interface SettingField {
  key: string;
  label: string;
  type?: SettingFieldType;
  placeholder?: string;
  hint?: string;
  imageFolder?: string;
}

interface Props {
  title: string;
  description?: string;
  fields: SettingField[];
  imageFolder?: string;
}

/**
 * Bloc d'édition de paramètres groupés.
 * Gère les site_settings par clé avec sauvegarde individuelle et auto-save.
 */
export default function SettingsBlock({ title, description, fields, imageFolder = "settings" }: Props) {
  const crud = useAdminCrud("site_settings", { idField: "key", orderBy: "key" });

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 lg:p-6">
      <header className="mb-5">
        <h3 className="font-clash text-base font-bold text-slate-900">{title}</h3>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </header>
      <div className="space-y-4">
        {fields.map((f) => (
          <SettingRow key={f.key} field={f} crud={crud} imageFolder={f.imageFolder || imageFolder} />
        ))}
      </div>
    </section>
  );
}

function SettingRow({ field, crud, imageFolder }: { field: SettingField; crud: ReturnType<typeof useAdminCrud>; imageFolder: string }) {
  const dbRow = (crud.data as any[]).find((s) => s.key === field.key);
  const dbValue = dbRow?.value || "";
  const [value, setValue] = useState(dbValue);
  const [touched, setTouched] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    if (!touched) setValue(dbValue);
  }, [dbValue, touched]);

  const isMediaField = field.type === "image" || field.type === "video" || field.type === "media";
  const persistedType = field.type === "video" ? "video" : field.type === "media" ? "media" : field.type === "image" ? "image" : field.type === "textarea" ? "textarea" : "text";

  const save = async () => {
    if (value === dbValue) return;
    await crud.save({
      key: field.key,
      value,
      type: persistedType,
    } as any);
    setTouched(false);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  };

  const onBlur = () => {
    if (touched) save();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-2 lg:gap-4 items-start">
      <div className="pt-2">
        <label className="text-xs font-medium text-slate-700 block">{field.label}</label>
        {field.hint && <p className="text-[10px] text-slate-400 mt-0.5">{field.hint}</p>}
      </div>
      <div className="relative">
        {isMediaField ? (
          <>
            <ImageUpload
              value={value}
              accept={field.type === "video" ? "video" : field.type === "media" ? "any" : "image"}
              onChange={(v) => {
                setValue(v);
                setTouched(true);
                // auto-save media immediately
                setTimeout(() => {
                  crud.save({ key: field.key, value: v, type: persistedType } as any).then(() => {
                    setTouched(false);
                    setSavedFlash(true);
                    setTimeout(() => setSavedFlash(false), 1500);
                  });
                }, 50);
              }}
              folder={imageFolder}
            />
            <input
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setTouched(true);
              }}
              onBlur={onBlur}
              placeholder={field.type === "video" ? "Coller une URL .mp4" : "Coller une URL"}
              className="mt-2 w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </>
        ) : field.type === "textarea" ? (
          <textarea
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setTouched(true);
            }}
            onBlur={onBlur}
            placeholder={field.placeholder}
            rows={3}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none"
          />
        ) : field.type === "boolean" ? (
          <label className="inline-flex items-center gap-3 cursor-pointer select-none py-2">
            <span className="relative inline-block w-11 h-6">
              <input
                type="checkbox"
                checked={String(value).toLowerCase() !== "false" && value !== ""}
                onChange={(e) => {
                  const v = e.target.checked ? "true" : "false";
                  setValue(v);
                  setTouched(true);
                  setTimeout(() => {
                    crud.save({ key: field.key, value: v, type: "text" } as any).then(() => {
                      setTouched(false);
                      setSavedFlash(true);
                      setTimeout(() => setSavedFlash(false), 1500);
                    });
                  }, 30);
                }}
                className="peer sr-only"
              />
              <span className="absolute inset-0 rounded-full bg-slate-300 peer-checked:bg-emerald-500 transition-colors" />
              <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
            </span>
            <span className="text-xs text-slate-600">
              {String(value).toLowerCase() !== "false" && value !== "" ? "Affiché" : "Masqué"}
            </span>
          </label>
        ) : (
          <input
            type={field.type === "url" ? "url" : "text"}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setTouched(true);
            }}
            onBlur={onBlur}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        )}
        <div className="absolute -right-1 -top-1 flex items-center gap-1">
          {crud.saving && touched && <Loader2 size={12} className="text-indigo-500 animate-spin" />}
          {savedFlash && <Check size={12} className="text-emerald-500" />}
        </div>
      </div>
    </div>
  );
}
