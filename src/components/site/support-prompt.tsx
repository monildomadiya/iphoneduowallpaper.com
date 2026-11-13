"use client";

import { Coffee, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SUPPORT_URL, type SupportStrings } from "@/lib/support";

/** How long the card stays quiet after someone waves it away, and after someone does buy a coffee. */
const SNOOZE_DISMISSED_DAYS = 14;
const SNOOZE_SUPPORTED_DAYS = 180;

const SNOOZE_KEY = "support:snooze";
const DAY = 86_400_000;

function snoozed() {
  try {
    const until = Number(localStorage.getItem(SNOOZE_KEY));
    return Number.isFinite(until) && until > Date.now();
  } catch {
    // Storage blocked (private mode, strict settings) — show it, the dismiss button still works.
    return false;
  }
}

function snooze(days: number) {
  try {
    localStorage.setItem(SNOOZE_KEY, String(Date.now() + days * DAY));
  } catch {
    // Nothing to remember it with; the card simply comes back on the next download.
  }
}

/**
 * The ask, at the one moment it is earned: a wallpaper has just been downloaded. Mounted on
 * wallpaper pages, it watches for a click on a real download link — not "View full size" — and
 * slides a small card in a moment later. Dismissing it keeps it away for a fortnight; following it
 * through to Buy Me a Coffee keeps it away for half a year.
 */
export function SupportPrompt({ strings: t }: { strings: SupportStrings }) {
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  /** Answered once on this page — don't ask again even where localStorage is blocked. */
  const answered = useRef(false);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest?.("a[href*='/api/download/']");
      // "View full size" opens the image in a tab; nothing lands in Files, so nothing is owed.
      if (!(link instanceof HTMLAnchorElement) || link.href.includes("mode=view")) return;
      if (answered.current || timer.current || snoozed()) return;
      timer.current = window.setTimeout(() => {
        timer.current = undefined;
        setOpen(true);
      }, 1600);
    }

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      window.clearTimeout(timer.current);
    };
  }, []);

  if (!open) return null;

  function close(days: number) {
    answered.current = true;
    snooze(days);
    setOpen(false);
  }

  const dismiss = () => close(SNOOZE_DISMISSED_DAYS);

  return (
    <aside
      aria-label={t.eyebrow}
      className="fixed inset-x-3 bottom-3 z-30 mx-auto max-w-sm animate-fade-up [animation-duration:0.5s] sm:inset-x-auto sm:bottom-5 sm:right-5"
    >
      <div className="relative overflow-hidden rounded-[22px] border border-[#f0c400]/40 bg-white/95 p-5 shadow-float ring-1 ring-black/[0.06] backdrop-blur-xl">
        <span aria-hidden="true" className="pointer-events-none absolute -right-8 -top-10 size-32 rounded-full bg-[#ffdd00]/30 blur-2xl" />
        <button
          type="button"
          onClick={dismiss}
          aria-label={t.dismiss}
          className="absolute right-3 top-3 grid size-7 place-items-center rounded-full text-fg-3 transition hover:bg-black/[0.06] hover:text-fg"
        >
          <X className="size-4" />
        </button>
        <div className="relative flex items-start gap-3 pr-7">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#ffdd00] text-[#1d1d1f]">
            <Coffee className="size-5" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <p className="text-[16px] font-semibold tracking-tight text-fg">{t.thanksTitle}</p>
            <p className="mt-1 text-[14px] leading-5 text-fg-2">{t.thanksBody}</p>
          </div>
        </div>
        <div className="relative mt-4 flex items-center gap-2">
          <a
            href={SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer nofollow"
            aria-label={t.aria}
            onClick={() => close(SNOOZE_SUPPORTED_DAYS)}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#ffdd00] px-5 text-[15px] font-semibold tracking-[-0.01em] text-[#1d1d1f] transition duration-300 ease-apple hover:bg-[#ffe747] active:scale-[0.98]"
          >
            <Coffee className="size-[18px]" strokeWidth={2.2} />
            {t.cta}
          </a>
          <button
            type="button"
            onClick={dismiss}
            className="h-11 shrink-0 rounded-full px-4 text-[14px] font-medium text-fg-2 transition hover:bg-black/[0.05] hover:text-fg"
          >
            {t.dismiss}
          </button>
        </div>
      </div>
    </aside>
  );
}
