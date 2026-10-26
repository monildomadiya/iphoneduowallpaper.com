import Link from "next/link";

export function ScreenDownloadGuide() {
  return (
    <section className="container-apple mt-20" aria-labelledby="screen-download-heading">
      <h2 id="screen-download-heading" className="headline-section">Cover or inner? Choose the file for your screen.</h2>
      <p className="mt-4 max-w-3xl text-[17px] leading-7 text-fg-2">Start with the screen shape, then check the source detail. A prepared export can fit the display while still needing enlargement from a smaller original.</p>
      <ul className="mt-7 grid gap-5 md:grid-cols-3">
        <li className="rounded-[24px] border border-line bg-surface p-6">
          <h3 className="text-xl font-semibold">Cover / outer display</h3>
          <p className="mt-2 font-semibold tabular-nums">1398 × 2034 · portrait</p>
          <p className="mt-3 text-[15px] leading-6 text-fg-2">For the closed phone. Watch the sides of a wide scene: the taller crop can cut off people, cars or scenery near the edges.</p>
          <Link href="/devices/iphone-duo-outer-display" className="link-apple mt-4 inline-block">Browse cover-screen wallpapers</Link>
        </li>
        <li className="rounded-[24px] border border-line bg-surface p-6">
          <h3 className="text-xl font-semibold">Inner display</h3>
          <p className="mt-2 font-semibold tabular-nums">2670 × 1878 · landscape export</p>
          <p className="mt-3 text-[15px] leading-6 text-fg-2">For the wider open layout. Check the horizon and centre of the preview, and leave room around the subject before making the crop.</p>
          <Link href="/devices/iphone-duo-inner-display" className="link-apple mt-4 inline-block">Browse inner-screen wallpapers</Link>
        </li>
        <li className="rounded-[24px] border border-line bg-surface p-6">
          <h3 className="text-xl font-semibold">Original or enlarged master?</h3>
          <p className="mt-2 font-semibold">Read the file details</p>
          <p className="mt-3 text-[15px] leading-6 text-fg-2">More output pixels do not always mean more original detail. Check source dimensions and any enlargement label before choosing an available master or screen pair.</p>
          <Link href="/wallpaper-help" className="link-apple mt-4 inline-block">Compare cropping and image quality</Link>
        </li>
      </ul>
      <p className="mt-5 text-sm leading-6 text-fg-2">Apple lists the inner panel as 1878 × 2670; our landscape export uses those dimensions in the opposite orientation. <a href="https://www.apple.com/iphone-duo/specs/" className="link-apple">Apple display specifications</a>. Export sizes describe the files; confirm the final framing in your phone&apos;s wallpaper preview.</p>
    </section>
  );
}
