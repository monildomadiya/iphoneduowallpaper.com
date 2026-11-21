"use client";

import {
  CheckCircle2,
  CircleAlert,
  ExternalLink,
  Eye,
  Info,
  Loader2,
  ShieldAlert,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { saveAdsSettings, saveGeneralSettings, updateDisplayName } from "@/app/admin/actions/settings";
import { placementConfig, placementsForPage } from "@/lib/ads";
import {
  AD_FORMATS,
  AD_PAGES,
  AD_PLACEMENTS,
  type AdFormat,
  type AdPage,
  type AdPlacement,
  type AdPlacementConfig,
  type SiteSettings,
  type SocialLinks,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { Switch } from "./client";
import { Badge, Card, Field, buttonClass, inputClass, selectClass } from "./ui";

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

const FREQUENCY_HINTS = [
  { value: "", label: "Let Google decide" },
  { value: "60s", label: "Fewest — one per 60s of reading" },
  { value: "45s", label: "Fewer — one per 45s" },
  { value: "30s", label: "Balanced — one per 30s" },
  { value: "15s", label: "Most — one per 15s" },
];

function PlacementRow({
  definition,
  config,
  onChange,
}: {
  definition: (typeof AD_PLACEMENTS)[number];
  config: AdPlacementConfig;
  onChange: (patch: Partial<AdPlacementConfig>) => void;
}) {
  const live = config.enabled && Boolean(config.slot);
  const format = AD_FORMATS.find((item) => item.key === config.format);

  return (
    <div className={cn("rounded-2xl border p-3.5 transition", live ? "border-success/40 bg-success/[0.04]" : "border-line")}>
      <Switch
        label={definition.label}
        description={definition.note}
        checked={config.enabled}
        onChange={(checked) => onChange({ enabled: checked })}
      />

      {config.enabled ? (
        <div className="mt-3.5 grid gap-3 border-t border-line pt-3.5 sm:grid-cols-2">
          <Field
            label="Ad unit ID"
            htmlFor={`slot-${definition.key}`}
            hint={config.slot ? undefined : "This spot stays empty until you paste a unit ID."}
          >
            <input
              id={`slot-${definition.key}`}
              inputMode="numeric"
              value={config.slot}
              onChange={(event) => onChange({ slot: event.target.value.replace(/\D/g, "") })}
              placeholder="e.g. 1234567890"
              className={cn(inputClass, "font-mono")}
            />
          </Field>

          <Field label="Unit type" htmlFor={`format-${definition.key}`} hint={format?.hint}>
            <select
              id={`format-${definition.key}`}
              value={config.format}
              onChange={(event) => onChange({ format: event.target.value as AdFormat })}
              className={selectClass}
            >
              {AD_FORMATS.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.label}
                </option>
              ))}
            </select>
          </Field>

          {config.format === "in_feed" ? (
            <Field
              label="Layout key"
              htmlFor={`layout-${definition.key}`}
              hint="AdSense prints this beside an in-feed unit. Without it the spot falls back to a plain banner."
              className="sm:col-span-2"
            >
              <input
                id={`layout-${definition.key}`}
                value={config.layout_key ?? ""}
                onChange={(event) => onChange({ layout_key: event.target.value.trim() })}
                placeholder="-6t+ed+2i-1n-4w"
                className={cn(inputClass, "font-mono")}
              />
            </Field>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function Note({ tone, children }: { tone: "warn" | "info" | "danger"; children: React.ReactNode }) {
  const Icon = tone === "info" ? Info : tone === "warn" ? TriangleAlert : CircleAlert;
  return (
    <p
      className={cn(
        "flex items-start gap-2 rounded-xl px-3 py-2.5 text-[13px] leading-5",
        tone === "info" && "bg-accent/8 text-fg-2",
        tone === "warn" && "bg-warning/10 text-fg-2",
        tone === "danger" && "bg-danger/10 text-fg-2",
      )}
    >
      <Icon
        className={cn(
          "mt-0.5 size-4 shrink-0",
          tone === "info" && "text-link",
          tone === "warn" && "text-warning",
          tone === "danger" && "text-danger",
        )}
      />
      <span>{children}</span>
    </p>
  );
}

export function AdsSettingsForm({ settings, siteHost }: { settings: SiteSettings; siteHost: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [enabled, setEnabled] = useState(settings.adsense_enabled);
  const [clientId, setClientId] = useState(settings.adsense_client_id ?? "");
  const [autoAds, setAutoAds] = useState(settings.adsense_auto_ads);
  const [frequencyHint, setFrequencyHint] = useState(settings.adsense_frequency_hint ?? "");
  const [lazyLoad, setLazyLoad] = useState(settings.ads_lazy_load);
  const [maxPerPage, setMaxPerPage] = useState(settings.ads_max_per_page);
  const [preview, setPreview] = useState(settings.ads_preview);
  const [adsTxt, setAdsTxt] = useState(settings.ads_txt ?? "");
  const [placements, setPlacements] = useState(
    () =>
      Object.fromEntries(
        AD_PLACEMENTS.map((definition) => [definition.key, placementConfig(settings, definition.key)]),
      ) as Record<AdPlacement, AdPlacementConfig>,
  );

  function update(key: AdPlacement, patch: Partial<AdPlacementConfig>) {
    setPlacements((current) => ({ ...current, [key]: { ...current[key], ...patch } }));
  }

  const liveByPage = Object.fromEntries(
    AD_PAGES.map((page) => [
      page.key,
      placementsForPage(page.key).filter((definition) => {
        const config = placements[definition.key];
        return config.enabled && Boolean(config.slot);
      }).length,
    ]),
  ) as Record<AdPage, number>;

  const totalLive = Object.values(liveByPage).reduce((sum, count) => sum + count, 0);
  const overLimit = AD_PAGES.filter((page) => liveByPage[page.key] > maxPerPage);
  const missingSlot = AD_PLACEMENTS.filter((definition) => {
    const config = placements[definition.key];
    return config.enabled && !config.slot;
  });
  const publisherId = clientId.replace(/^ca-/, "");
  const suggestedAdsTxt = publisherId ? `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0` : "";

  function save() {
    startTransition(async () => {
      const result = await saveAdsSettings({
        enabled,
        clientId,
        autoAds,
        frequencyHint,
        lazyLoad,
        maxPerPage,
        preview,
        adsTxt,
        placements,
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
              hint="AdSense → Account → Settings → Account information. Saving it also adds the site-verification meta tag."
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
              description="The master switch. Off means the AdSense script never loads, so no ad units and no Auto ads anywhere on the site."
              checked={enabled}
              onChange={setEnabled}
            />
            {enabled && !clientId ? <Note tone="danger">Add the publisher ID above, or ads cannot be saved as on.</Note> : null}
          </div>
        </Card>

        <Card
          title="Auto ads"
          description="Google picks the spots itself, including the sticky bar at the bottom of the screen and full-page ads between clicks."
        >
          <div className="space-y-5">
            <Switch
              label="Auto ads are switched on in my AdSense dashboard"
              description="Turn them on under AdSense → Ads → By site. They need no unit IDs and usually add the most on a phone."
              checked={autoAds}
              onChange={setAutoAds}
            />
            {autoAds ? (
              <>
                <Field
                  label="How many Auto ads"
                  htmlFor="frequency-hint"
                  hint="A hint, not a rule. Fewer ads often earn more per ad, and far fewer readers leave."
                >
                  <select
                    id="frequency-hint"
                    value={frequencyHint}
                    onChange={(event) => setFrequencyHint(event.target.value)}
                    className={selectClass}
                  >
                    {FREQUENCY_HINTS.map((hint) => (
                      <option key={hint.value || "auto"} value={hint.value}>
                        {hint.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Note tone="info">
                  Anchor and full-page ads are chosen in AdSense itself, not here. The placements below keep working
                  alongside Auto ads — Google leaves room for them.
                </Note>
              </>
            ) : null}
          </div>
        </Card>

        <Card title="How ads load" description="The settings that decide what a visit is worth and what it costs the page.">
          <div className="space-y-5">
            <Switch
              label="Load each ad as the reader reaches it"
              description="An ad nobody scrolls to still counts as shown, which drags the rates down across the account. This asks for each unit about one screen before it appears."
              checked={lazyLoad}
              onChange={setLazyLoad}
            />
            <Field
              label="Most ads on one page"
              htmlFor="max-per-page"
              hint="Saving is refused if any page below goes over this. Crowded pages are the usual reason a healthy account gets ad serving limited."
            >
              <input
                id="max-per-page"
                type="number"
                min={1}
                max={10}
                value={maxPerPage}
                onChange={(event) => setMaxPerPage(Math.min(10, Math.max(1, Number(event.target.value) || 1)))}
                className={cn(inputClass, "max-w-24 tabular-nums")}
              />
            </Field>
            <Switch
              label="Preview mode"
              description="Draws an outlined box at every spot instead of loading ads, so you can see the layout. Visitors see the boxes too."
              checked={preview}
              onChange={setPreview}
            />
            {preview ? (
              <Note tone="warn">
                Preview mode is on, so everyone sees outlined boxes and no ads are served. You can also add{" "}
                <code className="font-mono">?ads=preview</code> to any page instead, which only you see.
              </Note>
            ) : null}
          </div>
        </Card>

        {AD_PAGES.map((page) => {
          const count = liveByPage[page.key];
          const over = count > maxPerPage;
          return (
            <Card
              key={page.key}
              title={page.label}
              description={page.note}
              actions={
                <Badge tone={over ? "red" : count ? "green" : "gray"}>
                  {count} of {placementsForPage(page.key).length} live
                </Badge>
              }
            >
              <div className="space-y-3">
                {over ? (
                  <Note tone="danger">
                    {count} ads is over your limit of {maxPerPage}. Switch one off before saving.
                  </Note>
                ) : null}
                {placementsForPage(page.key).map((definition) => (
                  <PlacementRow
                    key={definition.key}
                    definition={definition}
                    config={placements[definition.key]}
                    onChange={(patch) => update(definition.key, patch)}
                  />
                ))}
              </div>
            </Card>
          );
        })}

        <Card
          title="ads.txt"
          description={`Served at ${siteHost}/ads.txt. Leave it empty to use the standard Google line.`}
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
        <Card title="Right now">
          <dl className="space-y-2.5 text-[13px]">
            {[
              { label: "Ads", value: enabled ? "Serving" : "Switched off", good: enabled },
              { label: "Auto ads", value: autoAds ? "On" : "Off", good: autoAds },
              { label: "Placements live", value: `${totalLive} of ${AD_PLACEMENTS.length}`, good: totalLive > 0 },
              { label: "Lazy loading", value: lazyLoad ? "On" : "Off", good: lazyLoad },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-3">
                <dt className="text-fg-2">{row.label}</dt>
                <dd className={cn("font-medium", row.good ? "text-success" : "text-fg-3")}>{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-4 space-y-2.5">
            {!enabled ? <Note tone="info">Nothing is loading while the master switch is off.</Note> : null}
            {enabled && !totalLive && !autoAds ? (
              <Note tone="warn">
                Ads are on but no spot has a unit ID and Auto ads are off, so no ad can appear. Paste a unit ID into at
                least one placement.
              </Note>
            ) : null}
            {missingSlot.length ? (
              <Note tone="warn">
                {missingSlot.length === 1
                  ? `“${missingSlot[0].label}” is switched on without a unit ID.`
                  : `${missingSlot.length} placements are switched on without a unit ID.`}
              </Note>
            ) : null}
            {overLimit.length ? (
              <Note tone="danger">{overLimit.map((page) => page.label).join(", ")} go over your per-page limit.</Note>
            ) : null}
            <a
              href="/?ads=preview"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-link hover:underline"
            >
              <Eye className="size-3.5" />
              See the spots on the home page
            </a>
          </div>
        </Card>

        <Card title="Where the money is">
          <ul className="space-y-2.5 text-[13px] leading-5 text-fg-2">
            {[
              "Almost every search visit lands on the home page, so its four spots matter more than everything else put together.",
              "A unit type that matches its surroundings earns more: in-article inside a guide, multiplex at the end of a page.",
              "Leave lazy loading on. Rates follow how often ads are actually seen, not how many are printed.",
              "Add a guide or two a month. More pages with real text means more pages Google will fill.",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-link" />
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Keeping the account healthy">
          <ul className="space-y-2.5 text-[13px] leading-5 text-fg-2">
            {[
              "Never click your own ads, and never ask anyone to. This is what ad serving limited is usually about.",
              "No ads sit beside the Download buttons, so a missed tap never costs you an invalid click.",
              "Ads never load on the admin panel, the login screen or error pages.",
              "In AdSense → Privacy and messaging, keep a consent message running for visitors in the EEA and UK.",
              "Act on copyright notices quickly and take the wallpaper down.",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <ShieldAlert className="mt-0.5 size-4 shrink-0 text-warning" />
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Still worth checking">
          <ul className="space-y-2.5 text-[13px] leading-5 text-fg-2">
            {[
              "Open /ads.txt and confirm it shows your publisher ID.",
              "Privacy Policy, Terms, Cookie Policy, About, Contact and DMCA stay linked in the footer.",
              "Only publish wallpapers you made, generated or hold a licence for.",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
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
