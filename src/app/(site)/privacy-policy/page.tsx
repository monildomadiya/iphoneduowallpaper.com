import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/site/legal-page";
import { getSiteSettings } from "@/lib/data/settings";
import { siteUrl } from "@/lib/env";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata({
    title: "Privacy Policy",
    description: `How ${settings.site_name} collects, uses and protects information, including cookies and Google AdSense advertising.`,
    path: "/privacy-policy",
  });
}

export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettings();
  const name = settings.site_name;
  const email = settings.contact_email;
  const host = siteUrl.replace(/^https?:\/\//, "");

  const sections: LegalSection[] = [
    {
      id: "who-we-are",
      title: "Who we are",
      content: (
        <>
          <p>
            {name} (“we”, “us” or “our”) operates the website <strong>{host}</strong> (the “Site”), a free library of
            wallpapers for iPhone Duo, iPhone 18 Pro and other devices. This Privacy Policy explains what information we
            collect when you use the Site, how we use it, and the choices you have.
          </p>
          <p>
            If you have any questions, contact us at <a href={`mailto:${email}`}>{email}</a> or through our{" "}
            <Link href="/contact">contact page</Link>.
          </p>
        </>
      ),
    },
    {
      id: "information-we-collect",
      title: "Information we collect",
      content: (
        <>
          <h3>Information you give us</h3>
          <p>
            You can browse and download wallpapers without creating an account. If you contact us or submit a report,
            we collect the details you enter — typically your name, email address, the subject and your message — so
            that we can respond.
          </p>
          <h3>Information collected automatically</h3>
          <p>
            Like most websites, our hosting and security systems automatically process technical data when you visit,
            such as your IP address, browser type, device type, referring page, the pages you view and the date and
            time of your visit. We use this data to deliver the Site, keep it secure (for example, to prevent abuse and
            limit excessive downloads) and understand overall usage. We count wallpaper views and downloads as
            aggregate totals that do not identify you.
          </p>
          <h3>Cookies and similar technologies</h3>
          <p>
            We and our partners use cookies, local storage and similar technologies. For example, we remember your
            light or dark theme preference and whether you have dismissed our cookie notice. Advertising and analytics
            partners may also set cookies, as described below and in our <Link href="/cookie-policy">Cookie Policy</Link>.
          </p>
        </>
      ),
    },
    {
      id: "how-we-use-information",
      title: "How we use information",
      content: (
        <ul>
          <li>To operate, maintain and improve the Site and our wallpaper library.</li>
          <li>To respond to your messages, requests and copyright or content reports.</li>
          <li>To measure traffic and understand which wallpapers and guides are popular.</li>
          <li>To display advertising that helps keep the Site free.</li>
          <li>To detect, prevent and address fraud, spam, abuse, security and technical issues.</li>
          <li>To comply with legal obligations and enforce our <Link href="/terms">Terms of Use</Link>.</li>
        </ul>
      ),
    },
    {
      id: "advertising",
      title: "Advertising and Google AdSense",
      content: (
        <>
          <p>
            We use Google AdSense to display advertisements. Google and other third-party vendors use cookies to serve
            ads based on your prior visits to this website and other websites on the internet.
          </p>
          <ul>
            <li>
              Google’s use of advertising cookies enables it and its partners to serve ads to you based on your visit
              to this Site and/or other sites on the internet.
            </li>
            <li>
              You may opt out of personalized advertising by visiting{" "}
              <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
                Google Ads Settings
              </a>
              .
            </li>
            <li>
              You can also opt out of some third-party vendors’ use of cookies for personalized advertising by visiting{" "}
              <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer">
                www.aboutads.info/choices
              </a>{" "}
              or, in Europe,{" "}
              <a href="https://www.youronlinechoices.eu" target="_blank" rel="noopener noreferrer">
                www.youronlinechoices.eu
              </a>
              .
            </li>
          </ul>
          <p>
            Where required by law — for example for visitors in the European Economic Area, the United Kingdom and
            Switzerland — we ask for your consent before personalized ads are shown, using a consent management
            platform. If you do not consent, you may still see non-personalized ads, which use cookies only for
            frequency capping, aggregated reporting and fraud prevention.
          </p>
          <p>
            To learn more, see{" "}
            <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
              How Google uses information from sites or apps that use its services
            </a>
            .
          </p>
        </>
      ),
    },
    {
      id: "analytics",
      title: "Analytics",
      content: (
        <p>
          We may use Google Analytics to understand how visitors use the Site, such as which pages are visited and how
          long visitors stay. Google Analytics uses cookies and collects information such as your device, browser and
          approximate location. You can prevent your data from being used by Google Analytics by installing the{" "}
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
            Google Analytics Opt-out Browser Add-on
          </a>
          .
        </p>
      ),
    },
    {
      id: "legal-bases",
      title: "Legal bases for processing",
      content: (
        <p>
          If you are in the European Economic Area or the United Kingdom, we process personal data on these legal
          bases: your <strong>consent</strong> (for example, for personalized advertising cookies); our{" "}
          <strong>legitimate interests</strong> in operating, securing and improving the Site; and compliance with{" "}
          <strong>legal obligations</strong>. You can withdraw consent at any time.
        </p>
      ),
    },
    {
      id: "sharing",
      title: "How we share information",
      content: (
        <>
          <p>We do not sell your personal information. We share information only as follows:</p>
          <ul>
            <li>
              <strong>Service providers</strong> that host and run the Site on our behalf, such as our web hosting
              provider (Render), our database provider (Supabase) and our image storage and delivery network
              (Cloudflare). They may process data only to provide their services to us.
            </li>
            <li>
              <strong>Advertising and analytics partners</strong> such as Google, as described above.
            </li>
            <li>
              <strong>Legal and safety reasons</strong> — when required by law, or to protect the rights, property
              and safety of our users, the public or us.
            </li>
            <li>
              <strong>Business transfers</strong> — if the Site is involved in a merger, acquisition or sale of assets.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "retention",
      title: "Data retention",
      content: (
        <p>
          We keep contact messages and reports only as long as needed to respond and to keep a record of how they were
          handled, and generally no longer than 24 months. Server logs are retained for a limited period by our hosting
          providers for security and troubleshooting. Aggregate statistics that do not identify you may be kept longer.
        </p>
      ),
    },
    {
      id: "your-rights",
      title: "Your privacy rights",
      content: (
        <>
          <p>Depending on where you live, you may have the right to:</p>
          <ul>
            <li>access the personal information we hold about you and receive a copy;</li>
            <li>correct inaccurate information or ask us to delete it;</li>
            <li>object to or restrict certain processing, and withdraw consent at any time;</li>
            <li>data portability; and</li>
            <li>lodge a complaint with your local data protection authority.</li>
          </ul>
          <p>
            <strong>California residents:</strong> under the CCPA/CPRA you have the right to know what personal
            information we collect, to request deletion or correction, and to opt out of the “sale” or “sharing” of
            personal information for cross-context behavioral advertising. We do not sell personal information for
            money. You can limit personalized advertising through Google Ads Settings and your browser controls, and we
            will not discriminate against you for exercising your rights.
          </p>
          <p>
            To exercise any of these rights, email <a href={`mailto:${email}`}>{email}</a>. We will respond within the
            time required by applicable law.
          </p>
        </>
      ),
    },
    {
      id: "children",
      title: "Children’s privacy",
      content: (
        <p>
          The Site is intended for a general audience and is not directed to children under 13 (or the minimum age in
          your country). We do not knowingly collect personal information from children. If you believe a child has
          sent us personal information, please contact us and we will delete it.
        </p>
      ),
    },
    {
      id: "security",
      title: "Security",
      content: (
        <p>
          We use reasonable technical and organizational measures to protect information, including encrypted HTTPS
          connections and access controls on our systems. No method of transmission or storage is completely secure,
          so we cannot guarantee absolute security.
        </p>
      ),
    },
    {
      id: "international",
      title: "International transfers",
      content: (
        <p>
          Our service providers may process information in countries other than your own, including the United States
          and India. Where required, we rely on appropriate safeguards such as standard contractual clauses.
        </p>
      ),
    },
    {
      id: "third-party-links",
      title: "Third-party links",
      content: (
        <p>
          The Site may contain links to other websites and advertisements from third parties. We are not responsible
          for the privacy practices of those websites, and we encourage you to read their privacy policies.
        </p>
      ),
    },
    {
      id: "changes",
      title: "Changes to this policy",
      content: (
        <p>
          We may update this Privacy Policy from time to time. When we do, we will change the “Last updated” date at
          the top of this page. Significant changes will be highlighted on the Site.
        </p>
      ),
    },
    {
      id: "contact",
      title: "Contact us",
      content: (
        <p>
          Questions or requests about this Privacy Policy can be sent to <a href={`mailto:${email}`}>{email}</a>
          {settings.legal_entity ? ` (${settings.legal_entity})` : ""} or through our{" "}
          <Link href="/contact">contact form</Link>.
        </p>
      ),
    },
  ];

  return (
    <LegalPage
      title="Privacy Policy"
      intro={<p>Your privacy matters. This policy explains, in plain language, what we collect and why.</p>}
      sections={sections}
    />
  );
}
