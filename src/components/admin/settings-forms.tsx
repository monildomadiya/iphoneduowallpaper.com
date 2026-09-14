"use client";

import { CheckCircle2, ExternalLink, Loader2, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { saveAdsSettings, saveGeneralSettings, updateDisplayName } from "@/app/admin/actions/settings";
import { AD_PLACEMENTS, type AdPlacement, type SiteSettings, type SocialLinks } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Switch } from "./client";
import { Card, Field, buttonClass, inputClass } from "./ui";

function SaveBar({ pending, onSave, label = "Save changes" }: { pending: boolean; onSave: () => void; label?: string }) {
  return (
    <div className="flex justify-end">
      <button type="button" onClick={onSave} disabled={pending} className={cn(buttonClass.primary, "h-11 px-6")}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : null}
        {label}
      </button>
    </div>
  );
}

const SOCIAL_FIELDS: { key: keyof SocialLinks; label: string }[] = [
  { key: "instagram", label: "Instagram" },
  { key: "pinterest", label: "Pinterest" },
  { key: "x", label: "X (Twitter)" },
  { key: "youtube", label: "YouTube" },
  { key: "threads", label: "Threads" },
  { key: "facebook", label: "Facebook" },
];

export function GeneralSettingsForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [siteName, setSiteName] = useState(settings.site_name);
  const [tagline, setTagline] = useState(settings.tagline);
  const [contactEmail, setContactEmail] = useState(settings.contact_email);
  const [announcement, setAnnouncement] = useState(settings.announcement ?? "");
  const [gaMeasurementId, setGaMeasurementId] = useState(settings.ga_measurement_id ?? "");
  const [cookieBannerEnabled, setCookieBannerEnabled] = useState(settings.cookie_banner_enabled);
  const [legalEntity, setLegalEntity] = useState(settings.legal_entity ?? "");
  const [legalJurisdiction, setLegalJurisdiction] = useState(settings.legal_jurisdiction);
  const [social, setSocial] = useState<SocialLinks>(settings.social_links ?? {});

  function save() {
    startTransition(async () => {
      const result = await saveGeneralSettings({
        siteName,
        tagline,
        contactEmail,
        announcement,
        gaMeasurementId,
        cookieBannerEnabled,
        legalEntity,
        legalJurisdiction,
        social: {
          instagram: social.instagram ?? "",
          pinterest: social.pinterest ?? "",
          x: social.x ?? "",
          youtube: social.youtube ?? "",
          threads: social.threads ?? "",
          facebook: social.facebook ?? "",
        },
      });
      if (result.ok) {
        toast.success(result.message ?? "Saved");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="space-y-5">
      <Card title="Brand" description="Used in page titles, the header, footer and legal pages.">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Site name" htmlFor="site-name">
            <input id="site-name" value={siteName} onChange={(event) => setSiteName(event.target.value)} className={inputClass} />
          </Field>
          <Field label="Contact email" htmlFor="contact-email" hint="Shown on Contact, Privacy and DMCA pages. Use an inbox you check.">
            <input id="contact-email" type="email" value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} className={inputClass} />
          </Field>
          <Field label="Tagline" htmlFor="tagline" className="md:col-span-2">
            <input id="tagline" value={tagline} onChange={(event) => setTagline(event.target.value)} className={inputClass} />
          </Field>
          <Field label="Announcement bar" htmlFor="announcement" hint="Optional one-line message under the header." className="md:col-span-2">
            <input id="announcement" value={announcement} onChange={(event) => setAnnouncement(event.target.value)} className={inputClass} />
          </Field>
        </div>
      </Card>

      <Card title="Analytics & privacy">
        <div className="space-y-5">
          <Field label="Google Analytics 4 measurement ID" htmlFor="ga-id" hint="Optional, e.g. G-ABC123XYZ9">
            <input id="ga-id" value={gaMeasurementId} onChange={(event) => setGaMeasurementId(event.target.value)} className={inputClass} />
          </Field>
          <Switch
            label="Show cookie notice"
            description="A small banner linking to your Cookie and Privacy policies. For EU/UK visitors, also enable Google's consent message in AdSense."
            checked={cookieBannerEnabled}
            onChange={setCookieBannerEnabled}
          />
        </div>
      </Card>

      <Card title="Legal details" description="Inserted into your Terms of Use and Privacy Policy.">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Legal owner name" htmlFor="legal-entity" hint="Your name or business name (optional)">
            <input id="legal-entity" value={legalEntity} onChange={(event) => setLegalEntity(event.target.value)} className={inputClass} />
          </Field>
          <Field label="Governing law / jurisdiction" htmlFor="jurisdiction" hint="e.g. India or Gujarat, India">
            <input id="jurisdiction" value={legalJurisdiction} onChange={(event) => setLegalJurisdiction(event.target.value)} className={inputClass} />
          </Field>
        </div>
      </Card>

      <Card title="Social profiles" description="Shown in the footer and used for structured data.">
        <div className="grid gap-5 md:grid-cols-2">
          {SOCIAL_FIELDS.map((field) => (
            <Field key={field.key} label={field.label} htmlFor={`social-${field.key}`}>
              <input
                id={`social-${field.key}`}
                type="url"
                placeholder="https://"
                value={social[field.key] ?? ""}
                onChange={(event) => setSocial((current) => ({ ...current, [field.key]: event.target.value }))}
                className={inputClass}
              />
            </Field>
          ))}
        </div>
      </Card>

      <SaveBar pending={pending} onSave={save} />
    </div>
  );
}

export function AdsSettingsForm({ settings, siteHost }: { settings: SiteSettings; siteHost: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [enabled, setEnabled] = useState(settings.adsense_enabled);
  const [clientId, setClientId] = useState(settings.adsense_client_id ?? "");
  const [autoAds, setAutoAds] = useState(settings.adsense_auto_ads);
  const [slots, setSlots] = useState<Partial<Record<AdPlacement, string>>>(settings.ad_slots ?? {});
  const [adsTxt, setAdsTxt] = useState(settings.ads_txt ?? "");

  const publisherId = clientId.replace(/^ca-/, "");
  const suggestedAdsTxt = publisherId ? `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0` : "";

  function save() {
    startTransition(async () => {
      const result = await saveAdsSettings({
        enabled,
        clientId,
        autoAds,
        adsTxt,
        slots: Object.fromEntries(AD_PLACEMENTS.map((placement) => [placement.key, slots[placement.key] ?? ""])),
      });
      if (result.ok) {
        toast.success(result.message ?? "Saved");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-5">
        <Card title="Google AdSense account">
          <div className="space-y-5">
            <Field
              label="Publisher ID"
              htmlFor="client-id"
              hint="Find it in AdSense → Account → Settings → Account information. Adding it also inserts the site-verification meta tag."
            >
              <input
                id="client-id"
                value={clientId}
                onChange={(event) => setClientId(event.target.value.trim())}
                placeholder="ca-pub-0000000000000000"
                className={cn(inputClass, "font-mono")}
              />
            </Field>
            <Switch
              label="Serve ads"
              description="Loads the AdSense script on public pages (never on the admin panel). Turn this on after your site is approved — or while applying if AdSense asks for the code snippet."
              checked={enabled}
              onChange={setEnabled}
            />
            <Switch
              label="Auto ads are enabled in my AdSense dashboard"
              description="Auto ads are configured inside AdSense. When on, you can leave the slot IDs below empty."
              checked={autoAds}
              onChange={setAutoAds}
            />
          </div>
        </Card>

        <Card title="Manual ad units" description="Create display ad units in AdSense → Ads → By ad unit, then paste each numeric slot ID.">
          <div className="grid gap-4 md:grid-cols-2">
            {AD_PLACEMENTS.map((placement) => (
              <Field key={placement.key} label={placement.label} htmlFor={`slot-${placement.key}`}>
                <input
                  id={`slot-${placement.key}`}
                  inputMode="numeric"
                  value={slots[placement.key] ?? ""}
                  onChange={(event) =>
                    setSlots((current) => ({ ...current, [placement.key]: event.target.value.replace(/\D/g, "") }))
                  }
                  placeholder="e.g. 1234567890"
                  className={cn(inputClass, "font-mono")}
                />
              </Field>
            ))}
          </div>
        </Card>

        <Card
          title="ads.txt"
          description={`Served at ${siteHost}/ads.txt. Leave empty to use the standard Google line automatically.`}
          actions={
            suggestedAdsTxt ? (
              <button type="button" className={buttonClass.ghost} onClick={() => setAdsTxt(suggestedAdsTxt)}>
                Use Google line
              </button>
            ) : null
          }
        >
          <textarea
            value={adsTxt}
            onChange={(event) => setAdsTxt(event.target.value)}
            rows={4}
            placeholder={suggestedAdsTxt || "google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0"}
            className={cn(inputClass, "font-mono text-[13px]")}
          />
          <a href="/ads.txt" target="_blank" className="mt-2 inline-flex items-center gap-1 text-[13px] text-link hover:underline">
            Open /ads.txt <ExternalLink className="size-3" />
          </a>
        </Card>

        <SaveBar pending={pending} onSave={save} label="Save ad settings" />
      </div>

      <div className="space-y-5 xl:sticky xl:top-6 xl:self-start">
        <Card title="Approval checklist">
          <ul className="space-y-2.5 text-[13px] leading-5 text-fg-2">
            {[
              "Use your own domain (not onrender.com) and submit the root URL in AdSense.",
              "Publish plenty of original content: 30+ wallpapers with unique descriptions and 5+ guides.",
              "Keep Privacy Policy, Terms, Cookie Policy, About, Contact and DMCA pages linked in the footer (already built in).",
              "Only publish wallpapers you created, generated or have a license for.",
              "In AdSense → Privacy & messaging, create a GDPR consent message for EEA/UK visitors.",
              "Verify /ads.txt shows your publisher ID after approval.",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                {item}
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Stay policy-safe">
          <ul className="space-y-2.5 text-[13px] leading-5 text-fg-2">
            {[
              "Never click your own ads or ask others to click them.",
              "Don’t place ads right next to Download buttons — our slots keep safe spacing.",
              "Ads never load on admin, login, error or thank-you screens.",
              "Remove wallpapers quickly when you receive a valid copyright notice.",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <ShieldAlert className="mt-0.5 size-4 shrink-0 text-warning" />
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

export function ProfileForm({ displayName, email }: { displayName: string | null; email: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState(displayName ?? "");

  return (
    <div className="space-y-4">
      <Field label="Email" htmlFor="profile-email">
        <input id="profile-email" value={email} disabled className={inputClass} />
      </Field>
      <Field label="Display name" htmlFor="profile-name">
        <input id="profile-name" value={name} onChange={(event) => setName(event.target.value)} className={inputClass} />
      </Field>
      <button
        type="button"
        disabled={pending}
        className={buttonClass.primary}
        onClick={() =>
          startTransition(async () => {
            const result = await updateDisplayName(name);
            if (result.ok) {
              toast.success(result.message ?? "Saved");
              router.refresh();
            } else toast.error(result.error);
          })
        }
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : null}
        Save profile
      </button>
    </div>
  );
}
