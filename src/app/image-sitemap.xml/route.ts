import { getWallpaperSitemapEntries } from "@/lib/data/wallpapers";
import { absoluteUrl, imageUrl } from "@/lib/utils";
export const dynamic = "force-static";

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Every wallpaper page with the full-size files it offers: the 4K master and the native iPhone Duo
 * outer and inner and iPhone 18 Pro Max crops. The page sitemap lists only the preview each page
 * renders; these are the files people want from Google Images, and the page is where they get them.
 */
export async function GET() {
  const wallpapers = await getWallpaperSitemapEntries();
  const urls = wallpapers.map((wallpaper) => {
    const files = wallpaper.variants?.files;
    const keys = files
      ? [files["4k"]?.key, files.outer?.key, files.inner?.key, files["pro-max"]?.key]
      : [wallpaper.original_key];
    const images = keys
      .filter((key): key is string => Boolean(key))
      .map((key) => `    <image:image><image:loc>${escape(imageUrl(key))}</image:loc></image:image>`)
      .join("\n");
    return `  <url>\n    <loc>${escape(absoluteUrl(`/wallpapers/${wallpaper.slug}`))}</loc>\n${images}\n  </url>`;
  });

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join("\n")}
</urlset>
`;
  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
