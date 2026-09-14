"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function SiteError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-apple flex flex-col items-center py-24 text-center">
      <p className="text-[15px] font-semibold text-fg-2">Something went wrong</p>
      <h1 className="headline-page mt-2">We hit a snag.</h1>
      <p className="mt-4 max-w-md text-[17px] leading-7 text-fg-2">
        This page couldn’t load right now. Please try again in a moment.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => retry()} className="btn-primary">
          Try again
        </button>
        <Link href="/" className="btn-secondary">
          Go home
        </Link>
      </div>
    </section>
  );
}
