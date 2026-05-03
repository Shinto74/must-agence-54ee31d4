import { useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { lookup, setRuntimeOverrides } from "@/lib/i18n/dictionary";
import { supabase } from "@/integrations/supabase/client";

const ORIGINAL_ATTR = "data-i18n-original";
const SKIP_ATTR = "data-i18n-skip";
const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE"]);
const PLACEHOLDER_ORIGINAL_ATTR = "data-i18n-ph-original";
const PROTECTED = ["MUST AGENCE", "MUST", "TheArtist", "Lovable"];
const PROTECT_RE = /^(\s|[\d.,:%€$+\-/x×|·•]|[A-Z]{2,}|MUST\s*AGENCE)+$/;

function shouldSkip(node: Node): boolean {
  let el: HTMLElement | null = (node.parentElement as HTMLElement) || null;
  while (el) {
    if (el.hasAttribute && el.hasAttribute(SKIP_ATTR)) return true;
    if (SKIP_TAGS.has(el.tagName)) return true;
    if (el.isContentEditable) return true;
    el = el.parentElement;
  }
  return false;
}

function isTranslatableText(s: string): boolean {
  const t = s.trim();
  if (!t) return false;
  if (t.length < 2) return false;
  if (PROTECT_RE.test(t)) return false;
  if (PROTECTED.includes(t)) return false;
  if (/^https?:\/\//.test(t)) return false;
  if (/^[\w.+-]+@[\w-]+\.\w+/.test(t)) return false;
  if (/^[\d\s.,:%€$+\-/x×|·•]+$/.test(t)) return false;
  return true;
}

export function useAutoTranslate() {
  const { lang } = useLanguage();
  const observerRef = useRef<MutationObserver | null>(null);
  const overridesLoadedRef = useRef(false);

  // Load admin overrides once
  useEffect(() => {
    if (overridesLoadedRef.current) return;
    overridesLoadedRef.current = true;
    (async () => {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("key,value")
          .like("key", "i18n.en.%");
        if (data) {
          const map: Record<string, string> = {};
          for (const row of data) {
            const fr = row.key.slice("i18n.en.".length);
            try {
              map[decodeURIComponent(fr)] = row.value;
            } catch {
              map[fr] = row.value;
            }
          }
          setRuntimeOverrides(map);
        }
      } catch {
        /* ignore */
      }
    })();
  }, []);

  useEffect(() => {
    const apply = (root: Node) => {
      // 1) Text nodes
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
          if (shouldSkip(node)) return NodeFilter.FILTER_REJECT;
          const text = (node.nodeValue || "");
          if (lang === "en") {
            if (!isTranslatableText(text)) return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      } as any);

      const nodes: Text[] = [];
      let n: Node | null = walker.nextNode();
      while (n) {
        nodes.push(n as Text);
        n = walker.nextNode();
      }

      for (const tn of nodes) {
        const el = tn.parentElement as HTMLElement | null;
        if (lang === "en") {
          const current = tn.nodeValue || "";
          const original = (el?.getAttribute(ORIGINAL_ATTR)) || current;
          const trimmed = original.trim();
          const translated = lookup(trimmed);
          if (translated && translated !== trimmed) {
            if (el && !el.getAttribute(ORIGINAL_ATTR)) el.setAttribute(ORIGINAL_ATTR, original);
            const leading = original.match(/^\s*/)?.[0] || "";
            const trailing = original.match(/\s*$/)?.[0] || "";
            const next = leading + translated + trailing;
            if (tn.nodeValue !== next) tn.nodeValue = next;
          }
        } else {
          if (el && el.hasAttribute(ORIGINAL_ATTR)) {
            const orig = el.getAttribute(ORIGINAL_ATTR)!;
            if (tn.nodeValue !== orig) tn.nodeValue = orig;
          }
        }
      }

      // 2) Placeholders & aria-labels on inputs/textareas/selects
      const rootEl = (root as Element).querySelectorAll
        ? (root as Element)
        : document.body;
      const fields = rootEl.querySelectorAll
        ? rootEl.querySelectorAll("input[placeholder], textarea[placeholder], [aria-label]")
        : [];
      fields.forEach((el) => {
        const node = el as HTMLElement;
        if (node.hasAttribute(SKIP_ATTR)) return;
        // placeholder
        const ph = node.getAttribute("placeholder");
        if (ph !== null) {
          if (lang === "en") {
            const original = node.getAttribute(PLACEHOLDER_ORIGINAL_ATTR) || ph;
            if (isTranslatableText(original)) {
              const translated = lookup(original.trim());
              if (translated && translated !== original.trim()) {
                if (!node.getAttribute(PLACEHOLDER_ORIGINAL_ATTR)) {
                  node.setAttribute(PLACEHOLDER_ORIGINAL_ATTR, original);
                }
                if (node.getAttribute("placeholder") !== translated) {
                  node.setAttribute("placeholder", translated);
                }
              }
            }
          } else {
            const orig = node.getAttribute(PLACEHOLDER_ORIGINAL_ATTR);
            if (orig && node.getAttribute("placeholder") !== orig) {
              node.setAttribute("placeholder", orig);
            }
          }
        }
        // aria-label
        const al = node.getAttribute("aria-label");
        if (al !== null && isTranslatableText(al)) {
          const ATTR = "data-i18n-aria-original";
          if (lang === "en") {
            const original = node.getAttribute(ATTR) || al;
            const translated = lookup(original.trim());
            if (translated && translated !== original.trim()) {
              if (!node.getAttribute(ATTR)) node.setAttribute(ATTR, original);
              if (node.getAttribute("aria-label") !== translated) {
                node.setAttribute("aria-label", translated);
              }
            }
          } else {
            const orig = node.getAttribute(ATTR);
            if (orig && node.getAttribute("aria-label") !== orig) {
              node.setAttribute("aria-label", orig);
            }
          }
        }
      });
    };

    // Disconnect existing
    if (observerRef.current) observerRef.current.disconnect();

    apply(document.body);

    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        apply(document.body);
      });
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    observerRef.current = observer;

    return () => observer.disconnect();
  }, [lang]);
}
