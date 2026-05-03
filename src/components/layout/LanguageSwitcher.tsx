import { useLanguage, Lang } from "@/contexts/LanguageContext";

interface Props {
  needsDarkText: boolean;
  accentColor: string;
  mobile?: boolean;
}

export default function LanguageSwitcher({ needsDarkText, accentColor, mobile = false }: Props) {
  const { lang, setLang } = useLanguage();

  const baseColor = needsDarkText ? "hsla(43, 30%, 25%, 0.65)" : "hsla(0,0%,100%,0.6)";
  const activeColor = needsDarkText ? "#fff" : "#000";
  const borderColor = needsDarkText ? "hsla(43, 55%, 55%, 0.25)" : "hsla(0,0%,100%,0.12)";
  const bgColor = needsDarkText ? "hsla(43, 40%, 85%, 0.3)" : "hsla(0,0%,100%,0.04)";

  const Btn = ({ value, label }: { value: Lang; label: string }) => {
    const active = lang === value;
    return (
      <button
        data-i18n-skip
        onClick={() => setLang(value)}
        className="px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-[0.15em] transition-all duration-300"
        style={{
          background: active ? accentColor : "transparent",
          color: active ? activeColor : baseColor,
          fontWeight: active ? 700 : 500,
        }}
        aria-label={`Switch language to ${label}`}
      >
        {label}
      </button>
    );
  };

  return (
    <div
      data-i18n-skip
      className={`${mobile ? "flex" : "hidden md:flex"} items-center gap-0.5 rounded-full p-0.5`}
      style={{ border: `1px solid ${borderColor}`, background: bgColor }}
    >
      <Btn value="fr" label="FR" />
      <Btn value="en" label="EN" />
    </div>
  );
}
