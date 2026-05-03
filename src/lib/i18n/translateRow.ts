import type { Lang } from "@/contexts/LanguageContext";

/**
 * Returns a copy of `row` where every string field is replaced by its
 * translation in `row.translations[lang][field]` when present and non-empty.
 *
 * Untranslated fields stay in French. Non-string fields and meta fields are kept as-is.
 */
export function translateRow<T extends Record<string, any>>(row: T, lang: Lang): T {
  if (!row || lang === "fr") return row;
  const tr = (row as any).translations?.[lang];
  if (!tr || typeof tr !== "object") return row;
  const out: any = { ...row };
  for (const k of Object.keys(tr)) {
    const v = tr[k];
    if (typeof v === "string" && v.trim()) out[k] = v;
    else if (Array.isArray(v) && v.length) out[k] = v;
  }
  return out;
}

export function translateRows<T extends Record<string, any>>(rows: T[] | undefined | null, lang: Lang): T[] {
  if (!rows) return [];
  if (lang === "fr") return rows;
  return rows.map((r) => translateRow(r, lang));
}
