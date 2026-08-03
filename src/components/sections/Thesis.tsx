import { motion, useReducedMotion } from "motion/react";
import { useLang } from "../../i18n/LanguageProvider";

/**
 * Editorial manifesto block: type only, no asset. The line-by-line reveal is
 * doing narrative work here, since the last line is the turn of the argument.
 */
export function Thesis() {
  const { t } = useLang();
  const reduce = useReducedMotion();

  return (
    <section id="tesis" className="relative border-t bg-ink py-28 md:py-40">
      <div className="shell">
        <h2 className="display max-w-[18ch] text-[13vw] sm:text-[11vw] md:text-[7.5rem] lg:text-[9rem]">
          {t.thesis.headline.map((line, index) => (
            <motion.span
              key={line}
              initial={reduce ? false : { opacity: 0, y: "0.24em" }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.75, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className={index >= 3 ? "block text-accent" : "block"}
            >
              {line}
            </motion.span>
          ))}
        </h2>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="body-copy mt-14 ml-auto text-base md:mt-20 md:text-lg"
        >
          {t.thesis.body}
        </motion.p>
      </div>
    </section>
  );
}
