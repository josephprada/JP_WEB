import {
  ArrowUpIcon,
  EnvelopeSimpleIcon,
  InstagramLogoIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react";
import { CONTACT } from "../i18n/content";
import { useLang } from "../i18n/LanguageProvider";
import { scrollToSection } from "../lib/scroll";

/**
 * Only channels that actually resolve are listed. LinkedIn and GitHub are
 * deliberately absent until real profile URLs exist: an icon that opens the
 * wrong destination costs more trust than a missing icon.
 */
export function Footer() {
  const { t } = useLang();

  const socials = [
    { href: "https://wa.me/573175249226", label: "WhatsApp", Icon: WhatsappLogoIcon },
    { href: CONTACT.instagram, label: CONTACT.instagramHandle, Icon: InstagramLogoIcon },
    { href: `mailto:${CONTACT.email}`, label: CONTACT.email, Icon: EnvelopeSimpleIcon },
  ];

  return (
    <footer className="border-t bg-ink">
      <div className="shell flex flex-col gap-8 py-12 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-10">
        <div className="flex items-center gap-3">
          <img src="/jp-logo.png" alt="" width={29} height={20} className="h-5 w-auto" />
          <p className="font-mono text-xs text-paper/45">
            {new Date().getFullYear()} {t.footer.rights}
          </p>
        </div>

        {/* Mobile: touch-sized squares matching the site's other secondary
            buttons (border, solid-paper hover). Desktop: plain small icons,
            no border, matching the original minimal footer. Two separate
            blocks rather than one responsive element, so neither size needs
            an !important override to win against the other breakpoint. */}
        <div className="flex items-center gap-3 sm:hidden">
          {socials.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={label}
              className="inline-flex items-center justify-center border border-paper/30 p-3.5 text-paper transition-colors duration-200 hover:border-paper hover:bg-paper hover:text-ink active:scale-[0.98]"
            >
              <Icon size={22} weight="bold" />
            </a>
          ))}
        </div>
        <div className="hidden items-center gap-5 sm:flex">
          {socials.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={label}
              className="text-paper/45 transition-colors hover:text-accent"
            >
              <Icon size={20} weight="bold" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4 sm:gap-0">
          <p className="font-mono text-xs text-paper/35">{t.footer.built}</p>
          <button
            type="button"
            onClick={() => scrollToSection("hero")}
            aria-label="Volver arriba"
            className="hidden ml-6 items-center justify-center border border-paper/25 p-2 text-paper/45 transition-colors duration-200 hover:border-accent hover:bg-accent hover:text-ink md:inline-flex"
          >
            <ArrowUpIcon size={16} weight="bold" />
          </button>
        </div>
      </div>
    </footer>
  );
}
