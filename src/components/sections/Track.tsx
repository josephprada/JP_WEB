import { motion, useReducedMotion } from "motion/react";
import { useLang } from "../../i18n/LanguageProvider";

/**
 * Two-column record: roles on the left, education grouped on the right. Rules
 * sit above each group rather than under every row, so the section reads as two
 * short lists instead of a spec table.
 */
export function Track() {
  const { t } = useLang();
  const reduce = useReducedMotion();

  const reveal = (index: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 24 } as const),
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration: 0.6, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section id="trayectoria" className="relative border-t bg-ink-sunken py-28 md:py-40">
      <div className="shell">
        <p className="label">{t.track.label}</p>
        <h2 className="display mt-5 text-[11vw] sm:text-[9vw] md:text-[6rem]">
          {t.track.headline}
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-16 md:mt-24 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            {t.track.roles.map((role, index) => (
              <motion.div
                key={role.period}
                {...reveal(index)}
                className="border-t border-paper/12 py-8 first:border-t-0 first:pt-0"
              >
                <span className="font-mono text-xs text-accent">{role.period}</span>
                <h3 className="mt-3 text-xl font-medium md:text-2xl">{role.title}</h3>
                <p className="mt-1 text-sm text-paper/55">{role.org}</p>
                <p className="body-copy mt-4 text-sm">{role.detail}</p>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <h3 className="display text-2xl text-paper/50 md:text-3xl">
              {t.track.credentialsHeading}
            </h3>
            <div className="mt-8 space-y-8">
              {t.track.credentials.map((credential, index) => (
                <motion.div key={credential.title} {...reveal(index)}>
                  <span className="font-mono text-xs text-paper/40">{credential.year}</span>
                  <p className="mt-2 font-medium">{credential.title}</p>
                  <p className="mt-1 text-sm text-paper/55">{credential.org}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
