import { ArrowSquareOutIcon, DownloadSimpleIcon, XIcon } from "@phosphor-icons/react";
import { useEffect } from "react";
import { CONTACT } from "../i18n/content";
import { useLang } from "../i18n/LanguageProvider";
import { activeLenis } from "../lib/scroll";

interface CvViewerProps {
  open: boolean;
  onClose: () => void;
}

/**
 * In-page PDF preview so a recruiter can confirm the CV is worth downloading
 * before committing to a file on disk. The chrome (header, buttons, backdrop)
 * carries the site's styling; the document itself renders through the
 * browser's native PDF engine via <object>, which is the only renderer that
 * needs no extra dependency and degrades to a plain download link if it can't
 * embed (older Safari, in-app browsers).
 */
export function CvViewer({ open, onClose }: CvViewerProps) {
  const { t } = useLang();

  useEffect(() => {
    if (!open) return;

    activeLenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      activeLenis?.start();
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-10">
      {/* A real button rather than a click handler on the backdrop div, so
          the a11y tree stays correct without a stopPropagation hack on the
          panel beside it. Pulled out of tab order: the visible X handles
          keyboard close, so a second identically-labelled stop here would
          just be noise for a screen-reader user tabbing through. */}
      <button
        type="button"
        tabIndex={-1}
        onClick={onClose}
        aria-hidden="true"
        className="absolute inset-0 bg-ink/90 backdrop-blur-sm"
      />

      <div className="relative flex h-full w-full max-w-4xl flex-col border border-paper/15 bg-ink-raised">
        <div className="flex shrink-0 items-center justify-between border-b border-paper/12 px-5 py-4">
          <p className="label">{t.nav.cv}</p>
          <div className="flex items-center gap-2">
            <a
              href={CONTACT.cv}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={t.cvViewer.openTab}
              className="inline-flex items-center justify-center border border-paper/25 p-2 text-paper/70 transition-colors hover:border-accent hover:bg-accent hover:text-ink"
            >
              <ArrowSquareOutIcon size={16} weight="bold" />
            </a>
            <a
              href={CONTACT.cv}
              download
              aria-label={t.cvViewer.download}
              className="inline-flex items-center justify-center border border-paper/25 p-2 text-paper/70 transition-colors hover:border-accent hover:bg-accent hover:text-ink"
            >
              <DownloadSimpleIcon size={16} weight="bold" />
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label={t.cvViewer.close}
              className="inline-flex items-center justify-center border border-paper/25 p-2 text-paper/70 transition-colors hover:border-accent hover:bg-accent hover:text-ink"
            >
              <XIcon size={16} weight="bold" />
            </button>
          </div>
        </div>

        <object data={CONTACT.cv} type="application/pdf" className="min-h-0 grow bg-ink-sunken">
          {/* Renders only when the browser can't embed the PDF itself. */}
          <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="body-copy">{t.cvViewer.fallback}</p>
            <a
              href={CONTACT.cv}
              download
              className="inline-flex items-center gap-2.5 bg-accent px-6 py-3 font-medium text-paper transition-colors hover:bg-accent-dim"
            >
              {t.cvViewer.download}
              <DownloadSimpleIcon size={18} weight="bold" />
            </a>
          </div>
        </object>
      </div>
    </div>
  );
}
