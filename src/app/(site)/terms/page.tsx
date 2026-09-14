import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/site/legal-page";
import { getSiteSettings } from "@/lib/data/settings";
import { siteUrl } from "@/lib/env";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata({
    title: "Terms of Use",
    description: `The terms that apply when you browse ${settings.site_name} and download wallpapers, including the personal-use license.`,
    path: "/terms",
  });
}

export default async function TermsPage() {
  const settings = await getSiteSettings();
  const name = settings.site_name;
  const email = settings.contact_email;
  const host = siteUrl.replace(/^https?:\/\//, "");

  const sections: LegalSection[] = [
    {
      id: "acceptance",
      title: "Acceptance of these terms",
      content: (
        <p>
          These Terms of Use govern your access to and use of <strong>{host}</strong> (the “Site”), operated by {name}{" "}
          (“we”, “us” or “our”). By using the Site you agree to these terms and to our{" "}
          <Link href="/privacy-policy">Privacy Policy</Link>. If you do not agree, please do not use the Site.
        </p>
      ),
    },
    {
      id: "eligibility",
      title: "Eligibility",
      content: (
        <p>
          You must be at least 13 years old, or the minimum age required in your country, to use the Site. If you are
          under the age of majority, you may use the Site only with the involvement of a parent or guardian.
        </p>
      ),
    },
    {
      id: "license",
      title: "Wallpaper license",
      content: (
        <>
          <p>
            Subject to these terms, we grant you a limited, non-exclusive, non-transferable, revocable license to
            download wallpapers from the Site and use them as the background of your own personal devices, such as your
            phone, tablet or computer.
          </p>
          <p>Unless a wallpaper page clearly states a different license, you may not:</p>
          <ul>
            <li>sell, license, rent or otherwise use wallpapers for commercial purposes;</li>
            <li>
              redistribute wallpapers, individually or in bulk, including on other websites, in apps, themes, packs or
              social media accounts that republish wallpapers;
            </li>
            <li>print wallpapers on products for sale, or use them in advertising or branding;</li>
            <li>claim wallpapers as your own work, or remove any credit or watermark;</li>
            <li>use wallpapers to train, fine-tune or benchmark artificial intelligence or machine-learning models;</li>
            <li>mint wallpapers as NFTs or other digital tokens.</li>
          </ul>
          <p>
            Some wallpapers are provided by third-party artists or under third-party licenses, which are credited on the
            wallpaper page. Their terms also apply.
          </p>
        </>
      ),
    },
    {
      id: "intellectual-property",
      title: "Intellectual property",
      content: (
        <>
          <p>
            The Site, including its design, text, graphics, logos and the selection and arrangement of content, is
            owned by us or our licensors and is protected by copyright, trademark and other laws. Except for the
            wallpaper license above, no rights are granted to you.
          </p>
          <p>
            iPhone, iPhone Duo and iOS are trademarks of Apple Inc. We are not affiliated with or endorsed by Apple.
            Device names are used only to describe compatibility. See our <Link href="/disclaimer">Disclaimer</Link>.
          </p>
        </>
      ),
    },
    {
      id: "acceptable-use",
      title: "Acceptable use",
      content: (
        <>
          <p>When using the Site you agree not to:</p>
          <ul>
            <li>use bots, scrapers or automated tools to download or copy content in bulk;</li>
            <li>hotlink our image files from other websites or apps;</li>
            <li>attempt to bypass rate limits, security measures or access restricted areas such as the admin panel;</li>
            <li>upload or transmit malware, or interfere with the Site’s normal operation;</li>
            <li>use the Site for any unlawful, harmful or fraudulent purpose;</li>
            <li>click on advertisements dishonestly or encourage others to do so.</li>
          </ul>
        </>
      ),
    },
    {
      id: "submissions",
      title: "Messages and feedback",
      content: (
        <p>
          If you send us feedback, suggestions or wallpaper requests, you allow us to use them without restriction or
          compensation. Please do not send confidential information through the contact form.
        </p>
      ),
    },
    {
      id: "copyright-complaints",
      title: "Copyright complaints",
      content: (
        <p>
          We respect the rights of creators. If you believe content on the Site infringes your copyright, please follow
          the process on our <Link href="/dmca">DMCA &amp; Copyright</Link> page. We remove infringing material
          promptly and terminate repeat infringers where applicable.
        </p>
      ),
    },
    {
      id: "third-parties",
      title: "Third-party links and ads",
      content: (
        <p>
          The Site displays advertisements and may link to third-party websites. We do not control and are not
          responsible for third-party content, products, services or privacy practices. Your dealings with advertisers
          are solely between you and them.
        </p>
      ),
    },
    {
      id: "disclaimers",
      title: "Disclaimers",
      content: (
        <p>
          The Site and all content are provided “as is” and “as available”, without warranties of any kind, express or
          implied, including warranties of merchantability, fitness for a particular purpose and non-infringement. We
          do not guarantee that the Site will be uninterrupted, error-free or free of harmful components, or that
          device specifications or guides are complete or current.
        </p>
      ),
    },
    {
      id: "liability",
      title: "Limitation of liability",
      content: (
        <p>
          To the fullest extent permitted by law, {name} will not be liable for any indirect, incidental, special,
          consequential or punitive damages, or any loss of data, profits or goodwill, arising from your use of the
          Site. Our total liability for any claim relating to the Site will not exceed USD 50.
        </p>
      ),
    },
    {
      id: "indemnity",
      title: "Indemnification",
      content: (
        <p>
          You agree to indemnify and hold harmless {name} from any claims, damages, liabilities and expenses (including
          reasonable legal fees) arising from your violation of these terms or misuse of the Site or its content.
        </p>
      ),
    },
    {
      id: "termination",
      title: "Suspension and termination",
      content: (
        <p>
          We may suspend or restrict access to the Site, in whole or in part, at any time and without notice if we
          believe you have violated these terms or if needed to protect the Site or other users.
        </p>
      ),
    },
    {
      id: "governing-law",
      title: "Governing law",
      content: (
        <p>
          These terms are governed by the laws of {settings.legal_jurisdiction}, without regard to conflict-of-law
          rules. Any dispute will be subject to the exclusive jurisdiction of the competent courts of{" "}
          {settings.legal_jurisdiction}, unless the law of your country of residence requires otherwise.
        </p>
      ),
    },
    {
      id: "changes",
      title: "Changes to these terms",
      content: (
        <p>
          We may update these terms from time to time. The updated version takes effect when posted, and the “Last
          updated” date above will change. Continued use of the Site means you accept the updated terms.
        </p>
      ),
    },
    {
      id: "contact",
      title: "Contact",
      content: (
        <p>
          Questions about these terms? Email <a href={`mailto:${email}`}>{email}</a> or use our{" "}
          <Link href="/contact">contact form</Link>.
        </p>
      ),
    },
  ];

  return (
    <LegalPage
      title="Terms of Use"
      intro={<p>Please read these terms carefully. They explain what you can do with the wallpapers you download.</p>}
      sections={sections}
    />
  );
}
