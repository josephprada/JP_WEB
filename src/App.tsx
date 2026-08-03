import { useReducedMotion } from "motion/react";
import { useEffect } from "react";
import { Footer } from "./components/Footer";
import { Nav } from "./components/Nav";
import { Contact } from "./components/sections/Contact";
import { Frontier } from "./components/sections/Frontier";
import { Hero } from "./components/sections/Hero";
import { Method } from "./components/sections/Method";
import { Product } from "./components/sections/Product";
import { Thesis } from "./components/sections/Thesis";
import { Track } from "./components/sections/Track";
import { Work } from "./components/sections/Work";
import { useLang } from "./i18n/LanguageProvider";
import { ScrollTrigger, useSmoothScroll } from "./lib/scroll";

export function App() {
  const reduce = useReducedMotion();
  const { lang } = useLang();

  useSmoothScroll(!reduce);

  /**
   * Switching language rewrites most of the copy, which changes every section's
   * height. Pinned triggers hold stale measurements until they are refreshed.
   */
  // biome-ignore lint/correctness/useExhaustiveDependencies: `lang` is the trigger, not a value read inside the effect.
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [lang]);

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <Thesis />
        <Method />
        <Frontier />
        <Work />
        <Product />
        <Track />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
