import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/site/legal-page";
import { getSiteSettings } from "@/lib/data/settings";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Cookie Policy",
    description: "Which cookies and similar technologies we use, including Google AdSense and analytics cookies, and how to control them.",
    path: "/cookie-policy",
  });
}

export default async function CookiePolicyPage() {
  const settings = await getSiteSettings();
  const email = settings.contact_email;

  const sections: LegalSection[] = [
    {
      id: "what-are-cookies",
      title: "What are cookies?",
      content: (
        <p>
          Cookies are small text files stored on your device when you visit a website. Similar technologies include
          local storage, pixels and device identifiers. They help websites work, remember your preferences and
          understand how they are used. In this policy we refer to all of these as “cookies”.
        </p>
      ),
    },
    {
      id: "how-we-use",
      title: "How we use cookies",
      content: (
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Purpose</th>
                <th>Examples</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Strictly necessary</strong>
                </td>
                <td>Keep the Site secure and working, remember your theme and cookie-notice choice, and keep administrators signed in.</td>
                <td>theme, cookie-notice-accepted (local storage); sb-* authentication cookies (admins only)</td>
              </tr>
              <tr>
                <td>
                  <strong>Analytics</strong>
                </td>
                <td>Understand how visitors use the Site so we can improve it.</td>
                <td>Google Analytics (_ga, _ga_*)</td>
              </tr>
              <tr>
                <td>
                  <strong>Advertising</strong>
                </td>
                <td>
                  Show ads, limit how often you see an ad, measure ad performance and, with your consent where required,
                  personalize ads.
                </td>
                <td>Google AdSense and its partners (for example __gads, __gpi, __eoi, IDE)</td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },
    {
      id: "third-party",
      title: "Third-party cookies",
      content: (
        <>
          <p>
            Some cookies are set by third parties, mainly Google. Google and other vendors use cookies to serve ads
            based on your prior visits to this Site and other websites. These providers have their own privacy
            policies:
          </p>
          <ul>
            <li>
              <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">
                How Google uses cookies in advertising
              </a>
            </li>
            <li>
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                Google Privacy Policy
              </a>
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "consent",
      title: "Your consent",
      content: (
        <p>
          Visitors in the European Economic Area, the United Kingdom and Switzerland are asked for consent before
          non-essential cookies are used for personalized advertising, through a consent message that appears on the
          Site. You can change your choice at any time using the privacy settings link shown in that message or by
          clearing your cookies.
        </p>
      ),
    },
    {
      id: "manage",
      title: "How to manage cookies",
      content: (
        <>
          <ul>
            <li>
              <strong>Browser settings:</strong> most browsers let you block or delete cookies. On iPhone, go to
              Settings → Apps → Safari → Advanced → Website Data (menu names may vary by iOS version).
            </li>
            <li>
              <strong>Personalized ads:</strong> visit{" "}
              <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
                Google Ads Settings
              </a>{" "}
              or{" "}
              <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer">
                aboutads.info/choices
              </a>
              .
            </li>
            <li>
              <strong>Analytics:</strong> install the{" "}
              <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
                Google Analytics Opt-out Add-on
              </a>
              .
            </li>
          </ul>
          <p>Blocking cookies may affect how some parts of the Site work.</p>
        </>
      ),
    },
    {
      id: "more",
      title: "More information",
      content: (
        <p>
          For details on how we handle personal information, see our <Link href="/privacy-policy">Privacy Policy</Link>.
          Questions? Email <a href={`mailto:${email}`}>{email}</a>.
        </p>
      ),
    },
  ];

  return (
    <LegalPage
      title="Cookie Policy"
      intro={<p>This policy explains how {settings.site_name} and our partners use cookies and how you can control them.</p>}
      sections={sections}
    />
  );
}
