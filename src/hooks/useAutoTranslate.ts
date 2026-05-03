import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

const CACHE_KEY = "site_translations_en_v1";
const ATTR = "data-i18n-key";
const ORIG_ATTR = "data-i18n-orig";

const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "TEXTAREA", "INPUT", "SVG", "PATH"]);
// Brands / proper nouns to never translate
const BRAND_REGEX = /^(MUST AGENCE|MUST|TheArtist|Lovable|Supabase)$/i;

function loadCache(): Record<string, string> {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch { return {}; }
}
function saveCache(c: Record<string, string>) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)); } catch {}
}

function isTranslatable(text: string) {
  const t = text.trim();
  if (!t) return false;
  if (t.length < 2) return false;
  if (/^[\d\s.,:;!?+\-/€$%°|•·–—]+$/.test(t)) return false; // numbers/symbols only
  if (/^https?:\/\//i.test(t)) return false;
  if (/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(t)) return false; // email
  if (BRAND_REGEX.test(t)) return false;
  // Has at least one letter
  if (!/[A-Za-zÀ-ÿ]/.test(t)) return false;
  return true;
}

function collectTextNodes(root: HTMLElement): Text[] {
  const out: Text[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (parent.closest("[data-i18n-skip]")) return NodeFilter.FILTER_REJECT;
      const text = node.nodeValue || "";
      if (!isTranslatable(text)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  let n: Node | null;
  while ((n = walker.nextNode())) out.push(n as Text);
  return out;
}

export function useAutoTranslate() {
  const { lang } = useLanguage();
  const location = useLocation();
  const inflight = useRef(false);
  const pendingTimer = useRef<number | null>(null);

  useEffect(() => {
    if (lang === "fr") {
      // Restore originals
      document.querySelectorAll(`[${ATTR}]`).forEach((el) => {
        const orig = el.getAttribute(ORIG_ATTR);
        if (orig !== null) el.textContent = orig;
        el.removeAttribute(ATTR);
        el.removeAttribute(ORIG_ATTR);
      });
      return;
    }

    const run = async () => {
      if (inflight.current) return;
      const cache = loadCache();
      // Collect from document.body to cover header/footer/main
      const nodes = collectTextNodes(document.body);
      // Build to-translate list (uncached) and apply cached immediately
      const uncached: string[] = [];
      const uncachedKeys = new Set<string>();
      const nodeOriginals = new Map<Text, string>();

      nodes.forEach((node) => {
        const original = (node.nodeValue || "").trim();
        if (!original) return;
        nodeOriginals.set(node, original);
        if (cache[original]) {
          // apply cached
          if (node.nodeValue !== cache[original]) node.nodeValue = (node.nodeValue || "").replace(original, cache[original]);
          const parent = node.parentElement;
          if (parent && !parent.hasAttribute(ORIG_ATTR)) {
            parent.setAttribute(ORIG_ATTR, original);
            parent.setAttribute(ATTR, "1");
          }
        } else if (!uncachedKeys.has(original)) {
          uncachedKeys.add(original);
          uncached.push(original);
        }
      });

      if (uncached.length === 0) return;

      inflight.current = true;
      try {
        // Chunk to avoid huge payloads (max ~80 items per call)
        const CHUNK = 80;
        for (let i = 0; i < uncached.length; i += CHUNK) {
          const chunk = uncached.slice(i, i + CHUNK);
          const { data, error } = await supabase.functions.invoke("translate", {
            body: { texts: chunk, target: "en" },
          });
          if (error) { console.error("translate invoke error", error); continue; }
          const translations: string[] = data?.translations || [];
          chunk.forEach((src, idx) => {
            const tr = translations[idx];
            if (typeof tr === "string" && tr.length > 0) cache[src] = tr;
          });
        }
        saveCache(cache);

        // Apply to remaining nodes
        nodes.forEach((node) => {
          const original = nodeOriginals.get(node);
          if (!original) return;
          const tr = cache[original];
          if (!tr) return;
          if (node.nodeValue && node.nodeValue.includes(original) && !node.nodeValue.includes(tr)) {
            node.nodeValue = node.nodeValue.replace(original, tr);
            const parent = node.parentElement;
            if (parent && !parent.hasAttribute(ORIG_ATTR)) {
              parent.setAttribute(ORIG_ATTR, original);
              parent.setAttribute(ATTR, "1");
            }
          }
        });
      } finally {
        inflight.current = false;
      }
    };

    // Initial run shortly after mount/route change
    const t1 = window.setTimeout(run, 300);

    // Observe DOM changes (data load etc.)
    const observer = new MutationObserver(() => {
      if (pendingTimer.current) window.clearTimeout(pendingTimer.current);
      pendingTimer.current = window.setTimeout(run, 400);
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    return () => {
      window.clearTimeout(t1);
      if (pendingTimer.current) window.clearTimeout(pendingTimer.current);
      observer.disconnect();
    };
  }, [lang, location.pathname]);
}
