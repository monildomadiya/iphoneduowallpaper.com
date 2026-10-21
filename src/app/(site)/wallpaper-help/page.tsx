import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, PageHeader } from "@/components/ui/primitives";
import { FitCalculator } from "@/components/wallpaper/fit-calculator";
import { buildMetadata } from "@/lib/seo";

export const generateMetadata = (): Promise<Metadata> => buildMetadata({
  title: "Wallpaper Fit Calculator & Download Help",
  description: "Check wallpaper cropping and enlargement, choose the right download, and solve common image quality and iPhone wallpaper problems.",
  path: "/wallpaper-help",
});

const PROBLEMS = [
  ["The subject is cut off", "The image and screen have different proportions. Try the matching screen file first, then move the crop so the subject remains inside the visible area. A wider source helps only if it includes more useful space around the subject."],
  ["The wallpaper looks soft", "Check the downloaded file’s dimensions, rather than the gallery thumbnail. Heavy cropping leaves fewer source pixels. Try the original or a larger master; enlarging a small image cannot guarantee the original detail of a high-resolution source."],
  ["The Home Screen looks blurred", "Check the Home Screen customization options for a blur setting. A deliberate Home Screen blur is different from a low-resolution file. Apple’s setup guide explains how to customize the Home Screen separately."],
  ["I downloaded a ZIP, not a picture", "The screen-pair download is an archive containing separate images. Extract it in your file manager, then open the outer or inner image. A ZIP itself cannot be selected as a wallpaper."],
  ["The download is in Files, not Photos", "Open the downloaded image and look for Share → Save Image. If the option is absent, check that you opened the extracted picture rather than the ZIP. Then select the saved image in Photos when setting your wallpaper."],
  ["The download link no longer opens", "Return to the wallpaper page and request a fresh download. The site uses temporary download links; bookmarking a generated file URL can leave you with an expired link."],
];

export default function WallpaperHelpPage() {
  return <>
    <div className="container-apple pt-6"><Breadcrumbs items={[{ name: "Wallpaper help", path: "/wallpaper-help" }]} /></div>
    <PageHeader eyebrow="Wallpaper workshop" title="Choose a wallpaper that fits your screen." description="A practical fit calculator and download guide: understand what gets cropped, when an image needs enlarging, and which file to save." />
    <div className="container-apple">
      <nav aria-label="On this page" className="mb-8 flex flex-wrap gap-x-5 gap-y-3 text-sm">
        <a href="#fit-calculator" className="link-apple">Fit calculator</a><a href="#choose-file" className="link-apple">Choose a file</a><a href="#composition" className="link-apple">Composition</a><a href="#troubleshooting" className="link-apple">Fix a problem</a>
      </nav>
      <FitCalculator />
      <article className="prose-apple mt-14 max-w-3xl">
        <h2 id="choose-file">Start with the file, not the “4K” label</h2>
        <p>A wallpaper has two separate jobs: keep enough detail for your screen and put the subject where you can see it. Pixel dimensions help with the first; composition decides the second. A large landscape can still lose most of its scene on a narrow portrait display.</p>
        <ol>
          <li><strong>Open the artwork page.</strong> Use its download buttons rather than saving the gallery thumbnail or taking a screenshot. Check the listed dimensions and file size.</li>
          <li><strong>Choose the intended screen.</strong> Where available, the outer and inner files are different crops of the same artwork. The screen-pair ZIP contains both. A Duo screen pair is different from iOS’s “Set as Wallpaper Pair,” which refers to the Lock Screen and Home Screen.</li>
          <li><strong>Keep the original if you want to reframe it.</strong> A prepared crop is convenient, but it has already discarded part of the picture. The original or a master gives the <Link href="/maker">wallpaper maker</Link> more room to reposition the subject.</li>
          <li><strong>Preview before applying.</strong> Leave room for the clock and widgets, and check both the top and bottom edges. Your phone may apply extra zoom after a crop is exported.</li>
        </ol>
        <h3>Original, enlarged master and screen crop</h3>
        <p>The original is the source file supplied to the library. An enlarged master has more output pixels, but those extra pixels do not establish that more detail was captured. A screen crop has a specific shape and dimensions, so it can fit without stretching. These labels describe different properties; none alone guarantees that an image will look sharp.</p>
        <p>On this site, a 4K master uses 3840 pixels on its longer edge where that download is available. Read any enlargement disclosure beside the file. If a source is 1495 × 1052, changing its DPI or PPI tag to 300 does not turn it into a 3840-pixel image.</p>
        <h2 id="composition">Choose a composition for the way you use your phone</h2>
        <ul>
          <li><strong>For a busy Lock Screen:</strong> choose a quieter upper region so the clock has a consistent background. Test the actual clock color; a dark image with a bright light behind the digits can still be hard to read.</li>
          <li><strong>For a Home Screen full of icons:</strong> broad color areas are easier to work with than detailed lettering or faces behind app labels. Try a simpler companion image rather than forcing one crop to do every job.</li>
          <li><strong>For a wide inner display:</strong> look for a subject that survives the wider framing. Avoid placing essential text or a small face directly at the crop boundary. Inspect the preview instead of relying on the artwork title.</li>
          <li><strong>For a personal photo:</strong> leave space around people and pets before cropping. If a group spans the entire width, try another photo or accept borders rather than stretching everyone to fit.</li>
        </ul>
        <h3>A crop example you can reproduce</h3>
        <p>Try 1495 × 1052 in the calculator, with the Duo outer export size of 1398 × 2034. An edge-to-edge crop keeps roughly 723 × 1052 source pixels: about 52% of the image area is removed from the sides, then the remaining region is enlarged about 1.93×. Choosing the inner export size keeps almost all of that wide composition, but still requires enlargement. That is why “fits the screen” and “has enough detail” are separate questions.</p>
        <h2 id="troubleshooting">Fix the problem you can see</h2>
        {PROBLEMS.map(([title, body]) => <section key={title}><h3>{title}</h3><p>{body}</p></section>)}
        <h2>Save, apply and check once more</h2>
        <p>After saving your image, open Settings → Wallpaper → Add New Wallpaper and choose Photos. Adjust the framing before adding it. Apple provides separate options for the Lock Screen and Home Screen; menu names and available effects can vary with your iOS version and device.</p>
        <p>Our <Link href="/blog/how-to-set-wallpaper-on-iphone">setup guide</Link> covers the general workflow. For current controls and supported effects, use <a href="https://support.apple.com/en-us/102638">Apple’s wallpaper instructions</a> (reference checked 21 October 2026). The calculator above models image geometry, rather than reproducing every iOS effect.</p>
        <h2>Still need a different image?</h2>
        <p>Browse <Link href="/categories/dark">dark and AMOLED designs</Link> for subdued backgrounds, compare other <Link href="/categories">wallpaper categories</Link>, or <Link href="/maker">crop your own photo</Link>. If a file is broken, <Link href="/contact">contact us</Link> with the artwork’s page link, chosen download and the error you saw. Please do not send passwords or private photos.</p>
      </article>
    </div>
  </>;
}
