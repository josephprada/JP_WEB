import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { useLang } from "../../i18n/LanguageProvider";

/**
 * Asymmetric split rows carrying real screenshots of the live sites. The third
 * item has no image on purpose: it is corporate work with no public URL, so it
 * renders as a text-led block instead of faking a preview for it.
 */
export function Work() {
  const { t } = useLang();
  const reduce = useReducedMotion();

  return (
    <section id="trabajo" className="relative border-t bg-ink-sunken py-28 md:py-40">
      <div className="shell">
        <p className="label">{t.work.label}</p>
        <h2 className="display mt-5 text-[11vw] sm:text-[9vw] md:text-[6rem] lg:text-[7rem]">
          {t.work.headline}
        </h2>

        <div className="mt-20 space-y-24 md:mt-28 md:space-y-32">
          {t.work.items.map((item, index) => {
            const flipped = index === 1;
            return (
              <motion.article
                key={item.id}
                initial={reduce ? false : { opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 items-center gap-10 md:gap-14 lg:grid-cols-12"
              >
                {item.image && (
                  <div
                    className={
                      flipped
                        ? "order-1 lg:order-2 lg:col-span-7 lg:col-start-6"
                        : "order-1 lg:col-span-7"
                    }
                  >
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group block overflow-hidden border border-paper/12"
                    >
                      <img
                        src={item.image}
                        alt={item.imageAlt ?? ""}
                        loading="lazy"
                        width={1600}
                        height={1000}
                        className="w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                      />
                    </a>
                  </div>
                )}

                <div
                  className={
                    item.image
                      ? flipped
                        ? "order-2 lg:order-1 lg:col-span-4 lg:col-start-1 lg:row-start-1"
                        : "order-2 lg:col-span-5"
                      : "order-2 lg:col-span-9"
                  }
                >
                  <div className="flex items-center gap-3 font-mono text-xs text-paper/45">
                    <span>{item.year}</span>
                    <span className="h-px w-6 bg-paper/25" />
                    <span>{item.kind}</span>
                  </div>

                  <h3 className="display mt-4 text-4xl md:text-6xl">{item.name}</h3>
                  <p className="body-copy mt-5 text-sm md:text-base">{item.summary}</p>

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {item.stack.map((tech) => (
                      <li
                        key={tech}
                        className="border border-paper/18 px-3 py-1.5 font-mono text-[0.6875rem] tracking-wide text-paper/70"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>

                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group mt-8 inline-flex items-center gap-2 border-b border-accent pb-1 font-medium text-paper transition-colors hover:text-accent"
                    >
                      {t.work.visit}
                      <ArrowUpRightIcon
                        size={17}
                        weight="bold"
                        className="text-accent transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </a>
                  ) : (
                    <p className="mt-8 font-mono text-xs text-paper/40">{item.note}</p>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
