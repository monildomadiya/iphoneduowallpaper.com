import { ResourceLinks } from "@/components/site/resource-links";
import { ICON_GUIDE, BLUR_GUIDE, SETUP_GUIDE } from "@/lib/guide-links";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, JsonLd, PageHeader } from "@/components/ui/primitives";
import { ReadabilityLab } from "@/components/wallpaper/readability-lab";
import { buildMetadata, webApplicationJsonLd } from "@/lib/seo";

const TITLE = "Wallpaper Readability Checker — Clock & Icon Contrast";
const DESCRIPTION = "Test light and dark clock text on your wallpaper, compare local contrast, adjust background dimming and export a cleaner background. Your photo stays local.";

export const generateMetadata = (): Promise<Metadata> => buildMetadata({ title: TITLE, description: DESCRIPTION, path: "/wallpaper-readability" });

export default function WallpaperReadabilityPage() {
  return <>
    <JsonLd data={webApplicationJsonLd({ name: "Wallpaper Readability Lab", description: DESCRIPTION, path: "/wallpaper-readability" })} />
    <div className="container-apple pt-6"><Breadcrumbs items={[{ name: "Readability lab", path: "/wallpaper-readability" }]} /></div>
    <PageHeader eyebrow="A practical wallpaper workshop" title="Beautiful wallpaper. A clock you can actually read." description="Check what happens behind the text, compare two colour choices, and make a quieter background without losing your favourite picture." />
    <div className="container-apple">
      <nav aria-label="On this page" className="mb-8 flex flex-wrap gap-x-5 gap-y-3 text-sm">
        <a href="#readability-lab" className="link-apple">Try the lab</a><a href="#read-results" className="link-apple">Read your result</a><a href="#worked-examples" className="link-apple">Three examples</a><a href="#method" className="link-apple">How it works</a>
      </nav>
      <ReadabilityLab />
      <article className="prose-apple mt-14 max-w-3xl pb-12">
        <h2 id="read-results">Resolution solves sharpness. Contrast solves a different problem.</h2>
        <p>A crisp photograph can still make a poor Lock Screen. A white cloud behind white clock digits can hide part of the time, while a much smaller dark photograph can leave the same digits easy to read. Changing a file&apos;s resolution does not fix that overlap. Start by looking at the patch directly behind the clock, rather than judging the whole photograph as light or dark.</p>
        <p>The lab draws a blue box around the area it checks. It compares light and dark text against each sampled background pixel, then reports how much of that area meets your chosen contrast reference. Switch between the clock and app-label regions: an image with a quiet sky at the top can become much busier around the middle, where your icons sit.</p>
        <h3>A result you can act on</h3>
        <ol>
          <li><strong>Compare both text colours before editing the image.</strong> If dark text covers much more of the selected area, try a darker clock colour on your phone. The lab&apos;s dark option uses a deep blue-black, not a text shadow.</li>
          <li><strong>Inspect the weakest part.</strong> Coverage describes the whole box; the lowest sampled contrast points out a problem a high average can hide. A small bright spot beneath one digit can still matter.</li>
          <li><strong>Adjust dimming a little at a time.</strong> With light text selected, increase the slider in small steps. Stop when the background remains recognisable and the digits stand apart. Dimming can make dark text harder to read, so compare again after each change.</li>
          <li><strong>Check the actual screen.</strong> Export the background, apply it, and look at the time, widgets and app labels with your usual brightness and text settings. The blue box and example text are guides and are not included in the download.</li>
        </ol>
        <h2 id="worked-examples">Three situations, three different fixes</h2>
        <h3>1. A pale sky behind the clock</h3>
        <p>A mountain scene may have a dark foreground but a very pale sky. The whole-image impression is misleading if the clock sits in that sky. In the lab, select the clock region and compare dark text first. If you prefer a light clock, try a darker crop or a modest dimming adjustment. Keep the bright sky visible elsewhere rather than flattening the entire image just to rescue one small region.</p>
        <h3>2. A dark scene with one bright lantern</h3>
        <p>White text against a perfectly black patch has a 21:1 contrast ratio. A lantern, moon or neon sign can interrupt that dark patch, even when almost everything else stays black. A high coverage result therefore does not guarantee that every digit remains readable. Move the subject away from the clock in the <Link href="/maker">crop maker</Link>, then bring the exported crop back here. Repositioning one highlight can preserve more of the photograph than strong global dimming.</p>
        <h3>3. A pattern that alternates between light and dark</h3>
        <p>Imagine equal-sized black and white squares under your clock. White text works over the black squares and disappears over the white ones; dark text has the opposite problem. An average colour would describe a grey that is not actually behind any letter. That is why this tool checks individual background samples. For a busy pattern, try a quieter companion wallpaper for the Home Screen, or use an intentional blur or simpler background where the labels sit.</p>
        <h2>Make the Lock Screen and Home Screen do different jobs</h2>
        <p>Your Lock Screen can keep the interesting subject, while your Home Screen uses a calmer crop or a dimmer companion. Compare small labels separately: a bold clock can tolerate a background that makes thin app names difficult to follow. After adding a wallpaper on iPhone, Apple provides a separate Home Screen customisation option. Its current <a href="https://support.apple.com/en-us/102638">wallpaper instructions</a> explain where that option appears.</p>
        <p>For a useful before-and-after check, keep the phone brightness constant, use the same text colour, and compare the same icon labels. Change one thing at a time. Otherwise an improvement caused by a different clock style can look like an improvement to the background itself.</p>
        <h2 id="method">What the numbers mean, and what they leave out</h2>
        <p>Each preview uses a centred crop in the chosen export shape. The tool composites transparent images over white, applies your black dimming layer, then reads the background before drawing example text. It converts sRGB colours to relative luminance and compares the brighter and darker values using <code>(lighter + 0.05) / (darker + 0.05)</code>. Results are computed from the preview pixels, so resizing can smooth small details that remain in the full-resolution export.</p>
        <p>The 3:1 and 4.5:1 references come from the <a href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html">W3C explanation of text contrast</a>, for large and ordinary text respectively. They are useful comparison points here. This tool does not certify an iOS interface: the sampled box includes space between letters, and the preview does not reproduce your phone&apos;s font, shadows, widgets, spatial effects or automatic colour adjustments.</p>
        <p>The suggested colour favours the higher coverage; a tie uses the contrast near the weakest tenth of background samples. It does not identify faces or find a safe place for every icon. If both colours struggle, use a less detailed region or a different companion image. Changing the output dimensions cannot create missing source detail; the <Link href="/wallpaper-help">fit calculator</Link> explains cropping and enlargement.</p>
        <h2>Your photo, your device</h2>
        <p>Choosing a photo makes it available to this tool inside your browser. The tool has no photo-upload request and does not store the image in your account. Reloading the page resets the selection. The export is a PNG of the centred crop and dimming you chose; it contains no clock, labels or sample border. On a phone, a downloaded file may appear in Files before you save it to Photos.</p>
        <p>You can try every control with the built-in gradient first. For your own image, use a JPG, PNG, WebP or AVIF file under 15 MB and at most 40 megapixels. HEIC files need to be exported to a supported format. If the picture is already too tightly framed, start with a wider original rather than repeatedly cropping an earlier export.</p>
        <p><strong>Next step:</strong> find a quieter composition in <Link href="/categories/dark">Dark &amp; AMOLED</Link> or <Link href="/categories/minimal">Minimal</Link>, make an exact crop in the <Link href="/maker">wallpaper maker</Link>, or use the <Link href="/wallpaper-help">download troubleshooting guide</Link> if the saved file looks different from the preview.</p>
        <p className="text-sm text-fg-2">Method and linked references reviewed <time dateTime="2026-10-23">23 October 2026</time>. Examples explain the calculations; phone-specific results depend on the settings and image you use.</p>
      </article>
      <ResourceLinks title="Use your finished background" links={[ICON_GUIDE, SETUP_GUIDE, BLUR_GUIDE]} />
    </div>
  </>;
}
