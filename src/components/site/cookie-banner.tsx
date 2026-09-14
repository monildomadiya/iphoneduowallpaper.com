"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "cookie-notice-accepted";

export function CookieBanner() {
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
      aria-label="Cookie notice"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl animate-fade-up md:bottom-6"
    >
      <div className="glass flex flex-col gap-3 rounded-2xl border border-line p-4 shadow-float sm:flex-row sm:items-center sm:gap-5">
        <p className="text-[13px] leading-5 text-fg-2">
          We use cookies to keep the site working, measure traffic and show ads from partners such as Google. Read
          our{" "}
          <Link href="/cookie-policy" className="link-apple">
            Cookie Policy
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="link-apple">
            Privacy Policy
          </Link>
          .
        </p>
        <button type="button" onClick={accept} className="btn-primary shrink-0 px-5 py-2 text-sm">
          Got it
        </button>
      </div>
    </div>
  );
}
