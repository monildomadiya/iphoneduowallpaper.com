"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CookieStrings } from "@/lib/i18n/types";

const STORAGE_KEY = "cookie-notice-accepted";

const EN_COOKIES: CookieStrings = {
  label: "Cookie notice",
  before: "We use cookies to keep the site working, measure traffic and show ads from partners such as Google. Read our ",
  between: " and ",
  after: ".",
  cookiePolicy: "Cookie Policy",
  privacyPolicy: "Privacy Policy",
  accept: "Got it",
};

export function CookieBanner({ strings: t = EN_COOKIES }: { strings?: CookieStrings }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // Storage unavailable — skip the notice.
    }
  }, []);

  if (!visible) return null;

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {
      // ignore
    }
    setVisible(false);
  }

  return (
    <div
      role="region"
      aria-label={t.label}
      className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 mx-auto max-w-2xl animate-fade-up md:bottom-6"
    >
      <div className="glass flex flex-col gap-3 rounded-2xl border border-line p-4 shadow-float sm:flex-row sm:items-center sm:gap-5">
        <p className="text-[13px] leading-5 text-fg-2">
          {t.before}
          <Link href="/cookie-policy" className="link-apple">
            {t.cookiePolicy}
          </Link>
          {t.between}
          <Link href="/privacy-policy" className="link-apple">
            {t.privacyPolicy}
          </Link>
          {t.after}
        </p>
        <button type="button" onClick={accept} className="btn-primary shrink-0 px-5 py-2 text-sm">
          {t.accept}
        </button>
      </div>
    </div>
  );
}
