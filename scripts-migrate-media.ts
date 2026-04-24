// Migration script: download external media (GitHub, etc.) → upload to Supabase Storage → update DB rows
import { createClient } from "@supabase/supabase-js";
import { extname, basename } from "node:path";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET = "site-assets";

const supa = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

const isExternal = (url?: string | null) =>
  !!url && /^https?:\/\//.test(url) && !url.includes("supabase.co/storage");

const sanitize = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9._-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

async function downloadAndUpload(url: string, folder: string, baseName: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`[skip] ${url} -> HTTP ${res.status}`);
      return null;
    }
    const buf = new Uint8Array(await res.arrayBuffer());
    const contentType = res.headers.get("content-type") || "application/octet-stream";

    // Pick extension from URL or content-type
    let ext = extname(new URL(url).pathname).toLowerCase();
    if (!ext) {
      const map: Record<string, string> = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
        "image/svg+xml": ".svg",
        "image/gif": ".gif",
      };
      ext = map[contentType] || ".bin";
    }
    if (ext === ".jfif") ext = ".jpg";

    const path = `${folder}/${sanitize(baseName)}-${Date.now()}${ext}`;
    const { error } = await supa.storage.from(BUCKET).upload(path, buf, {
      contentType,
      upsert: true,
    });
    if (error) {
      console.error(`[upload error] ${url}:`, error.message);
      return null;
    }
    const { data } = supa.storage.from(BUCKET).getPublicUrl(path);
    console.log(`[ok] ${url}\n  -> ${data.publicUrl}`);
    return data.publicUrl;
  } catch (e: any) {
    console.error(`[error] ${url}:`, e.message);
    return null;
  }
}

async function migrateTable<T extends Record<string, any>>(
  table: string,
  urlField: string,
  nameField: string,
  folder: string,
  pkField = "id",
) {
  console.log(`\n=== ${table}.${urlField} ===`);
  const { data, error } = await supa.from(table).select("*");
  if (error) {
    console.error(`Read error on ${table}:`, error);
    return;
  }
  let count = 0;
  for (const row of data as T[]) {
    const url = row[urlField];
    if (!isExternal(url)) continue;
    const baseName = row[nameField] || basename(url);
    const newUrl = await downloadAndUpload(url, folder, baseName);
    if (!newUrl) continue;
    const { error: updErr } = await supa
      .from(table)
      .update({ [urlField]: newUrl })
      .eq(pkField, row[pkField]);
    if (updErr) console.error(`Update error ${table} ${row[pkField]}:`, updErr.message);
    else count++;
  }
  console.log(`→ ${count} rows updated`);
}

async function migrateSettings() {
  console.log(`\n=== site_settings (type=image) ===`);
  const { data, error } = await supa.from("site_settings").select("*").eq("type", "image");
  if (error) {
    console.error(error);
    return;
  }
  let count = 0;
  for (const row of data) {
    if (!isExternal(row.value)) continue;
    const newUrl = await downloadAndUpload(row.value, "settings", row.key);
    if (!newUrl) continue;
    const { error: updErr } = await supa.from("site_settings").update({ value: newUrl }).eq("key", row.key);
    if (updErr) console.error(`Update error settings ${row.key}:`, updErr.message);
    else count++;
  }
  console.log(`→ ${count} settings updated`);
}

(async () => {
  await migrateSettings();
  await migrateTable("artists", "image_url", "name", "artistes");
  await migrateTable("clients", "logo_url", "name", "clients");
  await migrateTable("team_members", "image_url", "name", "team");
  await migrateTable("entreprise_sectors", "image_url", "name", "sectors");
  await migrateTable("marquee_items", "image_url", "text_value", "marquee");
  console.log("\nDone.");
})();
