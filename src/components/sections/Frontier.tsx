import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useLang } from "../../i18n/LanguageProvider";
import { gsap } from "../../lib/scroll";

/**
 * Horizontal scroll-hijack. Six capability cards pan sideways while the section
 * is pinned, so the list reads as a sweep across a field rather than another
 * vertical stack. Under reduced motion or below `md` it degrades to a native
 * scroll-snap strip, which keeps the content reachable without the pin.
 */
export function Frontier() {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const sync = () => setPinned(query.matches && !reduce);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, [reduce]);

  useEffect(() => {
    if (!pinned) return;
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    const ctx = gsap.context(() => {
      const distance = () => track.scrollWidth - window.innerWidth + 80;
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, wrap);

    return () => ctx.revert();
  }, [pinned]);

  return (
    <section ref={wrapRef} id="stack" className="relative overflow-hidden border-t bg-ink">
      <div className="shell pt-24 md:pt-28">
        <h2 className="display max-w-[16ch] text-[10vw] sm:text-[8vw] md:text-[4.5rem] lg:text-[5.5rem]">
          {t.frontier.headline}
        </h2>
        <p className="body-copy mt-5 text-base md:text-lg">{t.frontier.body}</p>
      </div>

      <div
        ref={trackRef}
        className={
          pinned
            ? "mt-12 flex w-max gap-6 pr-20 pl-5 will-change-transform md:pl-10"
            : "mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-28 md:px-10"
        }
      >
        {t.frontier.cards.map((card, index) => (
          <article
            key={card.title}
            className="flex w-[82vw] shrink-0 snap-start flex-col border border-paper/12 bg-ink-raised p-8 sm:w-[26rem] md:p-10 lg:w-[29rem]"
            style={pinned ? { height: "20rem" } : undefined}
          >
            <span className="font-mono text-xs text-paper/35">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="display mt-5 text-3xl text-accent md:text-4xl">{card.title}</h3>
            <p className="body-copy mt-4 text-sm md:text-[0.9375rem]">{card.note}</p>
          </article>
        ))}
      </div>

      {pinned && <div className="h-20" />}
    </section>
  );
}
