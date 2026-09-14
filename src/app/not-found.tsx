import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/site/logo";
import { NotFoundContent } from "@/components/site/not-found-content";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <header className="glass sticky top-0 z-50 border-b border-line">
        <div className="container-apple flex h-12 items-center">
          <Link href="/" className="inline-flex items-center gap-2 text-[15px] font-semibold tracking-tight">
            <LogoMark />
            iPhone Duo Wallpapers
          </Link>
        </div>
      </header>
      <main id="main">
        <NotFoundContent />
      </main>
    </>
  );
}
