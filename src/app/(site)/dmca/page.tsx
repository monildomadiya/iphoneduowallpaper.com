import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LegalPage, type LegalSection } from "@/components/site/legal-page";
import { ReportForm } from "@/components/site/forms";
import { getSiteSettings } from "@/lib/data/settings";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "DMCA & Copyright Policy",
    description: "How to report copyright infringement or other problems with wallpapers, and how we handle notices and counter-notices.",
    path: "/dmca",
  });
}

export default async function DmcaPage() {
  const settings = await getSiteSettings();
  const email = settings.contact_email;

  const sections: LegalSection[] = [
    {
      id: "our-commitment",
      title: "Our commitment",
      content: (
        <p>
          {settings.site_name} respects the intellectual property rights of artists and photographers. We respond to
          clear notices of alleged copyright infringement in line with the U.S. Digital Millennium Copyright Act (DMCA)
          and similar laws in other countries, and we remove infringing material quickly.
        </p>
      ),
    },
    {
      id: "filing-a-notice",
      title: "Filing a copyright notice",
      content: (
        <>
          <p>Your notice must include:</p>
          <ol>
            <li>your physical or electronic signature (typing your full legal name is acceptable);</li>
            <li>identification of the copyrighted work you believe has been infringed;</li>
            <li>the exact URL(s) of the material on our Site that you want removed;</li>
            <li>your name, postal address, telephone number and email address;</li>
            <li>
              a statement that you have a good-faith belief that the use is not authorized by the copyright owner, its
              agent or the law; and
            </li>
            <li>
              a statement that the information in the notice is accurate and, under penalty of perjury, that you are
              the owner or authorized to act on the owner’s behalf.
            </li>
          </ol>
          <p>
            Use the form below or email <a href={`mailto:${email}`}>{email}</a> with the subject “DMCA Notice”. We
            usually review notices within 2–3 business days.
          </p>
        </>
      ),
    },
    {
      id: "counter-notice",
      title: "Counter-notices",
      content: (
        <p>
          If your content was removed and you believe this was a mistake or misidentification, you may send a
          counter-notice with your signature, identification of the removed material and its former location, a
          statement under penalty of perjury that you have a good-faith belief it was removed by mistake, and your
          consent to the jurisdiction of the appropriate court. We may restore the material if the complainant does not
          file legal action within 10–14 business days.
        </p>
      ),
    },
    {
      id: "repeat-infringers",
      title: "Repeat infringers",
      content: (
        <p>
          We permanently stop working with contributors or sources that repeatedly provide infringing content.
        </p>
      ),
    },
    {
      id: "misrepresentation",
      title: "False claims",
      content: (
        <p>
          Knowingly misrepresenting that material is infringing, or that it was removed by mistake, may make you liable
          for damages under Section 512(f) of the DMCA. If you are unsure whether content infringes your rights,
          consider seeking legal advice first.
        </p>
      ),
    },
    {
      id: "other-issues",
      title: "Other problems",
      content: (
        <p>
          You can also use the form to report inappropriate content or broken downloads. For anything else, visit our{" "}
          <Link href="/contact">contact page</Link>.
        </p>
      ),
    },
  ];

  return (
    <LegalPage
      title="DMCA & Copyright Policy"
      intro={<p>Found your work on our Site without permission, or something that should not be here? Let us know.</p>}
      sections={sections}
    >
      <section id="report" className="mt-14 scroll-mt-20 rounded-[28px] border border-line p-6 md:p-8">
        <h2 className="!mt-0">Submit a report</h2>
        <div className="mt-6 not-prose">
          <Suspense fallback={<div className="skeleton h-[640px] rounded-2xl" />}>
            <ReportForm />
          </Suspense>
        </div>
      </section>
    </LegalPage>
  );
}
