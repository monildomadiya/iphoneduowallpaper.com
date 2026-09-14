import { Clock, Flag, Mail } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/site/forms";
import { getSiteSettings } from "@/lib/data/settings";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata({
    title: "Contact Us",
    description: `Get in touch with ${settings.site_name} for wallpaper requests, feedback, partnerships or support.`,
    path: "/contact",
  });
}

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="container-apple">
      <header className="pb-10 pt-10 md:pt-16">
        <p className="text-[15px] font-semibold text-fg-2">Contact</p>
        <h1 className="headline-page mt-2">We’d love to hear from you.</h1>
        <p className="mt-4 max-w-2xl text-[19px] leading-8 text-fg-2">
          Wallpaper requests, feedback, partnership ideas or a problem with a download — send us a message.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
        <section className="rounded-[28px] border border-line bg-elevated p-6 shadow-card md:p-8">
          <ContactForm />
        </section>

        <aside className="space-y-4">
          <div className="rounded-[24px] bg-surface p-6">
            <Mail className="size-6 text-accent" strokeWidth={1.7} />
            <h2 className="mt-3 text-[19px] font-semibold tracking-tight">Email</h2>
            <a href={`mailto:${settings.contact_email}`} className="link-apple mt-1 block break-all text-[15px]">
              {settings.contact_email}
            </a>
          </div>
          <div className="rounded-[24px] bg-surface p-6">
            <Clock className="size-6 text-accent" strokeWidth={1.7} />
            <h2 className="mt-3 text-[19px] font-semibold tracking-tight">Response time</h2>
            <p className="mt-1 text-[15px] leading-6 text-fg-2">We aim to reply within 2–3 business days.</p>
          </div>
          <div className="rounded-[24px] bg-surface p-6">
            <Flag className="size-6 text-accent" strokeWidth={1.7} />
            <h2 className="mt-3 text-[19px] font-semibold tracking-tight">Copyright concerns</h2>
            <p className="mt-1 text-[15px] leading-6 text-fg-2">
              Rights holders can file a notice on our{" "}
              <Link href="/dmca" className="link-apple">
                DMCA page
              </Link>{" "}
              for the fastest review.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
