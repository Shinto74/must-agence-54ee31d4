import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "fr" | "en";

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const Ctx = createContext<LangCtx>({ lang: "fr", setLang: () => {} });

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "fr";
    return (localStorage.getItem("site_lang") as Lang) || "fr";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("site_lang", l); } catch {}
    document.documentElement.lang = l;
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
};

export const useLanguage = () => useContext(Ctx);
