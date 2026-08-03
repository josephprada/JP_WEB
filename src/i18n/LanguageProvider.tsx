import {
  createContext,
  type ReactNode,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { type Content, content, type Lang } from "./content";

interface LanguageValue {
  lang: Lang;
  t: Content;
  toggle: () => void;
}

const LanguageContext = createContext<LanguageValue | null>(null);

const STORAGE_KEY = "jp-lang";

function readInitialLang(): Lang {
  if (typeof window === "undefined") return "es";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "es" || stored === "en") return stored;
  return navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(readInitialLang);

  const toggle = useCallback(() => {
    setLang((current) => (current === "es" ? "en" : "es"));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    document.title = content[lang].meta.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", content[lang].meta.description);
  }, [lang]);

  const value = useMemo<LanguageValue>(() => ({ lang, t: content[lang], toggle }), [lang, toggle]);

  return <LanguageContext value={value}>{children}</LanguageContext>;
}

export function useLang(): LanguageValue {
  const value = use(LanguageContext);
  if (!value) throw new Error("useLang must be used inside LanguageProvider");
  return value;
}
