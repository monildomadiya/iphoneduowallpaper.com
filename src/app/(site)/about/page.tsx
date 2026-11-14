import { Layers, Ruler, ShieldCheck, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { SupportCard } from "@/components/site/support";
import { getSiteSettings } from "@/lib/data/settings";
import { languageAlternates } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { SITE_AUTHOR } from "@/lib/site";
import { SUPPORT_URL } from "@/lib/support";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata({
    title: "About Us",
    description: `${settings.site_name} is an independent library of free, full-resolution wallpapers designed for iPhone Duo's inner and outer displays.`,
    path: "/about",
    languages: languageAlternates("/about"),
  });
}

const PRINCIPLES = [
  {
    icon: Ruler,
    title: "Made to fit",
    body: "iPhone Duo has a tall 5.4-inch outer display and a wide 7.6-inch inner display. Every wallpaper is checked against both, plus iPhone 18 Pro models, and its page shows you how it fits before you download.",
  },
  {
    icon: Sparkles,
    title: "Full resolution, always",
    body: "No blurry previews or screenshots. You download the original file, with the exact resolution and file size listed on every page.",
  },
  {
    icon: ShieldCheck,
    title: "Where the artwork comes from",
    // The library is 171 AI-assisted pieces and one original. Listing AI as one source among four
    // read as hedging, and a reader who opens any wallpaper page sees "AI-assisted artwork" in its
    // details anyway. Saying it plainly costs nothing and is the only version that survives a check.
    body: "Almost every wallpaper here is AI-assisted artwork, composed and reviewed by hand before it goes up. Every wallpaper page names its source in the details, and credits the artist whenever the work is someone else's.",
  },
  {
    icon: Layers,
    title: "Organized with care",
    body: "Categories and device pages make it easy to find a wallpaper that matches your style and your screen.",
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
          {settings.site_name} is an independent wallpaper library built for the first foldable iPhone, made and run by
          one person. The goal is simple: help you find wallpapers that look right on every screen you own.
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
          <h2>Why I started</h2>
          <p>
            When a new iPhone arrives, people search for wallpapers that match its screen. iPhone Duo made that harder:
            its outer display is a tall portrait screen, while the inner display opens into a wide canvas with a fold
            down the middle. Most wallpaper sites were built for a single phone shape, so I built one around both.
          </p>
          <h2>How I choose wallpapers</h2>
          <p>
            Every wallpaper is reviewed before it is published: the composition around the Lock Screen clock and the
            fold, how the color holds up on an OLED screen, and whether I have the right to share it. Each one gets a
            title, a description, a category and its real numbers.
          </p>
          <p>
            Those numbers include the ones that are not flattering. Every wallpaper page lists the exact pixel size and
            works out, screen by screen, how much of the picture a crop removes and whether the file has to be enlarged
            to fill the display — so you can see before you download that a wide image loses its edges on the outer
            screen. I would rather tell you that than let you find out on your Lock Screen.
          </p>
          <h2>Guides that actually help</h2>
          <p>
            Beyond wallpapers, I publish practical <Link href="/blog">guides</Link> — from the exact screen sizes of
            iPhone Duo to step-by-step instructions for setting a wallpaper, fixing a blurry one and getting the Lock
            Screen depth effect to work.
          </p>
          {/* The id stays "editorial-team": every guide's byline and five translated About pages link to it. */}
          <h2 id="editorial-team">Who writes this, and how</h2>
          <p>
            My name is {SITE_AUTHOR}, and I run {settings.site_name} on my own. The guides, the wallpaper reviews and
            the replies to your emails are all mine — there is no editorial team behind the name, and I would rather say
            so than imply a newsroom that does not exist. What I can promise is the way I work:</p>
          <ul>
            <li>
              <strong>Specific and practical.</strong> Exact screen sizes, real menu paths and step-by-step instructions
              instead of filler.
            </li>
            <li>
              <strong>Checked before publishing.</strong> Steps are compared with Apple&apos;s own documentation and the
              current version of iOS. Where menu names differ between iOS versions, I say so.
            </li>
            <li>
              <strong>Kept up to date.</strong> Every guide shows the date it was last updated, and I revise guides when
              iOS changes how something works.
            </li>
            <li>
              <strong>Independent.</strong> I don&apos;t accept payment for coverage. Advertising is clearly labeled and
              kept separate from the writing.
            </li>
            <li>
              <strong>Open to corrections.</strong> If something is wrong or out of date,{" "}
              <Link href="/contact">tell me</Link> and I&apos;ll fix it.
            </li>
          </ul>
          <h2>Independent and free</h2>
          <p>
            This site is not affiliated with Apple Inc. It is free to use and supported by clearly labeled advertising
            and by readers who{" "}
            <a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer nofollow">
              buy me a coffee
            </a>
            . Wallpapers are for personal use on your own devices; see the <Link href="/terms">Terms of Use</Link>.
          </p>
          <h2>Get in touch</h2>
          <p>
            Have a wallpaper request, feedback or a partnership idea? Visit the <Link href="/contact">contact page</Link>{" "}
            or email <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>. Creators who find their
            work here without permission can reach me through the <Link href="/dmca">copyright page</Link>.
          </p>
        </div>
        <SupportCard className="mx-auto mt-14 max-w-3xl" />
      </section>
    </>
  );
}
