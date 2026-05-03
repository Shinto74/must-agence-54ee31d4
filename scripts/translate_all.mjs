import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const LOVABLE_KEY = process.env.LOVABLE_API_KEY;

// Map: table -> string fields that need translation
const SCHEMA = {
  packs: ['name', 'subtitle', 'price', 'price_suffix', 'badge', 'bonus', 'reassurance'],
  pack_features: ['text'],
  pack_tooltips: ['tooltip_text'],
  artist_pillars: ['left_title', 'right_title', 'statement', 'description'],
  pillar_left_items: ['text'],
  pillar_right_items: ['text'],
  services_artiste: ['title', 'description'],
  services_entreprise: ['title', 'description'],
  service_artiste_chips: ['text'],
  service_entreprise_chips: ['text'],
  team_members: ['role', 'description'],
  artist_details: ['strategie', 'description', 'chiffre'],
  artist_categories: ['name'],
  artists: [], // names stay as-is
  expertise_artiste: ['title', 'text'],
  expertise_entreprise: ['title', 'text'],
  process_artiste: ['title', 'text'],
  process_entreprise: ['title', 'text'],
  theartist_features: ['title', 'description'],
  clip_portugal_advantages: ['title', 'description'],
  portfolio_cases: ['title', 'description', 'tag'],
  case_metrics: ['label', 'value'],
  stats: ['label', 'suffix'],
  marquee_items: ['text_value'],
  entreprise_sectors: ['name', 'description'],
  contact_form_types: ['label'],
  contact_sectors: ['name'],
  form_steps: ['title', 'question', 'placeholder', 'hint'],
  form_options: ['label'],
};

async function translateBatch(items) {
  // items: [{key, fr}]
  const prompt = `Translate the following French marketing/UI strings to English. Keep the tone premium, concise, brand-savvy (music/talent agency "Must Agence"). Preserve proper nouns (artist names, brand names like "Must Agence", "TheArtist"). Keep punctuation and casing style. If a string is already English or is a number/symbol/proper noun only, return it unchanged.

Return STRICT JSON: {"translations": {"<key>": "<english>"}}.

Input:
${JSON.stringify(Object.fromEntries(items.map(i => [i.key, i.fr])), null, 2)}`;

  const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${LOVABLE_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    }),
  });
  if (!res.ok) {
    console.error('AI error', res.status, await res.text());
    throw new Error('AI fail');
  }
  const j = await res.json();
  const content = j.choices[0].message.content;
  return JSON.parse(content).translations || {};
}

async function processTable(table, fields) {
  if (!fields.length) { console.log(`-- skip ${table} (no fields)`); return; }
  const { data, error } = await supabase.from(table).select('id,' + fields.join(',') + ',translations');
  if (error) { console.error(table, error); return; }
  if (!data?.length) return;

  // Build flat list to translate
  const items = [];
  for (const row of data) {
    for (const f of fields) {
      const v = row[f];
      if (typeof v === 'string' && v.trim()) {
        items.push({ key: `${row.id}|${f}`, fr: v });
      }
    }
  }
  if (!items.length) return;
  console.log(`${table}: translating ${items.length} strings (${data.length} rows)`);

  // Chunk by ~30 items
  const CHUNK = 30;
  const all = {};
  for (let i = 0; i < items.length; i += CHUNK) {
    const slice = items.slice(i, i + CHUNK);
    let attempts = 0;
    while (attempts < 3) {
      try {
        const r = await translateBatch(slice);
        Object.assign(all, r);
        break;
      } catch (e) {
        attempts++; await new Promise(r => setTimeout(r, 1000 * attempts));
      }
    }
  }

  // Build translations per row and update
  for (const row of data) {
    const en = {};
    for (const f of fields) {
      const k = `${row.id}|${f}`;
      if (all[k]) en[f] = all[k];
    }
    if (!Object.keys(en).length) continue;
    const newTr = { ...(row.translations || {}), en: { ...((row.translations||{}).en||{}), ...en } };
    const { error: ue } = await supabase.from(table).update({ translations: newTr }).eq('id', row.id);
    if (ue) console.error(table, row.id, ue.message);
  }
  console.log(`${table}: done`);
}

// site_settings uses key/value
async function processSettings() {
  const { data } = await supabase.from('site_settings').select('key,value,translations').not('value', 'is', null);
  if (!data?.length) return;
  // Skip keys that look like config (contain dots/underscores starting with system) or empty
  // Translate text-looking values only — skip URLs, numbers, hex, single tokens with no spaces longer than uuid
  const items = [];
  for (const row of data) {
    const v = row.value;
    if (typeof v !== 'string' || !v.trim()) continue;
    if (/^https?:\/\//.test(v)) continue;
    if (/^[0-9.,\s%+-]+$/.test(v)) continue;
    if (/^#[0-9a-fA-F]{3,8}$/.test(v)) continue;
    if (row.key.startsWith('i18n.en.')) continue;
    items.push({ key: row.key, fr: v, row });
  }
  console.log(`site_settings: translating ${items.length} values`);
  const CHUNK = 25;
  for (let i = 0; i < items.length; i += CHUNK) {
    const slice = items.slice(i, i + CHUNK).map(it => ({ key: it.key, fr: it.fr }));
    let r = {};
    try { r = await translateBatch(slice); } catch { continue; }
    for (const it of items.slice(i, i + CHUNK)) {
      const en = r[it.key];
      if (!en) continue;
      const newTr = { ...(it.row.translations || {}), en: { value: en } };
      await supabase.from('site_settings').update({ translations: newTr }).eq('key', it.row.key);
    }
    console.log(`  settings ${Math.min(i+CHUNK, items.length)}/${items.length}`);
  }
}

const args = process.argv.slice(2);
const only = args[0];
const tables = only ? [only] : Object.keys(SCHEMA);
for (const t of tables) {
  if (t === 'site_settings') { await processSettings(); continue; }
  await processTable(t, SCHEMA[t] || []);
}
if (!only || only === 'site_settings') {
  if (only !== undefined && only !== 'site_settings' && tables.length === 1) {} else {
    if (!tables.includes('site_settings')) await processSettings();
  }
}
console.log('ALL DONE');
