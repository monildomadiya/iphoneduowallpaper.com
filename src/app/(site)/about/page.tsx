import { Layers, Ruler, ShieldCheck, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/data/settings";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata({
    title: "About Us",
    description: `${settings.site_name} is an independent library of free, full-resolution wallpapers designed for iPhone Duo's inner and outer displays.`,
    path: "/about",
  });
}

const PRINCIPLES = [
  {
    icon: Ruler,
    title: "Made to fit",
    body: "iPhone Duo has a tall 5.4-inch outer display and a wide 7.6-inch inner display. We check every wallpaper against both, plus iPhone 18 Pro models, and show you how it fits before you download.",
  },
  {
    icon: Sparkles,
    title: "Full resolution, always",
    body: "No blurry previews or screenshots. You download the original file, with the exact resolution and file size listed on every page.",
  },
  {
    icon: ShieldCheck,
    title: "Respect for creators",
    body: "We publish original artwork, AI-assisted designs reviewed by a person, licensed images and public-domain works — and credit artists wherever it applies.",
  },
  {
    icon: Layers,
    title: "Organized with care",
    body: "Categories, curated collections and device pages make it easy to find a wallpaper that matches your style and your screen.",
  },
];

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <header className="container-apple pb-12 pt-10 text-center md:pb-16 md:pt-20">
        <p className="text-[15px] font-semibold text-fg-2">About us</p>
        <h1 className="headline-hero mx-auto mt-3 max-w-4xl text-balance">
          Two screens deserve <span className="text-gradient-duo">great wallpapers.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-[19px] leading-8 text-fg-2 md:text-[21px]">
          {settings.site_name} is an independent wallpaper library built for the first foldable iPhone. Our goal is
          simple: help you find beautiful, full-resolution wallpapers that look right on every screen you own.
        </p>
      </header>

      <section className="container-apple">
        <ul className="grid gap-5 md:grid-cols-2">
          {PRINCIPLES.map(({ icon: Icon, title, body }) => (
            <li key={title} className="rounded-[28px] bg-surface p-8">
              <Icon className="size-8 text-accent" strokeWidth={1.6} />
              <h2 className="mt-5 text-2xl font-semibold tracking-tight">{title}</h2>
              <p className="mt-2 text-[17px] leading-7 text-fg-2">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-apple mt-20">
        <div className="prose-apple mx-auto max-w-3xl">
          <h2>Why we started</h2>
          <p>
            When a new iPhone arrives, people search for wallpapers that match its screen. iPhone Duo made that harder:
            its outer display is a tall portrait screen, while the inner display opens into a wide canvas with a fold
            down the middle. Most wallpaper sites were built for a single phone shape, so we built one around both.
          </p>
          <h2>How we choose wallpapers</h2>
          <p>
            Every wallpaper is reviewed before it is published. We look at resolution, composition around the Lock
            Screen clock and the fold, color quality on OLED displays, and whether we have the right to share it. Each
            wallpaper gets a clear title, a description, a category and details such as resolution and file size, so you
            know exactly what you are downloading.
          </p>
          <h2>Guides that actually help</h2>
          <p>
            Beyond wallpapers, we publish practical <Link href="/blog">guides</Link> — from the exact screen sizes of
            iPhone Duo to step-by-step instructions for setting a wallpaper and saving images to Photos.
          </p>
          <h2>Independent and free</h2>
          <p>
            We are not affiliated with Apple Inc. The Site is free to use and supported by clearly labeled advertising.
            Wallpapers are for personal use on your own devices; see our <Link href="/terms">Terms of Use</Link>.
          </p>
          <h2>Get in touch</h2>
          <p>
            Have a wallpaper request, feedback or a partnership idea? Visit our <Link href="/contact">contact page</Link>{" "}
            or email <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>. Creators who find their
            work here without permission can reach us through our <Link href="/dmca">copyright page</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
