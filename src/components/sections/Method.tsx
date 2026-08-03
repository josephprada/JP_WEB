import { ArrowsClockwiseIcon } from "@phosphor-icons/react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { useLang } from "../../i18n/LanguageProvider";

/**
 * The spine of the page: the SDD pipeline draws itself as you scroll, with the
 * TDD loop nested inside the implementation step.
 *
 * The motion is load-bearing rather than decorative. The whole claim of this
 * section is "work happens in a fixed order", and a line that advances in that
 * order while you read is the argument, not an ornament.
 */
export function Method() {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 72%", "end 85%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 });

  return (
    <section id="metodo" className="relative border-t bg-ink-sunken py-28 md:py-40">
      <div className="shell">
        <p className="label">{t.method.label}</p>
        <h2 className="display mt-5 max-w-[22ch] text-[9vw] sm:text-[7vw] md:text-[4rem] lg:text-[5rem]">
          {t.method.headline}
        </h2>
        <p className="body-copy mt-8 text-base md:text-lg">{t.method.body}</p>

        <div ref={trackRef} className="relative mt-20 md:mt-28">
          {/* The rail sits behind the steps and fills as the section advances. */}
          <div
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[11px] w-px bg-paper/12 md:left-[15px]"
          >
            <motion.div
              className="h-full w-full origin-top bg-accent"
              style={{ scaleY: reduce ? 1 : progress }}
            />
          </div>

          <ol className="space-y-14 md:space-y-20">
            {t.method.steps.map((step, index) => (
              <li key={step.id} className="relative pl-12 md:pl-16">
                <motion.span
                  aria-hidden="true"
                  initial={reduce ? false : { scale: 0.4, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.9 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-1 left-0 flex h-6 w-6 items-center justify-center bg-ink-sunken md:h-8 md:w-8"
                >
                  <span className="h-2.5 w-2.5 bg-accent md:h-3 md:w-3" />
                </motion.span>

                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-paper/40">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="display text-3xl md:text-5xl">{step.name}</h3>
                  </div>
                  <p className="body-copy mt-3 text-sm md:text-base">{step.note}</p>

                  {/* The TDD loop belongs inside implementation, so it renders inside it. */}
                  {step.id === "apply" && (
                    <div className="mt-8 border border-accent/35 bg-accent/[0.06] p-6 md:p-8">
                      <div className="flex items-center gap-3">
                        <ArrowsClockwiseIcon size={20} weight="bold" className="text-accent" />
                        <span className="font-mono text-xs tracking-[0.2em] text-paper uppercase">
                          {t.method.loop.title}
                        </span>
                      </div>
                      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
                        {t.method.loop.phases.map((phase, phaseIndex) => (
                          <span key={phase} className="flex items-center gap-3">
                            {phaseIndex > 0 && <span className="text-paper/30">/</span>}
                            <motion.span
                              initial={reduce ? false : { opacity: 0.25 }}
                              whileInView={{ opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.5, delay: phaseIndex * 0.18 }}
                              className="display text-2xl md:text-3xl"
                            >
                              {phase}
                            </motion.span>
                          </span>
                        ))}
                      </div>
                      <p className="body-copy mt-4 text-sm">{t.method.loop.note}</p>
                    </div>
                  )}
                </motion.div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
