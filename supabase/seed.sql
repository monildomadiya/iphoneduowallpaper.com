-- =====================================================================
-- iPhoneDuoWallpaper.com — starter content
-- Run after migrations/0001_init.sql. Safe to re-run (skips existing slugs).
-- Everything here can be edited from the admin panel.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Site settings (Google Analytics 4; change or clear in Admin → Site settings)
-- ---------------------------------------------------------------------
update public.site_settings
set ga_measurement_id = 'G-5Q42KS8WZ0'
where id = 1 and ga_measurement_id is null;

-- ---------------------------------------------------------------------
-- Devices (orientation = how the screen is normally used)
-- ---------------------------------------------------------------------
insert into public.devices
  (name, slug, family, screen_label, width, height, diagonal_in, ppi, description, sort_order)
values
  ('iPhone Duo Outer Display', 'iphone-duo-outer-display', 'iPhone Duo', 'Outer display (folded)',
   1398, 2034, 5.4, 460,
   'The 5.4-inch outer display you use when iPhone Duo is folded. Portrait wallpapers at 1398 × 2034 pixels or larger look razor sharp here.',
   1),
  ('iPhone Duo Inner Display', 'iphone-duo-inner-display', 'iPhone Duo', 'Inner display (unfolded)',
   2670, 1878, 7.6, 430,
   'The 7.6-inch inner display that opens like a book into a wide, landscape canvas. Use wallpapers of at least 2670 × 1878 pixels, or a square image if you rotate often.',
   2),
  ('iPhone 18 Pro Max', 'iphone-18-pro-max', 'iPhone 18 Pro', null,
   1320, 2868, 6.9, 460,
   'The 6.9-inch display on iPhone 18 Pro Max. Wallpapers at 1320 × 2868 pixels match the screen pixel for pixel.',
   3),
  ('iPhone 18 Pro', 'iphone-18-pro', 'iPhone 18 Pro', null,
   1206, 2622, 6.3, 460,
   'The 6.3-inch display on iPhone 18 Pro. Wallpapers at 1206 × 2622 pixels match the screen pixel for pixel.',
   4)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------
insert into public.categories (name, slug, description, sort_order)
values
  ('Abstract', 'abstract',
   'Bold shapes, fluid forms and experimental art that turn your Lock Screen into a gallery piece.', 1),
  ('Gradients', 'gradients',
   'Smooth, color-rich gradients that keep icons readable and look stunning on OLED displays.', 2),
  ('Nature', 'nature',
   'Forests, flowers, oceans and skies — calm, natural scenery for everyday use.', 3),
  ('Space & Galaxy', 'space-galaxy',
   'Nebulae, planets and deep-space scenes inspired by the night sky.', 4),
  ('Minimal', 'minimal',
   'Clean, uncluttered designs with plenty of negative space for widgets and the clock.', 5),
  ('Dark & AMOLED', 'dark-amoled',
   'True-black and low-light wallpapers that look deep on OLED and are easy on the eyes at night.', 6),
  ('Architecture', 'architecture',
   'Modern buildings, geometry and city structures with strong lines and symmetry.', 7),
  ('Glass & 3D', 'glass-3d',
   'Translucent glass, soft 3D renders and depth-rich compositions that pair well with modern iOS design.', 8),
  ('Landscapes', 'landscapes',
   'Mountains, deserts and wide horizons — perfect for the wide inner display of iPhone Duo.', 9),
  ('Textures', 'textures',
   'Paper, fabric, stone and grain textures that add a tactile feel to your screen.', 10)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------
-- Collections
-- ---------------------------------------------------------------------
insert into public.collections (name, slug, description, is_featured, sort_order)
values
  ('Launch Day Picks', 'launch-day-picks',
   'Our editors'' favorite wallpapers to set up a brand-new iPhone Duo on day one.', true, 1),
  ('Night Sky Edition', 'night-sky-edition',
   'Deep blues, starlight and midnight tones inspired by the Night Sky finish.', true, 2),
  ('Star White Edition', 'star-white-edition',
   'Bright, airy and pearl-toned wallpapers inspired by the Star White finish.', true, 3),
  ('Made for Unfolding', 'made-for-unfolding',
   'Wide compositions designed to shine on the 7.6-inch inner display.', true, 4),
  ('Depth Effect Ready', 'depth-effect-ready',
   'Wallpapers with a clear subject and open sky, so the Lock Screen clock can tuck behind them.', false, 5)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------
-- Blog posts (helpful, original guides — review and edit before launch)
-- ---------------------------------------------------------------------
insert into public.posts (title, slug, excerpt, content, tags, status, seo_description)
values
(
  'iPhone Duo Wallpaper Sizes Explained: Outer vs. Inner Display',
  'iphone-duo-wallpaper-sizes-explained',
  'iPhone Duo has two very different screens. Here are the exact resolutions and simple rules for picking wallpapers that look sharp on both.',
  $md$
iPhone Duo is Apple's first foldable iPhone, and it has **two displays**: a 5.4-inch outer display you use when the phone is folded, and a 7.6-inch inner display that opens like a book. Because the two screens are used in different orientations, a wallpaper that looks perfect on one can look cropped on the other. This guide explains the numbers and gives you a few simple rules.

## Screen resolutions at a glance

| Display | Size | Resolution (as used) | Orientation |
| --- | --- | --- | --- |
| iPhone Duo — outer display | 5.4-inch | 1398 × 2034 px | Portrait (tall) |
| iPhone Duo — inner display | 7.6-inch | 2670 × 1878 px | Landscape (wide, unfolded) |
| iPhone 18 Pro Max | 6.9-inch | 1320 × 2868 px | Portrait |
| iPhone 18 Pro | 6.3-inch | 1206 × 2622 px | Portrait |

Spec sheets often list the inner display as 1878 × 2670. That is the same panel — when you unfold iPhone Duo, the hinge runs vertically and the screen sits wide, so we list it as 2670 × 1878.

## Rule 1: Match or exceed the resolution

A wallpaper should be **at least** as large as the screen in both directions. Smaller images are stretched and look soft. Every wallpaper on this site lists its full resolution, so you can check before you download.

## Rule 2: Pick the right shape for each screen

- **Outer display:** choose tall, portrait wallpapers. Anything at 1398 × 2034 or taller fits comfortably.
- **Inner display:** choose wide wallpapers, or a **square** image. A square image (for example 2670 × 2670) gives iOS room to reframe the picture if you rotate the unfolded phone.
- **Same wallpaper on both:** designs with a clear subject in the middle — a planet, a flower, a gradient orb — crop gracefully into both shapes.

## Rule 3: Mind the crease and the clock

On the inner display, the fold line runs down the center. Wallpapers with a strong vertical line exactly in the middle can make the crease more noticeable, so off-center subjects often look better. On the Lock Screen, leave some open space near the top for the clock and widgets.

## Rule 4: Prefer high-quality formats

JPEG and PNG work everywhere. PNG keeps flat colors and gradients free of banding; JPEG keeps photos small. Avoid screenshots of wallpapers — they lose quality and include interface elements.

## Quick checklist

1. Check the wallpaper's resolution on its page.
2. Use a portrait image for the outer display and a wide or square one for the inner display.
3. Keep the main subject away from the exact center line on the inner display.
4. Download the original file instead of saving a preview.

Browse our [iPhone Duo inner display wallpapers](/devices/iphone-duo-inner-display) and [outer display wallpapers](/devices/iphone-duo-outer-display) — every one is checked for size before it goes live.
$md$,
  array['iPhone Duo', 'guides', 'resolution'],
  'published',
  'Exact iPhone Duo outer and inner display resolutions, plus simple rules for choosing wallpapers that look sharp on both screens.'
),
(
  'How to Set a Wallpaper on iPhone: Lock Screen and Home Screen',
  'how-to-set-wallpaper-on-iphone',
  'Three quick ways to set any photo as your iPhone wallpaper — from the Lock Screen, the Settings app or the Photos app.',
  $md$
Setting a new wallpaper only takes a minute. The steps below have stayed consistent across recent versions of iOS, so they work on iPhone Duo as well as iPhone 18 Pro and older models. Menu names can change slightly between iOS releases.

Before you start, save the wallpaper to your **Photos** library. If you are not sure how, read our guide on [saving wallpapers to Photos](/blog/how-to-save-wallpapers-to-iphone-photos).

## Method 1: From the Lock Screen

1. Wake your iPhone and unlock it with Face ID or your passcode, but stay on the Lock Screen.
2. Touch and hold an empty area of the Lock Screen until the wallpaper gallery appears.
3. Tap the **+** button, then tap **Photos**.
4. Choose your wallpaper. Pinch to zoom and drag to reposition it.
5. Tap **Add**, then choose **Set as Wallpaper Pair** to use it on both the Lock Screen and Home Screen, or **Customize Home Screen** to pick something different for the Home Screen.

## Method 2: From the Settings app

1. Open **Settings** and tap **Wallpaper**.
2. Tap **Add New Wallpaper**, then tap **Photos**.
3. Select the image, adjust the framing and tap **Add**.
4. Choose **Set as Wallpaper Pair** or customize the Home Screen separately.

## Method 3: From the Photos app

1. Open **Photos** and find the wallpaper.
2. Tap the **Share** button.
3. Scroll down and tap **Use as Wallpaper**.
4. Adjust the framing and tap **Add**.

## Tips for the best result

- **Depth effect:** wallpapers with a clear subject and open space at the top let the clock sit behind the subject.
- **Readability:** busy images can make icons hard to read. Try enabling the blur option for the Home Screen.
- **Perspective zoom:** turn it off if the wallpaper looks slightly zoomed in.
- **iPhone Duo:** set up the outer display while the phone is folded and the inner display while it is unfolded, so each screen gets a wallpaper that fits its shape.

Looking for something new? Explore our [latest wallpapers](/wallpapers) or browse by [category](/categories).
$md$,
  array['how-to', 'iOS', 'guides'],
  'published',
  'Step-by-step instructions to set a wallpaper on iPhone from the Lock Screen, Settings or Photos app, with tips for depth effect and readability.'
),
(
  'How to Save Wallpapers to Your iPhone Photos',
  'how-to-save-wallpapers-to-iphone-photos',
  'Downloaded a wallpaper but can''t find it in Photos? Here is exactly where it goes and how to move it in a few taps.',
  $md$
When you download a file in Safari, iOS saves it to the **Files** app — not to Photos. That confuses a lot of people. Here are two easy ways to get a full-resolution wallpaper from this site into your Photos library.

## Option 1: Download, then save from Files

1. Open the wallpaper page in Safari and tap **Download**.
2. When Safari asks, confirm the download. The file is saved to **Files → Downloads**.
3. Open the **Files** app, go to **Downloads** and tap the image.
4. Tap the **Share** button and choose **Save Image**.

The wallpaper is now in Photos at its original resolution.

## Option 2: Open full size and save directly

1. On the wallpaper page, tap **View full size**. The original image opens in a new tab.
2. Touch and hold the image.
3. Tap **Save to Photos** (on some versions this is labeled **Add to Photos**).

## Common questions

**Why does my wallpaper look blurry?**
You may have saved the small preview image or taken a screenshot. Always use Download or View full size to get the original file.

**Where did my download go?**
Check **Files → Downloads**, or tap the downloads icon in Safari's address bar to see recent downloads.

**Do I need an app?**
No. Everything works in Safari and the built-in Files and Photos apps.

**Can I use these wallpapers commercially?**
Wallpapers are provided for personal use on your own devices. Please read our [Terms of Use](/terms) for details.

Ready to set it up? Follow our guide on [how to set a wallpaper on iPhone](/blog/how-to-set-wallpaper-on-iphone).
$md$,
  array['how-to', 'Safari', 'guides'],
  'published',
  'Learn where Safari downloads go on iPhone and two quick ways to save full-resolution wallpapers to your Photos library.'
)
on conflict (slug) do nothing;
