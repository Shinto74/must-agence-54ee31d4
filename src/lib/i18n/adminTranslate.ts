/**
 * Helpers d'édition admin pour la colonne `translations` JSONB.
 * Format : { en: { fieldKey: "english value", ... } }
 */

export type Translations = { en?: Record<string, string> } & Record<string, any>;

export function getEn(row: any, field: string): string {
  return row?.translations?.en?.[field] ?? "";
}

export function setEnField(translations: any, field: string, value: string): Translations {
  const en = { ...(translations?.en || {}) };
  if (value && value.trim()) en[field] = value;
  else delete en[field];
  return { ...(translations || {}), en };
}

/** Clés JAMAIS traduisibles (technique / média / numérique). */
const NON_TRANSLATABLE_KEYS = new Set([
  "id", "display_order", "created_at", "updated_at",
  "image_url", "logo_url", "video_url", "url", "poster",
  "slug", "icon", "accent_hue", "featured", "freeze_on_hover",
  "kind", "page", "category_id", "pillar_id", "pack_id",
  "artist_id", "step_id", "service_id", "case_id",
  "owner_id", "owner_table", "price", "number",
  "stripe_session_id", "stripe_payment_intent_id", "price_id",
  "feature_prefix", "amount", "currency", "environment", "status",
  "user_id", "role", "translations",
]);

const NON_TRANSLATABLE_SUFFIXES = ["_url", "_id", "_order", "_show", "_index", "_hue"];

export function isTranslatableKey(key: string): boolean {
  if (NON_TRANSLATABLE_KEYS.has(key)) return false;
  if (NON_TRANSLATABLE_SUFFIXES.some((s) => key.endsWith(s))) return false;
  return true;
}

export function isTranslatableType(type?: string): boolean {
  if (!type) return true;
  return type === "text" || type === "textarea" || type === "url";
}
