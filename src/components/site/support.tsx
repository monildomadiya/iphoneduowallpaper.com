import { Coffee, Heart } from "lucide-react";
import type { Locale } from "@/lib/i18n/types";
import { SUPPORT_HANDLE, SUPPORT_URL, supportStrings } from "@/lib/support";
import { cn } from "@/lib/utils";

/**
 * Buy Me a Coffee is a third party, so every link out to it is opened in its own tab and left
 * unfollowed.
 */
const EXTERNAL = { target: "_blank", rel: "noopener noreferrer nofollow" } as const;

/**
 * Buy Me a Coffee's own yellow. The site's buttons are Apple blue, so the one donation button on a
 * page is the only yellow thing on it — that is what makes people see it. Dark text keeps it well
 * past the contrast minimum.
 */
const BMC_BUTTON =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#ffdd00] px-6 text-[15px] font-semibold tracking-[-0.01em] text-[#1d1d1f] transition duration-300 ease-apple hover:bg-[#ffe747] active:scale-[0.98]";

export { BMC_BUTTON, EXTERNAL };

/**
 * The full pitch. Sits under the download buttons on a wallpaper page and under the maker, where
 * someone has just been handed something for free and the ask makes sense.
 */
export function SupportCard({
  locale = "en",
  className,
  compact = false,
}: {
  locale?: Locale;
  className?: string;
  /** Narrow columns drop the illustration and tighten the padding. */
  compact?: boolean;
}) {
  const t = supportStrings(locale);

  return (
    <section
      aria-label={t.eyebrow}
      className={cn(
        "relative overflow-hidden rounded-[24px] border border-[#f0c400]/35 bg-linear-to-br from-[#fffae3] via-[#fff6f0] to-[#f7f1ff] p-6 md:p-7",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-12 size-44 rounded-full bg-[#ffdd00]/25 blur-2xl"
      />
      <div className={cn("relative flex gap-5", compact && "gap-4")}>
        {!compact ? (
          <span className="hidden size-12 shrink-0 place-items-center rounded-2xl bg-[#ffdd00] text-[#1d1d1f] sm:grid">
            <Coffee className="size-6" strokeWidth={2} />
          </span>
        ) : null}
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#9a6a00]">
            <Heart className="size-3.5 fill-current" aria-hidden="true" />
            {t.eyebrow}
          </p>
          <h2 className="mt-1.5 text-[21px] font-semibold tracking-tight text-fg">
            {t.title}
          </h2>
          <p className="mt-2 text-[15px] leading-6 text-fg-2">{t.body}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <a href={SUPPORT_URL} {...EXTERNAL} aria-label={t.aria} className={cn(BMC_BUTTON, "h-12")}>
              <Coffee className="size-[18px]" strokeWidth={2.2} />
              {t.cta}
            </a>
            <span className="text-[13px] text-fg-3">{t.note}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The sitewide strip at the top of the footer, so the ask is on every page without shouting. */
export function SupportFooterStrip({ locale = "en" }: { locale?: Locale }) {
  const t = supportStrings(locale);

  return (
    <a
      href={SUPPORT_URL}
      {...EXTERNAL}
      aria-label={t.aria}
      className="group mb-8 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-[20px] border border-[#f0c400]/35 bg-linear-to-r from-[#fffae3] to-[#fdf4ff] px-5 py-4 transition hover:border-[#f0c400]/60"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#ffdd00] text-[#1d1d1f]">
        <Coffee className="size-5" strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold tracking-tight text-fg">{t.short}</span>
        <span className="block text-[13px] text-fg-2">{t.footerNote}</span>
      </span>
      <span className={cn(BMC_BUTTON, "h-10 px-5 text-[14px]")} aria-hidden="true">
        {t.cta}
      </span>
    </a>
  );
}

/** The header pill. Desktop only — on phones the footer strip and the post-download card carry it. */
export function SupportHeaderButton({ locale = "en" }: { locale?: Locale }) {
  const t = supportStrings(locale);

  return (
    <a
      href={SUPPORT_URL}
      {...EXTERNAL}
      aria-label={t.aria}
      title={SUPPORT_HANDLE}
      className="hidden size-10 shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#ffdd00] text-[13.5px] font-semibold tracking-[-0.01em] text-[#1d1d1f] transition duration-300 ease-apple hover:bg-[#ffe747] active:scale-95 md:inline-flex lg:size-auto lg:h-10 lg:pl-3.5 lg:pr-4"
    >
      <Coffee className="size-[18px] lg:size-4" strokeWidth={2.2} />
      <span className="hidden lg:inline">{t.short}</span>
    </a>
  );
}
