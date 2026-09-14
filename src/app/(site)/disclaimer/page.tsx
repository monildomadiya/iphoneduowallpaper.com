import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/site/legal-page";
import { getSiteSettings } from "@/lib/data/settings";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Disclaimer",
    description: "Trademark notice, content accuracy and advertising disclosures for our independent iPhone wallpaper website.",
    path: "/disclaimer",
  });
}

export default async function DisclaimerPage() {
  const settings = await getSiteSettings();
  const name = settings.site_name;

  const sections: LegalSection[] = [
    {
      id: "not-affiliated",
      title: "Not affiliated with Apple",
      content: (
        <p>
          {name} is an independent website. We are not affiliated with, authorized, sponsored or endorsed by Apple Inc.
          iPhone, iPhone Duo, iOS and Apple are trademarks of Apple Inc., registered in the U.S. and other countries.
          All product names are used only to identify the devices our wallpapers are designed for. Device mockups on
          this Site are simplified illustrations, not official product images.
        </p>
      ),
    },
    {
      id: "content",
      title: "Wallpaper content",
      content: (
        <>
          <p>
            We publish wallpapers that are original works, AI-assisted designs reviewed by our editors, content licensed
            to us, or works in the public domain. Where a third party created a wallpaper, we credit them on the
            wallpaper page.
          </p>
          <p>
            We do not knowingly publish copyrighted material without permission. If you believe a wallpaper infringes
            your rights, please <Link href="/dmca">submit a notice</Link> and we will act promptly.
          </p>
        </>
      ),
    },
    {
      id: "accuracy",
      title: "Accuracy of information",
      content: (
        <p>
          Device specifications, screen resolutions and how-to guides are based on publicly available information at
          the time of writing. Menus and features can change with software updates, so details may differ on your
          device. Information on the Site is provided for general purposes only and without warranty.
        </p>
      ),
    },
    {
      id: "advertising",
      title: "Advertising disclosure",
      content: (
        <p>
          The Site is free to use and is supported by advertising, including ads served by Google AdSense. Ads are
          clearly labeled. We do not control which specific ads appear and do not endorse the products or services
          advertised.
        </p>
      ),
    },
    {
      id: "external-links",
      title: "External links",
      content: (
        <p>
          Links to third-party websites are provided for convenience. We are not responsible for the content, accuracy
          or practices of external websites.
        </p>
      ),
    },
    {
      id: "use-at-own-risk",
      title: "Use at your own risk",
      content: (
        <p>
          Downloads are provided “as is”. We scan and review our files, but you are responsible for how you use the
          content and for keeping your devices protected. See our <Link href="/terms">Terms of Use</Link> for full
          details.
        </p>
      ),
    },
    {
      id: "contact",
      title: "Contact",
      content: (
        <p>
          Questions about this disclaimer? Email{" "}
          <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>.
        </p>
      ),
    },
  ];

  return <LegalPage title="Disclaimer" sections={sections} />;
}
