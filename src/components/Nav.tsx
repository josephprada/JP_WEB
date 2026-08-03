import { FilePdfIcon } from "@phosphor-icons/react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { useLang } from "../i18n/LanguageProvider";
import { scrollToSection } from "../lib/scroll";
import { CvViewer } from "./CvViewer";

/**
 * Single-line desktop nav, 64px tall. It only gains a background once the page
 * has left the hero, so the opening frame stays uninterrupted.
 */
export function Nav() {
  const { t, lang, toggle } = useLang();
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [cvOpen, setCvOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => {
    setSolid(value > 120);
  });

  const links = [
    { id: "metodo", label: t.nav.method },
    { id: "stack", label: t.nav.frontier },
    { id: "trabajo", label: t.nav.work },
    { id: "contacto", label: t.nav.contact },
  ];

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 h-16 transition-colors duration-300"
      style={{
        backgroundColor: solid ? "rgba(11,11,12,0.86)" : "transparent",
        backdropFilter: solid ? "blur(14px)" : "none",
        borderBottom: solid ? "1px solid var(--hairline)" : "1px solid transparent",
      }}
    >
      <nav className="shell flex h-full items-center justify-between gap-6">
        <button
          type="button"
          onClick={() => scrollToSection("hero")}
          className="flex items-center gap-2.5"
          aria-label="Joseph Prada"
        >
          {/* The mark is 400x274. Forcing it into a square squashes it, so the
              height is fixed and the width follows the intrinsic ratio. */}
          <img src="/jp-logo.png" alt="" width={41} height={28} className="h-7 w-auto" />
        </button>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.id}>
              <button
                type="button"
                onClick={() => scrollToSection(link.id)}
                className="font-mono text-xs tracking-[0.12em] text-paper/65 uppercase transition-colors hover:text-paper"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {/* Below `md` the link list is hidden, so contact would otherwise be
              unreachable without scrolling the whole page. */}
          <button
            type="button"
            onClick={() => scrollToSection("contacto")}
            className="border border-paper/25 px-4 py-2 font-mono text-xs tracking-[0.12em] uppercase transition-colors hover:bg-paper hover:text-ink md:hidden"
          >
            {t.nav.contact}
          </button>

          <button
            type="button"
            onClick={() => setCvOpen(true)}
            className="hidden items-center gap-2 border border-paper/25 px-4 py-2 font-mono text-xs tracking-[0.12em] uppercase transition-colors hover:bg-paper hover:text-ink md:inline-flex"
          >
            {t.nav.cv}
            <FilePdfIcon size={14} weight="bold" />
          </button>

          <button
            type="button"
            onClick={toggle}
            aria-label={t.langToggle.label}
            className="flex items-center gap-1.5 border border-paper/25 px-4 py-2 font-mono text-xs tracking-[0.12em] transition-colors hover:border-accent hover:bg-accent"
          >
            <span className="text-paper/45">{lang === "es" ? "ES" : "EN"}</span>
            <span className="text-paper/25">/</span>
            <span className="text-paper">{t.langToggle.to}</span>
          </button>
        </div>
      </nav>
      <CvViewer open={cvOpen} onClose={() => setCvOpen(false)} />
    </motion.header>
  );
}
