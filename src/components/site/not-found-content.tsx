import Link from "next/link";
import { DeviceFrame } from "@/components/wallpaper/device-frame";
import type { NotFoundStrings } from "@/lib/i18n/types";

const EN: NotFoundStrings = {
  eyebrow: "Error 404",
  h1: "This page folded away.",
  body: "The page you are looking for doesn’t exist or has been moved. Try one of these instead.",
  home: "Go home",
  browse: "Browse wallpapers",
  english: "",
};

export function NotFoundContent({
  strings: t = EN,
  date,
  homeHref = "/",
  browseHref = "/wallpapers",
  englishHref,
}: {
  strings?: NotFoundStrings;
  /** Lock Screen date in the page's language. */
  date?: string;
  homeHref?: string;
  browseHref?: string;
  /** The English page at the same address, for a translation that doesn't exist yet. */
  englishHref?: string;
}) {
  return (
    <section className="container-apple flex flex-col items-center py-20 text-center md:py-28">
      <DeviceFrame variant="duo-outer" mode="lock" artwork={1} date={date} className="w-40" />
      <p className="mt-10 text-[15px] font-semibold text-fg-2">{t.eyebrow}</p>
      <h1 className="headline-page mt-2">{t.h1}</h1>
      <p className="mt-4 max-w-md text-[17px] leading-7 text-fg-2">{t.body}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href={homeHref} className="btn-primary">
          {t.home}
        </Link>
        <Link href={browseHref} className="btn-secondary">
          {t.browse}
        </Link>
      </div>
      {englishHref && t.english ? (
        <p className="mt-6 text-[15px]">
          <Link href={englishHref} hrefLang="en" lang="en" className="link-apple">
            {t.english}
          </Link>
        </p>
      ) : null}
    </section>
  );
}
