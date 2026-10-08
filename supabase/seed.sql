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

-- ---------------------------------------------------------------------
-- More guides (October 2026): troubleshooting, Lock Screen and design
-- topics, plus one guide per category. Internal links point at the
-- categories and wallpapers that existed when they were written.
-- ---------------------------------------------------------------------
insert into public.posts (title, slug, excerpt, content, tags, status, seo_title, seo_description)
values
(
  'Why Your iPhone Wallpaper Looks Blurry or Zoomed In (and How to Fix It)',
  'why-is-my-iphone-wallpaper-blurry',
  'A sharp image can still end up soft or oddly cropped on your Lock Screen. These are the nine usual causes, in the order worth checking, with the fix for each.',
  $md$
You found a wallpaper you love, set it, and… it looks worse than it did on the website. Soft edges, blocky gradients, or a picture that seems zoomed in too far. Almost every case comes down to one of nine causes. Work through them in order — the first few account for most problems.

## 1. The image is smaller than your screen

iOS always fills the whole display. If a picture has fewer pixels than the screen, iOS enlarges it, and enlarged pixels look soft. These are the sizes a wallpaper needs to match:

| Screen | Pixels needed |
| --- | --- |
| iPhone Duo outer display | 1398 × 2034 |
| iPhone Duo inner display | 2670 × 1878 |
| iPhone 18 Pro Max | 1320 × 2868 |
| iPhone 18 Pro | 1206 × 2622 |

**Fix:** check the resolution before you download. Every wallpaper page on this site lists the exact pixel size and a screen-by-screen fit check, so you can see in advance whether an image will be pixel-perfect, slightly soft or heavily cropped on your phone. For the reasoning behind the numbers, read [what wallpaper resolution really means on iPhone](/blog/iphone-wallpaper-resolution-4k-retina-ppi).

## 2. The shape doesn't match, so iOS crops and enlarges

A wide (landscape) picture on a tall (portrait) screen has to be cut down to a narrow vertical strip. iOS keeps the full height and throws away the sides. If you then pinch to zoom in on a detail, you're enlarging an already small slice of the image.

**Fix:** match the shape to the screen. Portrait images suit the iPhone Duo outer display and iPhone 18 Pro models; wide images suit the unfolded inner display. If you love a landscape image, look for one with the subject near the middle, so the crop keeps what matters.

## 3. Perspective Zoom is on

Perspective Zoom moves the wallpaper slightly as you tilt the phone. To have room to move, iOS enlarges the image a little — enough to soften a picture that was only just big enough, and to push its edges off-screen.

**Fix:** touch and hold the Lock Screen, tap **Customize**, choose the Lock Screen, then tap the **•••** button and turn **Perspective Zoom** off. The option only appears for some images, and menu names can vary slightly between iOS versions.

## 4. You saved a preview or a screenshot

Website previews are usually compressed and scaled down so pages load quickly. A screenshot is even worse: it captures the screen at screen size, including any compression already applied, and sometimes parts of the interface as well.

**Fix:** always use the **Download** button or the **View full size** link to get the original file. On iPhone, Safari saves downloads to **Files → Downloads**; our guide on [saving wallpapers to Photos](/blog/how-to-save-wallpapers-to-iphone-photos) shows how to move the image across in two taps.

## 5. A messaging app compressed it

Many chat apps shrink photos to save mobile data. Send a wallpaper to yourself through one of them and you may receive a much smaller, more compressed copy than the one you started with.

**Fix:** use AirDrop, iCloud Drive or a direct download instead. If you have to use a chat app, look for an "HD" or "original quality" option, or send the image as a document or file rather than as a photo. In Messages, make sure **Low Quality Image Mode** is off in Settings → Messages.

## 6. iCloud Photos is showing an optimized copy

With **Optimize iPhone Storage** turned on, your iPhone keeps smaller versions of your photos and fetches the full original from iCloud when it's needed. If you set a wallpaper before the original has finished downloading — or while you're offline — you can end up with the lighter copy.

**Fix:** open the image in Photos and give it a moment to load fully before setting it as your wallpaper. You can review the setting under Settings → [your name] → iCloud → Photos.

## 7. You zoomed in while framing

Pinch-zooming in the wallpaper editor is a crop. Zoom to 200% and you've halved the resolution in each direction, so even a large image can turn soft.

**Fix:** keep zoom to a minimum. If the subject looks too small at full size, the image probably wasn't composed for your screen's shape — a different wallpaper will look better than a heavily zoomed one.

## 8. The Home Screen blur or dimming is switched on

Sometimes the wallpaper looks fine on the Lock Screen but soft on the Home Screen. That's often deliberate: iOS can blur the Home Screen wallpaper to make icons easier to read, and Dark Mode can dim it.

**Fix:** in Settings → Wallpaper, tap **Customize** under the Home Screen preview and switch **Blur** off. For dimming, look for **Dark Appearance Dims Wallpaper** in Settings → Wallpaper on iOS versions that offer it.

## 9. Gradients show bands instead of a smooth blend

Smooth gradients — especially dark ones — sometimes show visible steps, known as banding. It happens when an image has been compressed heavily or saved with too few colors.

**Fix:** choose PNG files or high-quality JPEGs for gradient wallpapers, and avoid editing and re-saving them repeatedly. If you design your own, adding a touch of fine noise hides banding; our guide to [making your own iPhone Duo wallpaper](/blog/how-to-make-your-own-iphone-duo-wallpaper) covers the export settings.

## Quick checklist

1. Is the image at least as large as your screen in both directions?
2. Does its shape (portrait or landscape) match the screen you're using?
3. Is Perspective Zoom off?
4. Did you download the original file, not a preview or a screenshot?
5. Did it arrive through a chat app that compresses images?
6. Has the full-resolution original finished downloading from iCloud?
7. Did you avoid zooming in while framing?
8. Are the Home Screen blur and dimming set the way you want?

If you've checked everything and a wallpaper from this site still looks wrong, [tell us](/contact) which one and on which device, and we'll take a look.
$md$,
  array['troubleshooting', 'how-to', 'guides'],
  'published',
  'iPhone Wallpaper Blurry or Zoomed In? 9 Fixes That Work',
  'Wallpaper blurry, pixelated or zoomed in on iPhone? Check these nine causes, from Perspective Zoom to iCloud storage and chat-app compression, and fix each one.'
),
(
  'AMOLED Wallpapers on iPhone: Do True-Black Backgrounds Save Battery?',
  'amoled-wallpapers-iphone-battery',
  'Black wallpapers are often sold as a battery hack. Here''s what OLED screens actually do with black pixels, how much a wallpaper can save, and where the real savings are.',
  $md$
Search for "AMOLED wallpaper" and you'll find claims that a black background can add hours to your battery life. The truth is more modest — but there is a real effect, and a couple of genuinely useful tricks. Here's how it works.

## How OLED screens draw black

Most iPhones since the iPhone X — and every current Pro model — use OLED displays. (AMOLED is a common name for the same family of screen technology.) In an OLED panel, every pixel makes its own light. To show black, a pixel simply switches off. It uses almost no power and gives off no light at all, which is why blacks look infinitely deep and blend into the phone's frame.

LCD screens work differently. A backlight shines through the whole panel all the time, and black pixels only block it. On an LCD, a black wallpaper saves nothing.

So on an OLED iPhone, a true-black wallpaper — pure #000000, not dark grey — really does draw less power than a bright one while it's on screen.

## So how much battery does it save?

That depends on three things:

- **How long the wallpaper is actually visible.** You see your wallpaper when you glance at the Lock Screen and swipe between Home Screen pages. Most screen time is spent inside apps, where the wallpaper is covered.
- **Brightness.** The brighter the screen, the more power each lit pixel uses, so the gap between black and white grows with brightness.
- **How much of the image is truly black.** A "dark" wallpaper full of deep blues and greys still lights most of its pixels.

The best public data comes from research on dark mode rather than wallpapers. A 2021 Purdue University study measured popular apps on OLED phones and found that switching from light to dark mode saved roughly 39–47% of display power at full brightness, but only around 3–9% at the 30–50% brightness most people use indoors. Your wallpaper fills far less of your screen time than apps do, so the realistic saving from a black wallpaper on its own is small: helpful at the margins, not a battery fix.

## Where a black wallpaper makes a bigger difference

### The Always-On display

On iPhone models with an Always-On display, the Lock Screen stays visible in a dimmed state whenever the phone is locked — potentially many hours a day. That makes the wallpaper matter much more. A mostly black wallpaper means far fewer lit pixels the entire time.

You can go further: open **Settings → Display & Brightness → Always On Display** and turn off **Show Wallpaper**. The clock and widgets stay visible on a black background. If you'd rather keep your wallpaper showing, a true-black design is the next best thing.

### Night-time use

At low brightness in a dark room, a bright wallpaper is harsh on the eyes and lights up the room every time you check the time. A black or near-black wallpaper is far more comfortable.

## True black vs. "dark"

Not every dark wallpaper is an AMOLED wallpaper. When a design is labeled AMOLED, the background should be genuinely black, with color reserved for the subject — a glowing orb, a neon line, a pair of eyes. Look for:

- **Large areas of pure black**, not charcoal or navy.
- **A small, bright subject.** It pops against the black and leaves room for the clock and widgets.
- **No grey haze.** Heavy compression can turn black into a blotchy dark grey, so download the original file rather than a preview.

Examples in our library include [Lunar Eclipse Glow](/wallpapers/lunar-eclipse-glow-dark-amoled-iphone-duo-wallpaper), [Neon Cosmic Arcs](/wallpapers/neon-cosmic-arcs-amoled-iphone-duo-wallpaper) and [Monochrome Smoke Flow](/wallpapers/monochrome-smoke-flow-duo-wallpaper). Many of the designs in our [iOS Inspired](/categories/ios-inspired-wallpapers) and [Anime 4K](/categories/anime-4k) categories are built on true black, too — see [what makes a wallpaper feel like iOS](/blog/ios-style-wallpapers-glass-gradients) and [how to pick anime art for a Lock Screen](/blog/anime-wallpapers-iphone-lock-screen).

## Black wallpapers and burn-in

A common worry is that a static black-and-neon wallpaper will burn into an OLED screen. Burn-in comes from bright, identical content shown in the same place for very long periods — at high brightness, day after day. Your wallpaper is covered by apps most of the time and changes whenever you switch Lock Screens, so it's an unlikely culprit, and Apple engineers its OLED displays to reduce the effects of burn-in. If you'd still rather be cautious, rotating between a few wallpapers — something [Photo Shuffle can do automatically](/blog/change-iphone-wallpaper-automatically) — removes the concern entirely.

## Settings that save more than your wallpaper

If battery life is the real goal, these make a bigger difference than any wallpaper:

1. **Auto-Brightness** (Settings → Accessibility → Display & Text Size). Brightness is the biggest single factor in how much power the screen uses.
2. **Dark Mode** (Settings → Display & Brightness). It darkens the apps you use for hours, not just your wallpaper.
3. **Always On Display settings.** Turn off Show Wallpaper, or switch the feature off when you don't need it.
4. **Low Power Mode** when you need to stretch a charge.
5. **Settings → Battery**, to see which apps actually use the most power.

## The bottom line

A true-black wallpaper on an OLED iPhone uses a little less power while it's on screen, and noticeably less on an Always-On display. It won't double your battery life. But it looks striking, it's easier on the eyes at night, and it pairs perfectly with Dark Mode — and if you like the look, that's reason enough.

Want a dark wallpaper that keeps your icons readable, too? See our guide to [Home Screen wallpapers that keep icons and widgets readable](/blog/home-screen-wallpaper-readable-icons).
$md$,
  array['AMOLED', 'battery', 'guides'],
  'published',
  'Do AMOLED Black Wallpapers Save iPhone Battery?',
  'Do true-black AMOLED wallpapers save battery on iPhone? How OLED pixels work, what the research shows, and the settings that matter more than your wallpaper.'
),
(
  'Lock Screen Depth Effect: How to Choose Wallpapers That Work',
  'iphone-lock-screen-depth-effect-wallpapers',
  'The depth effect lets a subject overlap the Lock Screen clock — when the wallpaper cooperates. Here''s what iOS looks for, why the option goes grey, and how to pick images that work.',
  $md$
The depth effect is one of the nicest Lock Screen touches on iPhone: a mountain peak, a person's head or a cat's ears rises in front of the clock, as if the time were printed inside the photo. When it works, even a simple picture feels layered. When it doesn't, the option is greyed out or the clock simply sits on top. Here's how to get it working.

## What the depth effect actually does

When you choose a photo for the Lock Screen, iOS analyzes it to separate the **subject** from the **background**. If it finds a clear subject in the right place, it draws the clock behind the subject and in front of everything else. Nothing about the image itself changes — iOS just layers it.

To check or toggle it: touch and hold the Lock Screen, tap **Customize**, choose the Lock Screen, then tap the **•••** button in the corner and look for **Depth Effect**.

## Why the depth effect is greyed out or not working

### 1. iOS can't find a clear subject

The feature works best with people, pets, landmarks and objects with clean edges against a simpler background. Abstract art, patterns, textures and busy scenes often give iOS nothing to separate.

### 2. The subject is in the wrong place

The subject has to reach up into the clock area — but not swallow it. If the subject sits low in the frame, there's nothing to overlap. If it would cover most of the digits, iOS won't hide the time. A good rule of thumb: the subject should overlap only the lower part of the clock.

**Fix:** in the editor, pinch and drag to move the image until the top of the subject just touches the bottom of the clock.

### 3. Widgets are in the way

On some iOS versions, adding Lock Screen widgets switches the depth effect off, because the widget row sits between the clock and the subject. If the option is unavailable, try removing the widgets under the clock and check again.

### 4. Perspective Zoom or framing is off

Heavy zooming, or Perspective Zoom enlarging the image, can push the subject out of position. Turn **Perspective Zoom** off in the same **•••** menu and reframe.

### 5. The wallpaper isn't a photo

Some wallpaper types — colors, gradients, emoji, weather and astronomy — don't support the depth effect at all. It applies to photos, including any image you've saved to your Photos library.

## What makes a great depth-effect wallpaper

Think of the Lock Screen as three layers: background, clock and subject. A wallpaper works when each layer has room.

- **Open space at the top.** Sky, a plain wall or a dark background gives the clock somewhere clean to sit.
- **One distinct subject.** A single mountain, tree, figure or building reads better than a crowd.
- **An interesting top edge.** Peaks, heads, ears, tree crowns and rooftops create a satisfying overlap. A flat-topped object doesn't.
- **Contrast between subject and background.** A dark silhouette against a bright sky, or a lit subject against black, is easy for iOS to separate.
- **Portrait orientation.** On a tall screen, a portrait image puts the subject where the clock is. Landscape images get cropped, and the subject can end up too low or too high.

Minimal landscapes are often ideal. Designs like [Lone Tree Reflection Under a Pastel Moon](/wallpapers/lone-tree-reflection-under-pastel-moon-iphone-duo-wallpaper) and [Minimal Snow Mountain and Moon](/wallpapers/minimal-snow-mountain-moon-landscape-duo-wallpaper) have exactly the open sky and clean silhouettes the effect needs. Browse the [Minimal category](/categories/minimal) for more, or read why [minimal wallpapers work so well on iPhone](/blog/minimal-iphone-wallpapers-guide).

## Depth effect on iPhone Duo

iPhone Duo's two displays have very different shapes. Set up each one while the phone is in that position — folded for the tall outer display, unfolded for the wide inner display. On the outer display, frame the subject just as you would on any iPhone. On the inner display, keep the subject away from the center, where the fold runs, and use a wide image so nothing important is cropped. Our guide to [iPhone Duo wallpaper sizes](/blog/iphone-duo-wallpaper-sizes-explained) has the exact dimensions.

## Newer Lock Screen effects

Recent iOS versions have added more ways to layer the Lock Screen, including a clock that can resize to fit around the subject and 3D "spatial scene" photos that shift subtly as you move the phone. They rely on the same thing as the depth effect: a clear subject with space around it. Choose wallpapers with that in mind and they'll keep working as iOS evolves.

## Step by step: set up a depth-effect wallpaper

1. Save the wallpaper to Photos ([here's how](/blog/how-to-save-wallpapers-to-iphone-photos)).
2. Touch and hold the Lock Screen, tap **+**, and choose **Photos**.
3. Pick the image. Pinch and drag until the top of the subject just overlaps the bottom of the clock.
4. Tap **•••** and make sure **Depth Effect** is checked.
5. If the option is unavailable, remove the widgets under the clock and try again.
6. Tap **Add**, then choose whether to set it as a wallpaper pair.

New to Lock Screen customization? Start with [how to set a wallpaper on iPhone](/blog/how-to-set-wallpaper-on-iphone).
$md$,
  array['Lock Screen', 'depth effect', 'guides'],
  'published',
  'iPhone Depth Effect Not Working? Choose the Right Wallpaper',
  'Why the iPhone Lock Screen depth effect is greyed out or not working, what iOS looks for in a wallpaper, and how to frame a photo so it overlaps the clock.'
),
(
  'How to Make Your Own iPhone Duo Wallpaper: Sizes, Safe Zones and Export Settings',
  'how-to-make-your-own-iphone-duo-wallpaper',
  'Designing for two very different screens is easier with the right canvas. Here are the exact sizes, where to keep important details, and export settings that avoid blur and banding.',
  $md$
Designing your own wallpaper is the surest way to get exactly what you want — your photo, your colors, your layout. iPhone Duo makes it a little more interesting, because one phone has two screens with very different shapes. This guide gives you the numbers, the layout rules and the export settings to get a sharp result on the first try.

## Step 1: Choose your canvas size

Start with a canvas that matches the screen exactly, or one that's larger with the same shape.

| Target | Canvas size | Shape |
| --- | --- | --- |
| iPhone Duo outer display | 1398 × 2034 px | Portrait |
| iPhone Duo inner display | 2670 × 1878 px | Landscape |
| iPhone 18 Pro Max | 1320 × 2868 px | Tall portrait |
| iPhone 18 Pro | 1206 × 2622 px | Tall portrait |
| One file for all of the above | 2868 × 2868 px | Square |

### The square trick

If you want a single design for every screen, make it **2868 × 2868 pixels**. From a square that size, iOS can cut a full-resolution tall crop for iPhone 18 Pro Max, a wide crop for the Duo inner display and a portrait crop for the outer display — all without enlarging anything.

The catch is that each screen sees a different part of the square. The area every screen shares is a central rectangle roughly 1,300 pixels wide and 2,000 pixels tall. Keep faces, text and the main subject inside it, and treat everything outside as background that may or may not be visible.

## Step 2: Respect the safe zones

Parts of every screen are covered by system elements. Plan for them before you place anything.

**On the Lock Screen:**

- **The top area.** The date, clock and optional widgets take up roughly the top quarter to third of a portrait screen. Keep faces, text and key details out of it — or place the top edge of your subject there on purpose to use the [depth effect](/blog/iphone-lock-screen-depth-effect-wallpapers).
- **The very top edge.** The Dynamic Island and status bar live here.
- **The bottom corners.** The flashlight and camera buttons.
- **The bottom center.** The home indicator, plus notifications that stack upward from the bottom.

**On the Home Screen:** the icon grid covers most of the screen and the dock covers the bottom. Wallpapers with detail everywhere make icons hard to read — see [Home Screen wallpapers that keep icons readable](/blog/home-screen-wallpaper-readable-icons).

**On the iPhone Duo inner display:** the fold runs down the vertical center. A strong line or a face placed exactly on it can make the crease more noticeable, so shift the main subject into the left or right third.

## Step 3: Pick a tool

You don't need expensive software. Any of these will do the job:

- **Canva** (web, iPhone and iPad): choose **Custom size**, enter the pixel dimensions and start designing. A free plan is available.
- **Photopea** (web): a free, browser-based editor that works much like Photoshop, with layers, masks and gradient tools.
- **Figma** (web and desktop): excellent for clean vector shapes, gradients and minimal designs. A free plan is available.
- **Procreate** (iPad): ideal for painting and illustration, with custom canvas sizes. One-time purchase.
- **Our [iPhone Duo Wallpaper Maker](/maker)** (any browser): to turn a photo you already have into both files at once, drag and zoom it in a live preview of each screen and download a 1398 × 2034 and a 2670 × 1878 copy. It runs on your device, so the photo is never uploaded.
- **The Photos app** (iPhone): to turn one of your own photos into a wallpaper, the built-in crop tool includes a **Wallpaper** aspect ratio that matches your screen.

## Step 4: Design for OLED

Every current iPhone Pro and iPhone Duo screen is OLED, which changes a few things:

- **Pure black (#000000) is truly black.** The pixels switch off and blend into the bezel. Use it for backgrounds if you want an [AMOLED look](/blog/amoled-wallpapers-iphone-battery).
- **Colors are vivid.** iPhone screens show the wide **Display P3** color range, so saturated reds, oranges and greens can look richer than on many computer monitors. If your tool supports it, work and export in Display P3; otherwise, sRGB is safe and predictable.
- **Dark gradients can band.** A smooth transition from deep navy to black may show visible steps. Adding a small amount of noise or grain (around 1–2%) across the gradient breaks them up.

## Step 5: Export the right way

- **Format:** PNG for illustrations, gradients and flat colors; high-quality JPEG (around 90%) for photos.
- **Size:** export at your full canvas size. Don't let the tool scale it down "for web".
- **Color profile:** embed the profile (sRGB or Display P3) so colors appear as intended.
- **Sharpening:** skip it on export. It creates halos around edges that are easy to see on a high-density screen.

## Step 6: Move it to your iPhone without losing quality

Transfer the file with AirDrop or iCloud Drive, or download it in Safari. Avoid sending it through chat apps, which may compress it. Then save it to Photos and set it — our guides cover [saving wallpapers to Photos](/blog/how-to-save-wallpapers-to-iphone-photos) and [setting a wallpaper on iPhone](/blog/how-to-set-wallpaper-on-iphone).

## A quick test before you call it done

Preview the design on the actual phone and ask:

1. Is the clock readable at a glance?
2. Is anything important hiding under the Dynamic Island, the bottom buttons or the fold?
3. Do Home Screen icons and labels stay legible?
4. Do gradients look smooth at full brightness?

If something's off, adjust and export again. It only takes a minute, and you'll end up with a design that fits perfectly. If the result looks soft, our [blurry wallpaper guide](/blog/why-is-my-iphone-wallpaper-blurry) lists the usual causes.

Rather skip the design work? Every wallpaper in our [library](/wallpapers) shows its resolution and how it fits each screen before you download.
$md$,
  array['design', 'iPhone Duo', 'guides'],
  'published',
  'Make Your Own iPhone Duo Wallpaper: Sizes & Export Tips',
  'Make a custom iPhone Duo wallpaper: canvas sizes for the outer and inner displays, safe zones around the clock and fold, free tools and export settings.'
),
(
  '4K, Retina and PPI: What Wallpaper Resolution Really Means on iPhone',
  'iphone-wallpaper-resolution-4k-retina-ppi',
  '"4K wallpaper" sounds like the best you can get — but no iPhone screen is 4K. Here''s what resolution, PPI and Retina mean, and how to tell whether a wallpaper will look sharp.',
  $md$
Wallpaper sites love the label "4K". It sounds like the highest quality possible, and on a TV it is. On a phone, the numbers work differently — and a "4K" image isn't automatically sharper than a smaller one. This guide explains the terms so you can judge any wallpaper by what actually matters.

## Resolution: the pixel count

Resolution is simply the number of pixels in an image, written as width × height. A 1320 × 2868 image is 1,320 pixels across and 2,868 pixels tall — about 3.8 million pixels, or 3.8 megapixels.

Your iPhone's screen has a fixed resolution too:

| Screen | Resolution | Megapixels |
| --- | --- | --- |
| iPhone Duo outer display | 1398 × 2034 | 2.8 MP |
| iPhone Duo inner display | 2670 × 1878 | 5.0 MP |
| iPhone 18 Pro Max | 1320 × 2868 | 3.8 MP |
| iPhone 18 Pro | 1206 × 2622 | 3.2 MP |
| For comparison: 4K UHD TV | 3840 × 2160 | 8.3 MP |

No iPhone screen is 4K. Even the large unfolded inner display of iPhone Duo has about 60% of the pixels of a 4K TV.

## What "4K wallpaper" really means

Strictly speaking, 4K UHD is 3840 × 2160 — a wide TV shape. A phone can't show it at that size; iOS scales it down and crops whatever doesn't match the screen's shape. Most "4K" phone wallpapers are labeled that way simply because their long edge is around 3,840 pixels or more.

A bigger image isn't a problem. iOS scales it down cleanly, and the extra pixels give you room to crop or reframe. But beyond your screen's resolution, extra pixels add file size, not visible sharpness. A well-made 1320 × 2868 wallpaper on an iPhone 18 Pro Max looks exactly as sharp as a 4K one, because the screen can only show 1320 × 2868 pixels.

What matters is **enough pixels, in the right shape, with good compression.**

## PPI and Retina

**PPI (pixels per inch)** describes how tightly a screen packs its pixels. iPhone 18 Pro models have around 460 PPI. That number belongs to the screen, not the image. Whatever the file's metadata says, a 72 PPI and a 300 PPI image with the same pixel dimensions look identical as a wallpaper.

**Retina** is Apple's name for a screen dense enough that you can't make out individual pixels at a normal viewing distance. When Apple introduced the term, the threshold for a phone held about 10–12 inches from your eyes was around 300 PPI; today's iPhones are well beyond it. That's exactly why a wallpaper that's even slightly too small looks soft: the screen is sharp enough to show the difference.

## Why a "high-resolution" wallpaper can still look bad

Pixel count is only half the story:

- **Compression.** A heavily compressed JPEG shows blocky artifacts, especially in skies and gradients. A smaller, cleanly saved file can look better than a large, over-compressed one.
- **Upscaling.** Some images are enlarged by software and relabeled as "4K". They have the pixel count but none of the detail — edges look smeared or waxy.
- **Shape mismatch.** A wide image on a tall phone is cropped to a narrow strip, so you only see a fraction of its pixels. A landscape 3840 × 2160 image on an iPhone 18 Pro Max offers just 2,160 pixels of height for a 2,868-pixel-tall screen, so iOS actually has to *enlarge* it by about a third.
- **Banding.** Gradients saved with too few colors show visible steps instead of a smooth blend.

## How to tell if a wallpaper will look sharp

1. **Compare both dimensions with your screen.** The image should be at least as wide and as tall as the screen, in the same orientation.
2. **Check the shape.** Portrait for the iPhone Duo outer display and iPhone 18 Pro models; landscape for the iPhone Duo inner display.
3. **Look at the file size.** For a detailed photo, a 3–4 megapixel file of only a couple of hundred kilobytes suggests heavy compression. (Simple, flat designs can legitimately be small.)
4. **Download the original.** Previews on websites are scaled down so pages load quickly.

That's why every wallpaper page on this site shows the exact resolution, file format and file size, along with a screen-fit check that says whether the image will be pixel-perfect, slightly soft or heavily cropped on each device. We'd rather show you the real numbers than a label.

## Quick reference

- **Larger than your screen, same shape:** sharp. iOS scales it down.
- **Exactly your screen size:** sharp, pixel for pixel.
- **Up to about 30% smaller:** usually still pleasant, a little soft on close inspection.
- **Much smaller, or the wrong shape:** visibly soft or heavily cropped.

For the exact numbers on Apple's foldable, read [iPhone Duo Wallpaper Sizes Explained](/blog/iphone-duo-wallpaper-sizes-explained). If a wallpaper looks soft on your phone even at the right size, our [blurry wallpaper troubleshooting guide](/blog/why-is-my-iphone-wallpaper-blurry) covers the other usual suspects.
$md$,
  array['resolution', 'explainer', 'guides'],
  'published',
  'iPhone Wallpaper Resolution: 4K, Retina and PPI Explained',
  'Does your iPhone need a 4K wallpaper? What resolution, PPI and Retina mean, how many pixels each screen has, and how to pick a wallpaper that looks sharp.'
),
(
  'How to Change Your iPhone Wallpaper Automatically',
  'change-iphone-wallpaper-automatically',
  'Tired of the same Lock Screen? Your iPhone can rotate wallpapers on its own — on every tap, hourly, daily or at sunset. Here are three ways to set it up, no apps required.',
  $md$
Changing your wallpaper by hand is easy, but it's also easy to forget. Your iPhone has built-in ways to rotate wallpapers for you, with no third-party app needed. Pick the method that matches how often you want a change.

| Method | Changes | Best for |
| --- | --- | --- |
| Photo Shuffle | On tap, on lock, hourly or daily | A rotating set of favorites |
| Shortcuts automation | At a set time, at sunrise or sunset, and more | Day and night wallpapers |
| Focus modes | When a Focus turns on | Different looks for work, sleep and free time |

## Method 1: Photo Shuffle

Photo Shuffle is the simplest option. You choose a set of photos, and iOS rotates through them on the Lock Screen — and on the Home Screen too, if you set them as a pair.

### Prepare an album first

Putting your favorite wallpapers in one album lets you control exactly what shows up:

1. Save the wallpapers to Photos ([here's how](/blog/how-to-save-wallpapers-to-iphone-photos)).
2. In Photos, select them, tap the **Share** button (or the **•••** menu), choose **Add to Album → New Album**, and name it something like "Wallpapers".

### Set up the shuffle

1. Touch and hold the Lock Screen, then tap **+** to add a new Lock Screen.
2. Choose **Photo Shuffle**.
3. Select your photos manually, or choose your Wallpapers album (the options vary slightly between iOS versions).
4. Set the **Shuffle Frequency**: **On Tap**, **On Lock**, **Hourly** or **Daily**.
5. Tap **Add**, then **Set as Wallpaper Pair**.

With **On Tap** selected, a tap on the Lock Screen jumps to the next wallpaper whenever you like.

**Tip:** a shuffle looks best when the wallpapers share a style or brightness — a set of [minimal landscapes](/categories/minimal), say, or dark [iOS-inspired abstracts](/categories/ios-inspired-wallpapers). A consistent set feels intentional rather than random.

## Method 2: A Shortcuts automation for day and night

The Shortcuts app can switch wallpapers on a schedule — for example, a bright wallpaper during the day and a dark one after sunset.

### First, create the two Lock Screens

Set up a "day" Lock Screen with a bright wallpaper and a "night" Lock Screen with a dark one, using the usual [wallpaper steps](/blog/how-to-set-wallpaper-on-iphone).

### Then build the automation

1. Open **Shortcuts** and go to the **Automation** tab.
2. Tap **+** (or **New Automation**) and choose **Sunset** — or **Time of Day** for a fixed time.
3. Choose **Run Immediately** so it doesn't ask for confirmation each time.
4. Add a wallpaper action. Search the action list for "wallpaper": recent iOS versions offer **Switch Between Wallpapers**, which jumps to a Lock Screen you've already set up, and **Set Wallpaper Photo**, which places a specific photo. Older versions call it **Set Wallpaper**.
5. Choose your night Lock Screen or photo. If the action has a **Show Preview** option, turn it off so the change happens silently.
6. Save it, then create a second automation for **Sunrise** that switches back to your day Lock Screen.

Action names and options change from one iOS release to the next. If something isn't exactly where described, searching the action list for "wallpaper" will find it.

### Other triggers worth trying

The same wallpaper action works with other automation triggers — arriving at work, connecting to CarPlay, or plugging in a charger. A calm, dark wallpaper whenever you plug in at night is a nice touch.

## Method 3: Focus modes

If you use Focus modes, you can link a Lock Screen to each one. When that Focus turns on — manually, on a schedule or by location — the wallpaper changes with it: a minimal design for Work, a dark one for Sleep, a favorite photo for Personal.

We cover the setup step by step in [Match a Wallpaper to Every Focus Mode](/blog/iphone-lock-screen-focus-mode-wallpapers).

## Which method should you use?

- **You just want variety:** Photo Shuffle, set to Daily or On Tap.
- **You want a light and dark rhythm:** a Shortcuts automation at sunrise and sunset.
- **You want your phone to match what you're doing:** Lock Screens linked to Focus modes.

They combine well, too: a Photo Shuffle Lock Screen for everyday use, plus a dedicated dark Lock Screen that your Sleep Focus switches to at night. For the dark one, a true-black design is easy on the eyes and the battery — see [AMOLED wallpapers and battery life](/blog/amoled-wallpapers-iphone-battery).

## Troubleshooting

- **The automation asks before running.** Edit it and select **Run Immediately**. Turn off **Notify When Run** if you don't want a banner.
- **The wallpaper action doesn't list your Lock Screen.** Create the Lock Screen first; the action can only switch to Lock Screens that already exist.
- **Shuffled photos look blurry.** Photo Shuffle uses your Photos library, so the same rules apply as for any wallpaper — see [why wallpapers look blurry](/blog/why-is-my-iphone-wallpaper-blurry).
- **Photo Shuffle shows photos you didn't pick.** Choose your own photos or album instead of the featured or suggested sets.
$md$,
  array['how-to', 'Shortcuts', 'guides'],
  'published',
  'How to Change Your iPhone Wallpaper Automatically',
  'Rotate your iPhone wallpaper automatically with Photo Shuffle, a Shortcuts automation or Focus modes — on every tap, hourly, daily or at sunset. No apps needed.'
),
(
  'One Lock Screen per Focus: Match a Wallpaper to Every Focus Mode',
  'iphone-lock-screen-focus-mode-wallpapers',
  'Your iPhone can switch wallpapers when you switch modes — a quiet design for work, a dark one for sleep, a photo for the weekend. Here''s how to set it up and what to choose for each.',
  $md$
Focus modes on iPhone filter notifications so you can concentrate, rest or switch off. Less well known: each Focus can bring its own Lock Screen and Home Screen. Turn on Work and your phone shows a calm, minimal wallpaper; at bedtime, Sleep switches to a dark one. It's a small change that makes each mode feel real.

## How it works

You can create several Lock Screens on iPhone, each with its own wallpaper, clock style and widgets. Any of them can be linked to a Focus. When that Focus turns on — manually, on a schedule, or automatically by location or app — the linked Lock Screen and its paired Home Screen appear. When the Focus ends, your regular Lock Screen comes back.

## Step 1: Create a Lock Screen for the Focus

1. Save the wallpaper you want to Photos.
2. Touch and hold the Lock Screen, tap **+**, and choose **Photos**.
3. Pick the wallpaper, frame it and add widgets if you like.
4. Tap **Add**, then **Set as Wallpaper Pair** — or **Customize Home Screen** to use a different or blurred Home Screen.

Repeat for each Focus you want to style. New to this? Start with [how to set a wallpaper on iPhone](/blog/how-to-set-wallpaper-on-iphone).

## Step 2: Link it to a Focus

**From the Lock Screen:**

1. Touch and hold the Lock Screen to open the gallery.
2. Swipe to the Lock Screen you just created.
3. Tap the **Focus** button at the bottom.
4. Choose a Focus — Work, Sleep, Personal or one you've made yourself.

**Or from Settings:**

1. Open **Settings → Focus** and tap a Focus.
2. Under **Customize Screens**, tap the Lock Screen preview.
3. Choose the Lock Screen you want.

In Settings you can also choose Home Screen pages for the Focus, which hides apps that would distract you.

## Step 3: Let it switch automatically

A Focus is most useful when you don't have to remember to turn it on:

- **Schedule.** In Settings → Focus → [your Focus], tap **Add Schedule** and set the times — Work on weekdays from 9 to 6, for example.
- **Location.** Turn Work on when you arrive at the office.
- **App.** Turn a Focus on whenever you open a particular app.
- **Sleep.** The Sleep Focus follows the sleep schedule you set in the Health app.

## Wallpaper ideas for each Focus

### Work: calm and uncluttered

At work, the Lock Screen should help you ignore your phone. Choose low-contrast, minimal designs with few details — muted gradients, soft textures, simple geometry. They keep widgets readable and don't pull at your attention. Try [Minimal Topographic Concrete](/wallpapers/minimal-topographic-concrete-duo-wallpaper) or browse the [Minimal category](/categories/minimal), and read why [minimal wallpapers help you focus](/blog/minimal-iphone-wallpapers-guide).

### Sleep: dark and dim

At night, a bright wallpaper lights up the room every time a notification arrives. Pick a true-black or very dark design. On models with an Always-On display, that also means far fewer lit pixels all night — more in [AMOLED wallpapers and battery](/blog/amoled-wallpapers-iphone-battery). The dark designs in our [iOS Inspired category](/categories/ios-inspired-wallpapers) are a good fit.

### Personal: something that makes you smile

Free time is for photos of people and places you love, bold art or your favorite characters. Browse [Anime 4K](/categories/anime-4k) for dramatic character art, or set up a [Photo Shuffle](/blog/change-iphone-wallpaper-automatically) of your best shots.

### Fitness or Driving: high contrast

When you're on the move, you glance at your phone for a second at most. A simple, high-contrast wallpaper with a large clock is easiest to read. Dark backgrounds with a single bright accent work well, and our [Car wallpapers](/categories/car) are a fun match for a Driving Focus — here's [how to pick one that fits a tall screen](/blog/car-wallpapers-iphone-framing).

### Reading or Study: warm and quiet

Soft, warm tones are easier on the eyes during long sessions and pair well with a minimal widget setup — a calendar and a timer, nothing more.

## Tips for a polished setup

- **Give each Lock Screen a distinct look.** You should know which Focus is on at a glance, without reading the icon in the status bar.
- **Match widgets to the mode.** Calendar and reminders for Work, alarms and battery for Sleep, weather and activity for Personal.
- **Keep your default Lock Screen versatile.** It's the one you see most of the time.
- **On iPhone Duo,** set up the outer and inner displays while the phone is folded and unfolded, so each screen gets a wallpaper that suits its shape — see [iPhone Duo wallpaper sizes](/blog/iphone-duo-wallpaper-sizes-explained).

## Troubleshooting

- **The wallpaper doesn't change when the Focus starts.** Open the Lock Screen gallery and check that the Focus name appears under the right Lock Screen.
- **The wrong Lock Screen appears.** Each Focus uses one Lock Screen. Check which one is linked under Settings → Focus → [your Focus] → Customize Screens, and pick the right one there.
- **The Home Screen didn't change.** In Settings → Focus → [your Focus] → Customize Screens, choose Home Screen pages as well.
$md$,
  array['Focus', 'Lock Screen', 'guides'],
  'published',
  'Link iPhone Lock Screen Wallpapers to Focus Modes',
  'Link a Lock Screen and wallpaper to each Focus mode on iPhone so your phone changes its look for work, sleep and free time. Step-by-step setup and ideas.'
),
(
  'Home Screen Wallpapers That Keep Icons and Widgets Readable',
  'home-screen-wallpaper-readable-icons',
  'A stunning wallpaper can make your Home Screen harder to use. Here''s how to choose and adjust one so icons, labels and widgets stay clear — without giving up on style.',
  $md$
The Lock Screen is where a wallpaper gets to show off. The Home Screen is different: it's a workspace covered in icons, labels and widgets that you need to find quickly. A wallpaper that's beautiful on its own can turn that workspace into a puzzle. Here's how to have both — a Home Screen that looks great and is easy to use.

## Why some wallpapers make icons hard to read

Three things cause most of the trouble:

1. **Busy detail.** App icons have bright colors and crisp edges. Put them on a wallpaper that's also full of color and edges, and your eye struggles to separate them.
2. **Similar colors.** A green wallpaper swallows green icons like Messages, FaceTime and Phone. A pale wallpaper makes white labels disappear.
3. **Uneven brightness.** App labels are a single color, so a wallpaper that's bright in some places and dark in others leaves some labels unreadable.

## The rules of a readable Home Screen

### Keep detail low where icons sit

Icons fill the screen from top to bottom, with the dock along the bottom edge. A wallpaper with soft, gradual changes — gradients, blurred scenes, smooth abstract shapes — gives every icon a calm background. Save detailed, high-contrast art for the Lock Screen.

### Choose a wallpaper that's mostly dark or mostly light

Even brightness keeps every label readable. Dark wallpapers with white labels are the easiest combination on OLED screens, and they pair naturally with Dark Mode.

### Contrast with your most-used apps

Look at the colors of the apps on your first page. If most of them are blue and green, a warm or neutral wallpaper will make them stand out.

### Put the subject where icons aren't

If your wallpaper has a focal point, icons will cover it anyway. Either accept that and use the Home Screen blur described below, or leave an empty area on your first page where the subject can show through.

## Built-in iOS tools that help

### Blur the Home Screen wallpaper

You can keep a detailed image on the Lock Screen and use a blurred version on the Home Screen. Open **Settings → Wallpaper**, tap **Customize** under the Home Screen preview and turn on **Blur**. The colors stay and the distracting detail goes. In the same place, you can choose a plain **Color** or **Gradient** generated from your Lock Screen wallpaper instead.

### Dark and tinted icons

Recent iOS versions let you change how app icons look. Touch and hold an empty area of the Home Screen, tap **Edit → Customize**, and choose a style such as **Dark** or **Tinted** (newer versions add further options). Tinted icons in a single color make almost any wallpaper look tidy, and dark icons sit beautifully on black [AMOLED wallpapers](/blog/amoled-wallpapers-iphone-battery).

### Reduce Transparency and Increase Contrast

If labels or widgets are still hard to read, **Settings → Accessibility → Display & Text Size** offers **Reduce Transparency** and **Increase Contrast**, which make interface elements more solid and distinct over any wallpaper.

### Dimming in Dark Mode

On iOS versions that offer it, **Dark Appearance Dims Wallpaper** in Settings → Wallpaper darkens your wallpaper slightly when Dark Mode is on, which improves contrast at night.

## The best wallpaper styles for the Home Screen

- **Gradients.** Smooth color transitions are the classic Home Screen choice: colorful, with no detail to compete with icons.
- **Minimal designs.** Plenty of empty space and one quiet element. Browse our [Minimal category](/categories/minimal).
- **Soft abstracts and glass.** Rounded shapes and gentle light, in the spirit of Apple's own wallpapers. See our [iOS Inspired designs](/categories/ios-inspired-wallpapers) and the guide to [what makes a wallpaper feel like iOS](/blog/ios-style-wallpapers-glass-gradients).
- **Dark wallpapers with a small accent.** A glowing line or orb near the edge, black everywhere else.
- **Subtle textures.** Concrete, paper or topographic lines add character at very low contrast — like [Minimal Topographic Concrete](/wallpapers/minimal-topographic-concrete-duo-wallpaper).

## Styles to save for the Lock Screen

- Detailed illustrations and anime art (our [anime wallpaper guide](/blog/anime-wallpapers-iphone-lock-screen) covers how to frame them)
- Photos of people, whose faces you'd rather not cover with icons
- High-contrast patterns and designs with text in them
- Busy cityscapes and crowded scenes

You don't have to give these up. Set them on the Lock Screen and use **Customize Home Screen** to pair them with a blurred version or a matching gradient.

## A quick readability test

After setting a new Home Screen, hold your phone at arm's length and try to find three apps by their labels. If you hesitate, turn on the blur, switch to dark or tinted icons, or pick a calmer wallpaper.

## iPhone Duo: two Home Screens to think about

On the larger unfolded inner display, more of the wallpaper shows between icons and widgets, so wide, low-detail landscapes and gradients work especially well — keep anything busy away from the fold in the middle. On the outer display, the same rules apply as on any iPhone. Our guide to [iPhone Duo wallpaper sizes](/blog/iphone-duo-wallpaper-sizes-explained) has the right dimensions for each screen.
$md$,
  array['Home Screen', 'design', 'guides'],
  'published',
  'iPhone Home Screen Wallpaper Tips for Readable Icons',
  'Keep iPhone app icons and widgets readable on any wallpaper: simple contrast rules, the Home Screen blur, dark and tinted icons, and the best wallpaper styles.'
),
(
  'Anime Wallpapers for iPhone: How to Pick Art That Works on a Lock Screen',
  'anime-wallpapers-iphone-lock-screen',
  'Great anime art doesn''t always make a great wallpaper. Here''s how to choose anime wallpapers that frame the clock, stay readable and look stunning on OLED — and how to respect the artists.',
  $md$
Anime art and phone wallpapers are a natural match: bold colors, striking characters and dramatic lighting. But a piece that looks incredible in a gallery can feel cramped on a Lock Screen, with the clock across a character's face and widgets covering the best detail. These tips will help you choose anime wallpapers that look as good on your iPhone as they did when you found them.

## 1. Mind where the face lands

The most important part of most anime wallpapers is a face — especially the eyes. On the Lock Screen, the date, clock and widgets cover roughly the top quarter to third of a portrait screen. If the eyes sit there, they'll be hidden behind the time.

Look for art where:

- **The face sits in the middle or lower half** of a portrait screen, below the clock.
- **The character is turned slightly to one side,** leaving open space the clock can occupy.
- **Or the top of the head reaches up into the clock area,** which is perfect for the [depth effect](/blog/iphone-lock-screen-depth-effect-wallpapers), where hair overlaps the time.

## 2. Choose the right orientation for your screen

Anime wallpapers come in both shapes, and it matters more than you might think.

- **Portrait art** suits the iPhone Duo outer display and iPhone 18 Pro models. Full-body poses, standing characters and vertical compositions shine here.
- **Landscape art** suits the unfolded iPhone Duo inner display: wide scenes, two characters facing each other, cinematic panoramas.

Put a landscape illustration on a portrait screen and iOS keeps only a narrow vertical strip — often cutting a character in half. Every wallpaper page on this site includes a screen-fit check that shows how each screen will crop the art, so you can see it before you download.

## 3. Dark anime art is made for OLED

Many of the most popular anime wallpapers are dark: a character emerging from shadow, glowing eyes, a crimson moon in a black sky. On an OLED iPhone, those black areas switch off completely, so the lit parts — eyes, energy, neon — seem to float. It's the most dramatic look an iPhone screen can produce, and it's gentle on your eyes at night and on the Always-On display. Learn more in our guide to [AMOLED wallpapers](/blog/amoled-wallpapers-iphone-battery).

[Emerald Eyes](/wallpapers/emerald-eyes-dark-anime-iphone-duo-wallpaper), [Moon Throne](/wallpapers/moon-throne-dark-anime-iphone-duo-wallpaper) and [Neon Spirit Wolf](/wallpapers/neon-spirit-wolf-anime-duo-wallpaper) all use this approach.

## 4. Keep the Home Screen in mind

Detailed anime art is a Lock Screen wallpaper first. On the Home Screen, icons cover the character and the detail competes with app labels. Two good options:

- Keep the art on the Lock Screen and use **Customize Home Screen → Blur** for a soft version behind your apps.
- Choose a matching color or gradient for the Home Screen that echoes the art — a crimson gradient for a red-eyed character, for example.

Our guide to [readable Home Screen wallpapers](/blog/home-screen-wallpaper-readable-icons) has more ideas.

## 5. Check the quality before you commit

Anime art has clean lines and flat areas of color, so quality problems are easy to spot:

- **Jagged or blurry lines** mean the image was enlarged from a smaller original.
- **Blocky patches or halos** around lines mean heavy compression.
- **Banding** in dark, gradient skies means the image was saved with too few colors.

Download the original file rather than a preview, and check that its resolution is at least that of your screen. If it still looks soft, see [why wallpapers look blurry](/blog/why-is-my-iphone-wallpaper-blurry).

## 6. Respect the artists

Anime wallpapers are everywhere online, but someone made every one of them. Characters from well-known series are owned by their studios and publishers, and fan art belongs to the artist who drew it. A few ways to be a good fan:

- **Favor original art** — original characters and scenes made as wallpapers, or art an artist has shared for free personal use.
- **Keep it personal.** Setting art on your own phone is very different from reposting, selling or printing it.
- **Credit and support artists** whose work you love: follow them, buy their prints, commission them.
- **Report misuse.** If you're an artist and find your work on this site without permission, our [DMCA & copyright page](/dmca) explains how to have it removed quickly.

## 7. Build a set, not just one wallpaper

Can't choose a favorite? You don't have to. Save several anime wallpapers to an album and use **Photo Shuffle** to rotate them on every tap, hourly or daily — our guide to [changing your wallpaper automatically](/blog/change-iphone-wallpaper-automatically) shows how. A set that shares a mood — all dark, all neon, all one color — looks the most intentional.

## Find your next wallpaper

Browse the full [Anime 4K category](/categories/anime-4k). Every page lists the exact resolution and shows how the art fits iPhone Duo's outer and inner displays and iPhone 18 Pro models.
$md$,
  array['anime', 'Lock Screen', 'guides'],
  'published',
  'Anime Wallpapers for iPhone: A Lock Screen Picking Guide',
  'Choose anime wallpapers that work on iPhone: framing faces around the clock, dark AMOLED art, portrait vs. landscape, depth effect tips and respecting artists.'
),
(
  'Minimal iPhone Wallpapers: Why Less on Screen Helps You Focus',
  'minimal-iphone-wallpapers-guide',
  'A minimal wallpaper isn''t just an aesthetic. It makes your clock and widgets easier to read, your Home Screen calmer and your phone a little less distracting. Here''s how to pick one.',
  $md$
Minimal wallpapers are among the most popular on any wallpaper site, and not only because they look clean. A wallpaper with less going on makes your phone genuinely easier to use: the clock is easier to read, icons stand out, and there's less tugging at your attention every time you pick the phone up. Here's why minimalism works so well on a phone, and how to choose a minimal wallpaper you won't tire of.

## Why minimal wallpapers work

### Your phone is already busy

Between the clock, date, widgets, notifications, app icons, labels and badges, your screens carry a lot of information. A busy wallpaper adds one more layer competing for your eyes. A minimal one steps back and lets the information you actually need come forward.

### Readability everywhere

Plain or softly varied backgrounds make white text and colorful icons easy to read at a glance — in bright sunlight, at low brightness at night, and when you check your phone on the move.

### Room for widgets and the clock

iOS lets you add widgets to both the Lock Screen and the Home Screen, and restyle the clock. All of that needs space. A minimal wallpaper gives your widgets a clean backdrop, so the whole setup looks designed rather than cluttered.

### Fewer reasons to keep looking

A detailed, striking image invites you to look at it. A calm one doesn't. If you're trying to spend less time on your phone, a quiet wallpaper is a small nudge in the right direction — and it pairs well with a [Work or Sleep Focus](/blog/iphone-lock-screen-focus-mode-wallpapers).

### They last

Trendy wallpapers can feel dated within weeks. Simple shapes, gentle colors and natural forms tend to stay pleasant for months.

## The main styles of minimal wallpaper

**Solid colors and soft gradients.** The purest option: a single deep color or a subtle two-tone blend. Ideal for the Home Screen.

**Single-subject landscapes.** One mountain, one tree, one moon, and plenty of sky. Minimal, but with a subject — which also makes them perfect for the [Lock Screen depth effect](/blog/iphone-lock-screen-depth-effect-wallpapers). See [Minimal Snow Mountain and Moon](/wallpapers/minimal-snow-mountain-moon-landscape-duo-wallpaper) or [Midnight Blue Desert Dunes](/wallpapers/midnight-blue-desert-dunes-dual-iphone-wallpaper).

**Line art and geometry.** Thin lines, simple shapes and patterns with lots of negative space give structure without clutter.

**Subtle textures.** Concrete, paper, fabric or topographic lines, nearly monochrome. They add depth that a flat color can't — like [Minimal Topographic Concrete](/wallpapers/minimal-topographic-concrete-duo-wallpaper).

**Dark minimal.** A black background with one small glowing element. It's the minimal style that looks best on OLED screens and the easiest on the eyes at night — more on that in our [AMOLED wallpaper guide](/blog/amoled-wallpapers-iphone-battery).

## How to choose a minimal wallpaper

1. **Check that the empty space is where you need it.** The top of the Lock Screen holds the clock and widgets. A minimal wallpaper with its one element at the very top defeats the purpose.
2. **Pick colors that suit your icons.** If most apps on your first page are blue and green, try a warm neutral, black or soft orange.
3. **Think about light and dark.** A light minimal wallpaper feels fresh in the daytime; a dark one is better at night and with Dark Mode. You can use both with a [scheduled switch](/blog/change-iphone-wallpaper-automatically).
4. **Watch out for banding.** Minimal wallpapers are often large areas of smooth color, which reveal compression problems quickly. Download the original file, and if a gradient shows stepped bands, look for a version with a little texture.
5. **Make sure it's sharp.** Simple designs hide nothing: a soft edge on a single shape is very obvious, so check that the resolution matches your screen.

## Minimal on iPhone Duo

The wide inner display of iPhone Duo is a wonderful canvas for minimalism. A single subject placed off-center — away from the fold — with a broad expanse of sky or color feels calm and deliberate. On the tall outer display, put the subject in the lower half and leave the top for the clock. For exact dimensions, read [iPhone Duo Wallpaper Sizes Explained](/blog/iphone-duo-wallpaper-sizes-explained).

## Make one yourself

Minimal wallpapers are the easiest kind to design: a gradient, a shape and some space. Our guide to [making your own iPhone Duo wallpaper](/blog/how-to-make-your-own-iphone-duo-wallpaper) covers canvas sizes, safe zones and export settings.

Or browse our [Minimal category](/categories/minimal) — every wallpaper lists its resolution and shows how it fits each screen.
$md$,
  array['minimal', 'design', 'guides'],
  'published',
  'Minimal iPhone Wallpapers: Why Less Helps You Focus',
  'Why minimal wallpapers make your iPhone easier to use: readability, fewer distractions and room for widgets. Plus the main minimal styles and how to choose one.'
),
(
  'Car Wallpapers for iPhone: How to Fit a Wide Car on a Tall Screen',
  'car-wallpapers-iphone-framing',
  'Cars are long and phones are tall, which makes car wallpapers trickier than they look. Here are the angles, crops and styles that work on the Lock Screen, the Home Screen and iPhone Duo.',
  $md$
Car photography is made for wide frames. A side profile, a car on a winding road, a low shot across the bonnet — all naturally landscape. Phone screens, of course, are tall. That mismatch is why so many car wallpapers end up with a cropped bumper, a missing wheel or a car squeezed into the bottom of the screen. Here's how to pick car wallpapers that actually fit.

## The problem: a long subject on a tall screen

Seen from the side, a typical sports car is three or more times as long as it is tall. An iPhone 18 Pro Max screen is more than twice as tall as it is wide. Put a side-on car on that screen and you have two options: show the whole car very small, or crop it so only part of it fits.

The solution isn't to fight the shape. It's to choose angles and compositions that suit it.

## Angles that work on a tall screen

### Front three-quarter view

The classic car-photography angle shows the front and one side at once. Because the car is angled toward the camera, it takes up less width and more height — a far better fit for a portrait screen.

### Head-on or rear view

Straight from the front or the back, a car is roughly as wide as it is tall. It fits a phone screen easily, and a symmetrical front end looks bold and graphic.

### Top-down view

Shot from above with the car pointing up the screen, the car is long in exactly the direction the screen is long. It's an unusual angle that makes a striking wallpaper — see [Emerald Track Car](/wallpapers/emerald-track-car-duo-wallpaper).

### Small car, big scene

Place the car small in the lower part of the frame, with a dramatic sky, mountains or city above it. The scene fills the screen, the car is the focal point, and the open space at the top is perfect for the clock. [Silver Sports Car, Dark Mountain](/wallpapers/silver-sports-car-dark-mountain-duo-wallpaper) works this way.

### Details

Headlights, a wheel, a badge, the curve of a wing. Close-up detail shots fill a tall screen beautifully and have an abstract, premium feel.

## Side profiles belong on the wide screen

A full side profile — the angle that shows off a car's proportions best — is a natural fit for wide displays. On the unfolded iPhone Duo inner display (2670 × 1878), a side-on car fits comfortably with room to breathe. Just remember that the fold runs down the middle: a car centered on it puts the crease straight across the doors, so a composition with the car shifted a little to one side often looks better.

## Framing around the clock

On the Lock Screen, the date, clock and widgets cover roughly the top quarter to third of a portrait screen. Car wallpapers usually have their subject in the lower half anyway, which is ideal — but check that the roofline or a rear wing isn't sliced by the time. A car with sky or dark space above it gives the clock somewhere clean to sit.

A low-angle shot where the roof rises into the clock area can also work with the [depth effect](/blog/iphone-lock-screen-depth-effect-wallpapers), although iOS doesn't recognize cars as subjects as reliably as people or animals.

## Dark, cinematic car wallpapers

Many of the best car wallpapers are dark: a black coupé lit by a single light, a silhouette against a dusk sky, reflections on wet tarmac. They look superb on OLED screens, where black areas switch off completely and the car's highlights seem to glow. They also keep the clock readable and pair well with Dark Mode. [Midnight Black Coupe](/wallpapers/midnight-black-coupe-duo-wallpaper) is a good example; our [AMOLED wallpaper guide](/blog/amoled-wallpapers-iphone-battery) explains why the look works so well.

## Car wallpapers on the Home Screen

A car photo is usually busy around the subject — reflections, wheels, panel lines — which competes with app icons. Two easy fixes: use **Customize Home Screen** to blur it, or choose a shot with plenty of plain sky or road above the car, so your icons have a calm backdrop. More tips in [Home Screen wallpapers that keep icons readable](/blog/home-screen-wallpaper-readable-icons).

## Quality matters more with cars

Cars have long, smooth reflections and crisp edges, so they reveal quality problems quickly. Watch for:

- **Banding in reflections and skies** — a sign of heavy compression.
- **Jagged edges along the bodywork** — usually an image that's been enlarged.
- **A crop that cuts off the wheels or the nose** — check the screen-fit preview on the wallpaper page before you download.

## Make your own

Got a great photo of your own car? Crop it to your screen's shape with the Photos app's crop tool, keep the car in the lower half and leave space above it. For exact screen sizes and export settings, see [how to make your own iPhone Duo wallpaper](/blog/how-to-make-your-own-iphone-duo-wallpaper).

Or browse our [Car wallpapers](/categories/car) — every page shows how the image fits each screen.
$md$,
  array['cars', 'design', 'guides'],
  'published',
  'Car Wallpapers for iPhone: Framing a Wide Car Right',
  'Choose car wallpapers that fit iPhone: angles for a tall screen, side profiles for iPhone Duo''s wide display, dark cinematic shots and framing the clock.'
),
(
  'Glass, Gradients and Orbs: What Makes a Wallpaper Feel Like iOS',
  'ios-style-wallpapers-glass-gradients',
  'Apple''s wallpapers have a recognizable look — soft light, rich gradients, glassy depth. Here''s what defines the style, why it suits the iPhone interface, and how to choose designs inspired by it.',
  $md$
You can often spot an Apple wallpaper from across the room: swirls of saturated color, soft glowing light, shapes that look like glass or liquid, and a calm composition that never fights the clock. The look has evolved over the years, but its principles have stayed remarkably consistent — and they're why iOS-inspired designs are among the most popular wallpapers you can choose. Here's what defines the style.

## The building blocks of the iOS look

### Rich, smooth gradients

Gradients are at the heart of it: deep blue melting into violet, warm orange fading to pink. They're colorful without being detailed, so app icons and widgets sit on top cleanly. Good gradients are perfectly smooth — no visible steps — and use colors that take advantage of the iPhone's wide-color OLED screen.

### Light that glows from within

Apple's wallpapers often look lit from the inside, with soft highlights, bloom and gentle glows at the edges of shapes. Light gives depth to an otherwise abstract image, and on OLED, bright highlights against dark areas have real punch.

### Glass and liquid forms

Translucent, glass-like shapes — ribbons, bubbles, waves — that bend light and show color through them have become a signature. They echo the interface itself: iOS has long used translucency and blur in its menus and panels, and Apple's 2025 redesign, Liquid Glass, put glassy, light-refracting materials at the center of the whole system. A glassy wallpaper looks at home behind those controls.

### Orbs and spheres

Round, glossy shapes floating in space are another recurring motif. A sphere gives the eye a single focal point and naturally leaves space around it for the clock and widgets.

### Calm composition

For all their color, iOS wallpapers are carefully composed. The busiest part of the image usually sits low or toward the edges, and the top stays clear for the time. Nothing sharp or high-contrast sits where icons will go.

### Light and dark versions

Many of Apple's wallpapers come in light and dark variants that switch with your appearance setting. You can do the same with any wallpapers by pairing a bright version for the day with a dark one for the night — see [how to change your wallpaper automatically](/blog/change-iphone-wallpaper-automatically).

## Why the style suits iPhone so well

- **It's designed around the interface.** Low detail where icons go and a clear top for the clock keep everything readable.
- **It flatters OLED.** Deep blacks and saturated colors are exactly what these screens do best.
- **It doesn't date quickly.** Abstract light and color aren't tied to a passing trend.
- **It works on any screen shape.** Abstract compositions crop gracefully, which matters on a phone like iPhone Duo, with a tall outer display and a wide inner one.

## Inspired by, not copied from

Apple's own wallpapers are copyrighted artwork: they come with your device for use on it, but they aren't free to redistribute. The designs in our [iOS Inspired category](/categories/ios-inspired-wallpapers) are new designs that follow the same principles — glass, gradients, glow and calm composition — rather than copies of Apple's. A few favorites:

- [Aqua Glass](/wallpapers/aqua-glass-ios-inspired-duo-wallpaper) — clean, bright glass forms.
- [Purple Liquid Glass](/wallpapers/purple-liquid-glass-abstract-duo-wallpaper) — vivid violet with liquid highlights.
- [Emerald Glass S-Curve](/wallpapers/emerald-glass-s-curve-abstraction) — a soft sage-green sweep.
- [Midnight Orb](/wallpapers/midnight-orb-abstract-duo-wallpaper) — glossy spheres on a dark background.

## How to choose an iOS-style wallpaper

1. **Pick your mood with color.** Blues and teals feel calm, purples and magentas energetic, golds premium, greens fresh and natural.
2. **Decide on light or dark.** Dark versions are easier on the eyes at night and suit the [AMOLED look](/blog/amoled-wallpapers-iphone-battery); light ones feel airy in the daytime.
3. **Check where the brightest part sits.** It should be below or beside the clock, not behind it.
4. **Look for smooth gradients.** Download the original file and check for banding at full brightness.
5. **Match the shape to the screen.** Abstract designs crop well, but the screen-fit check on each wallpaper page shows exactly how much of the image each screen keeps.

## Make the most of it

- Pair the wallpaper with **dark or tinted icons** for a cohesive Home Screen — see [Home Screen wallpapers that keep icons readable](/blog/home-screen-wallpaper-readable-icons).
- In the Lock Screen editor, tap the clock and pick a **color sampled from the wallpaper** for a matched look.
- Try the same design on both iPhone Duo displays: abstract light and glass look natural on the tall and wide screens alike.

Want to make your own? Our guide to [designing an iPhone Duo wallpaper](/blog/how-to-make-your-own-iphone-duo-wallpaper) covers canvas sizes, safe zones and the gradient export settings that prevent banding.
$md$,
  array['iOS', 'design', 'guides'],
  'published',
  'iOS-Style Wallpapers: Glass, Gradients and Orbs Explained',
  'What makes a wallpaper look like iOS: smooth gradients, glass, light and calm composition. Why the style suits iPhone, and how to pick iOS-inspired designs.'
)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------
-- "Official iPhone Duo wallpaper" (October 2026). Page one of Google for
-- "iphone duo wallpaper" is almost all news posts about Apple's stock
-- dunes wallpaper, and the site had nothing answering that. Apple's files
-- are not ours to host, so this explains them and points to originals.
-- ---------------------------------------------------------------------
insert into public.posts (title, slug, excerpt, content, tags, status, seo_title, seo_description)
values
(
  'The Official iPhone Duo Wallpaper: Light and Dark Dunes, Sizes and How to Get It',
  'official-iphone-duo-wallpaper',
  'Apple made four stock wallpapers for iPhone Duo: desert dunes under a mountain range, in light and dark. Here is what they are, the exact sizes for each screen, where they come from and how to set them.',
  $md$
When Apple announced iPhone Duo, its first foldable iPhone, it showed it off with a new stock wallpaper: sweeping desert dunes in front of a rugged mountain range. It is the image most people mean when they search for "iPhone Duo wallpaper". This guide covers what the official wallpaper is, the exact sizes for each screen, where the files come from, and how to get the same look on the phone you have now.

## What the official iPhone Duo wallpaper looks like

There are **four** official images: two for light mode and two for dark mode.

- **Light versions** show the dunes in daylight — warm beige sand under a pale blue sky.
- **Dark versions** show the same landscape at night, with deep shadows, a star-filled sky and a soft glow along the horizon.

Like most of Apple's recent wallpapers, the pair is meant to switch with your appearance setting: light during the day, dark at night or whenever Dark Mode is on.

## Why there are two files for each version

iPhone Duo has two screens with very different shapes, so one picture cannot fill both:

| Screen | Resolution | Shape |
| --- | --- | --- |
| Outer display (5.4-inch, folded) | 1398 × 2034 | Tall portrait |
| Inner display (7.6-inch, unfolded) | 2670 × 1878 | Wide landscape |

Apple solves this by drawing the scene for both. Folded, the outer display shows a closer crop of the dunes. Unfolded, the wallpaper widens to show the whole landscape across the inner display. That is why the official set comes as a tall image and a wide image for each of light and dark.

If you only take one file, take the one made for the screen you will use it on. A tall outer-display image stretched across the wide inner display is enlarged about 1.9 times and loses more than half of its height. For the full explanation, see [iPhone Duo wallpaper sizes explained](/blog/iphone-duo-wallpaper-sizes-explained).

## Are the official wallpapers 4K?

No. The files Apple made are sized exactly for each screen: 1398 × 2034 for the outer display and 2670 × 1878 for the inner display. Neither reaches 3840 pixels on the long edge, the usual meaning of 4K. You may see "4K" versions online — those are upscales made by enlarging Apple's files. An upscale can look clean on a bigger screen, but it does not add detail that was not in the original. On iPhone Duo itself, the original files are already pixel-for-pixel sharp.

## Where the official wallpaper comes from

The wallpapers ship on iPhone Duo and are already in the wallpaper gallery when you set up the phone. iOS 27 for other iPhones does not include them. Before launch, they were found inside Apple's developer tools (the iPhone Duo simulator in the Xcode 27.1 beta) and published by Apple news sites such as [9to5Mac](https://9to5mac.com/2026/09/18/download-the-iphone-duos-official-light-and-dark-wallpapers-here/).

**We do not host Apple's wallpapers.** They are Apple's copyrighted artwork: they come with the device for use on it, but they are not free to redistribute. Everything on this site is original artwork made for the iPhone Duo screens.

## How to set the official wallpaper on iPhone Duo

1. Touch and hold the Lock Screen, then tap the **+** button.
2. Scroll to Apple's collections and pick the dunes wallpaper.
3. Choose whether it should follow your appearance (light by day, dark by night).
4. Tap **Add**, then **Set as Wallpaper Pair** to use it on the Home Screen too.

On iPhone Duo, set up each screen while the phone is in that position — folded for the outer display, unfolded for the inner display — so you see the crop you are actually getting.

## Using a downloaded copy on another iPhone

If you saved one of the official images to use on iPhone 18 Pro or an older iPhone, pick the tall outer-display version. It is the closer shape, but the outer display is wider for its height than a normal iPhone, so about a third of the image's width is trimmed from the sides. The wide inner-display version is cut to a narrow vertical slice. [iPhone Duo wallpapers on iPhone 17 and Android](/blog/iphone-duo-wallpaper-on-iphone-17-android) shows the crop screen by screen, and [iPhone Duo wallpapers on Mac, iPad and PC](/blog/iphone-duo-wallpaper-for-mac-ipad-pc) covers bigger screens. Then follow [how to set a wallpaper on iPhone](/blog/how-to-set-wallpaper-on-iphone).

## Original wallpapers with the same mood

If you like the calm, desert-at-dusk feel of the official wallpaper but want something no one else has, these originals from our library have the same kind of quiet landscape:

- [Midnight Blue Desert Dunes](/wallpapers/midnight-blue-desert-dunes-dual-iphone-wallpaper) — smooth sand curves under a minimal night sky, the closest match to the dark version.
- [Monochrome Desert River](/wallpapers/monochrome-desert-river-minimalist-wallpaper) — black dunes with a bright river winding through them.
- [Midnight Peak](/wallpapers/midnight-peak-amoled-duo-wallpaper) — a single snowy peak on true black, for AMOLED fans.
- [Snow Mountain and Moon](/wallpapers/minimal-snow-mountain-moon-landscape-duo-wallpaper) — icy peaks under a soft blue sky.
- [Misty Mountain Pine](/wallpapers/misty-mountain-pine-tree-duo-wallpaper) — rocky peaks fading into cloud.

Each wallpaper page shows the exact resolution and how the image fits the iPhone Duo outer display, the inner display and iPhone 18 Pro before you download. For more in this style, browse the [Minimal](/categories/minimal) and [iOS Inspired](/categories/ios-inspired-wallpapers) categories.
$md$,
  array['iPhone Duo', 'official wallpapers', 'guides'],
  'published',
  'Official iPhone Duo Wallpaper: Light & Dark, Sizes, Download',
  'The official iPhone Duo wallpaper is desert dunes in light and dark. Exact sizes for the outer and inner displays, whether it is 4K, and how to set it.'
)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------
-- Guides for the next searches people make (October 2026). Google's
-- suggestions show "iphone duo wallpaper for iphone 17 / 17 pro max /
-- android", "... for mac / ipad / pc", and Search Console shows "how to
-- check ppi of image iphone". Every crop and scale figure below is worked
-- out from the screen sizes the same way the site's fit check does it.
-- ---------------------------------------------------------------------
insert into public.posts (title, slug, excerpt, content, tags, status, seo_title, seo_description)
values
(
  'How to Use iPhone Duo Wallpapers on iPhone 17, Older iPhones and Android',
  'iphone-duo-wallpaper-on-iphone-17-android',
  'iPhone Duo wallpapers are made for a squarer outer screen and a wide inner one. Here is which file to use on iPhone 17, 17 Pro Max, older iPhones and Android phones, and how much of it gets cropped.',
  $md$
iPhone Duo wallpapers are made for two unusual screens: a 5.4-inch outer display at 1398 × 2034 and a 7.6-inch inner display at 2670 × 1878. Neither is the shape of a regular phone. You can still use them on iPhone 17, an older iPhone or an Android phone — you just need to pick the right file and know what will be cropped.

## The short answer

- **Use the outer-display (tall) version.** It is portrait, like your phone, so it keeps the most of the picture.
- **Expect the sides to be trimmed.** The outer display is wider for its height than a normal iPhone, so about a third of the image's width falls off the edges.
- **Skip the inner-display (wide) version.** On a normal phone only a narrow vertical slice of it fits.

## Why the shapes don't match

| Screen | Resolution | Height ÷ width |
| --- | --- | --- |
| iPhone Duo outer display | 1398 × 2034 | 1.45 |
| iPhone Duo inner display | 2670 × 1878 | 0.70 |
| iPhone 17, iPhone 17 Pro, iPhone 18 Pro | 1206 × 2622 | 2.17 |
| iPhone 17 Pro Max, iPhone 18 Pro Max | 1320 × 2868 | 2.17 |
| iPhone Air | 1260 × 2736 | 2.17 |
| iPhone 16, iPhone 15 | 1179 × 2556 | 2.17 |

Every recent iPhone is about 2.17 times taller than it is wide. iOS always fills the whole screen, so when an image has a different shape it is enlarged until it covers the screen, and whatever hangs over the edges is cut off.

## What happens on iPhone 17 Pro and 17 Pro Max

**The outer-display file (1398 × 2034):**

- On **iPhone 17 and iPhone 17 Pro** (1206 × 2622), iOS enlarges it by about 29% to fill the height. The middle 936 pixels of its width stay on screen and roughly 230 pixels are trimmed from each side.
- On **iPhone 17 Pro Max** (1320 × 2868), it is enlarged by about 41%, with the same third of the width trimmed. At that enlargement, fine detail can look a little soft.

**The inner-display file (2670 × 1878):**

- On iPhone 17 Pro it is enlarged by about 40%, and only the middle 864 pixels of its 2,670-pixel width stay on screen — about a third of the picture.

So the outer-display file is the one to use. If the subject sits in the middle of the wallpaper, it survives the crop. If it sits near the left or right edge, it won't.

## How to set it on your iPhone

1. Save the image to Photos — see [how to save wallpapers to iPhone Photos](/blog/how-to-save-wallpapers-to-iphone-photos).
2. Touch and hold the Lock Screen, tap **+**, then choose **Photos** and pick the image.
3. Drag the picture sideways to choose which part of the width stays on screen, and pinch only if you need to.
4. Tap **Add**, then **Set as Wallpaper Pair**.

Zooming in while framing enlarges the image even more, so keep it to a minimum. If the result looks soft, our [blurry wallpaper guide](/blog/why-is-my-iphone-wallpaper-blurry) covers the usual causes.

## On Android phones

Most Android phones are 19.5:9 or 20:9 — about 2.2 times taller than wide, the same shape as an iPhone — so the same advice applies: use the tall outer-display file and expect the sides to be trimmed. To set it, touch and hold an empty spot on the Home Screen, choose **Wallpaper** (Samsung) or **Wallpaper & style** (Pixel), and pick the image from your gallery.

Book-style foldables such as the Galaxy Z Fold and Pixel Fold are the exception. Their large inner screens are close to square, so there the wide inner-display file is the better choice, with its left and right edges trimmed.

## Be wary of "made for iPhone 17" re-uploads

You will find iPhone Duo wallpapers re-cut to 1206 × 2622 or 1320 × 2868. If they were cropped from the 1398 × 2034 original and enlarged, they hold no more detail than the original — only a bigger file. Downloading the original and letting iOS crop it gives the same result and lets you choose the framing yourself.

## When to pick a wallpaper made for your phone instead

For a pixel-perfect result, choose a wallpaper that is at least as large as your screen and the same tall shape. iPhone 18 Pro and 18 Pro Max have the same screens as iPhone 17 Pro and 17 Pro Max, so the screen-fit check on each of our wallpaper pages applies to your phone too. Browse the wallpapers listed for [iPhone 18 Pro](/devices/iphone-18-pro) and [iPhone 18 Pro Max](/devices/iphone-18-pro-max) and check the fit before you download.

Looking for Apple's own dunes wallpaper? See [the official iPhone Duo wallpaper](/blog/official-iphone-duo-wallpaper). For the numbers behind both iPhone Duo screens, read [iPhone Duo wallpaper sizes explained](/blog/iphone-duo-wallpaper-sizes-explained).
$md$,
  array['iPhone 17', 'compatibility', 'guides'],
  'published',
  'iPhone Duo Wallpaper for iPhone 17, 17 Pro Max & Android',
  'Use iPhone Duo wallpapers on iPhone 17, 17 Pro Max, older iPhones and Android: which file to pick, how much is cropped, and how to set it.'
)
on conflict (slug) do nothing;

insert into public.posts (title, slug, excerpt, content, tags, status, seo_title, seo_description)
values
(
  'iPhone Duo Wallpapers on Mac, iPad and PC: Which File Fits',
  'iphone-duo-wallpaper-for-mac-ipad-pc',
  'The wide iPhone Duo inner-display wallpaper is close to the shape of a MacBook and an iPad in landscape. Here is how well it fits each screen, and how to set it on Mac, iPad and Windows.',
  $md$
iPhone Duo's inner display is wide — 2670 × 1878 — which makes its wallpapers unusually good candidates for a laptop, a tablet or a desktop monitor. Here is which file to use on each screen, how much gets cropped, and when the image will look soft.

## Which file to use

- **Mac, Windows PC and iPad in landscape:** the **inner-display** (wide) file, 2670 × 1878.
- **iPad held upright:** the **outer-display** (tall) file, 1398 × 2034.

The inner display is 1.42 times wider than it is tall. A MacBook is about 1.54, an iPad in landscape about 1.33 to 1.44, and a typical monitor 1.78. Those are close enough that only a thin band is cropped on a Mac or an iPad.

## How it fits on a Mac

| Screen | Resolution | Scaled | Cropped |
| --- | --- | --- | --- |
| MacBook Air 13-inch | 2560 × 1664 | Down 4% — sharp | ~8% of the height |
| MacBook Air 15-inch | 2880 × 1864 | Up 8% | ~8% of the height |
| MacBook Pro 14-inch | 3024 × 1964 | Up 13% | ~8% of the height |
| MacBook Pro 16-inch | 3456 × 2234 | Up 29% — a little soft | ~8% of the height |
| iMac 24-inch | 4480 × 2520 | Up 68% — soft | ~20% of the height |

On a MacBook the crop is small: macOS fills the screen and trims a thin strip from the top and bottom. The 13-inch MacBook Air is the best match — the file is slightly larger than the screen, so it stays pixel-sharp. Bigger screens enlarge it, and the iMac's 4.5K display enlarges it enough that soft edges become visible.

## How it fits on a Windows PC or monitor

| Monitor | Resolution | Scaled | Cropped |
| --- | --- | --- | --- |
| Full HD | 1920 × 1080 | Down 28% — sharp | ~20% of the height |
| QHD / 1440p | 2560 × 1440 | Down 4% — sharp | ~20% of the height |
| 4K UHD | 3840 × 2160 | Up 44% — soft | ~20% of the height |

Monitors are wider than the iPhone Duo inner display, so about a fifth of the image's height is cut. If the subject sits in the middle of the picture, nothing important is lost. On a 4K monitor the file has to be enlarged by 44%, so it will not look as crisp as a true 4K wallpaper.

## How it fits on iPad

An iPad wallpaper rotates with the iPad, so iPadOS crops the image differently in portrait and in landscape.

- **11-inch iPad Air and iPad (2360 × 1640 in landscape):** the inner-display file is almost exactly the same shape — about 1% is cropped, and the file is larger than the screen, so it is pixel-sharp.
- **13-inch iPad Pro (2752 × 2064 in landscape):** enlarged by about 10%, with roughly 6% trimmed from the sides.
- **Held upright:** the outer-display file is the better match. On an 11-inch iPad Air in portrait (1640 × 2360) it is almost the same shape too, enlarged by about 17%.

If you turn your iPad often, a wide image will be cut to a narrow strip whenever it is upright. For one wallpaper that works both ways, choose an image that is square, or close to it, with the subject in the center.

## How to set it

**Mac:** open **System Settings → Wallpaper → Add Photo**, or Control-click the image in Finder and choose **Set Desktop Picture**. Pick **Fill Screen** so it covers the display without black bars.

**Windows:** right-click the image and choose **Set as desktop background**, or go to **Settings → Personalization → Background** and set **Choose a fit** to **Fill**.

**iPad:** save the image to Photos, open **Settings → Wallpaper → Add New Wallpaper**, choose **Photos** and pick the image.

## Check the resolution first

A file smaller than your screen gets enlarged and looks soft — the bigger the screen, the more it shows. Every wallpaper page on this site lists the exact pixel size before you download. For a MacBook, look for a file at least 2560 pixels wide; for a 4K monitor, 3840. Our guide to [wallpaper resolution, 4K and PPI](/blog/iphone-wallpaper-resolution-4k-retina-ppi) explains how to judge it.

Want Apple's own iPhone Duo dunes on your Mac? Read about [the official iPhone Duo wallpaper](/blog/official-iphone-duo-wallpaper). Using a tall iPhone Duo wallpaper on a phone instead? See [iPhone Duo wallpapers on iPhone 17 and Android](/blog/iphone-duo-wallpaper-on-iphone-17-android).
$md$,
  array['Mac', 'iPad', 'guides'],
  'published',
  'iPhone Duo Wallpaper for Mac, iPad & PC: Sizes and Fit',
  'Use iPhone Duo wallpapers on a MacBook, iMac, iPad or Windows PC: which file fits each screen, how much is cropped, and how to set it.'
)
on conflict (slug) do nothing;

insert into public.posts (title, slug, excerpt, content, tags, status, seo_title, seo_description)
values
(
  'How to Check a Photo''s Resolution and PPI on iPhone',
  'how-to-check-image-resolution-ppi-iphone',
  'Your iPhone can show the exact pixel size of any image in a couple of taps. Here is where to find it in Photos and Files, what PPI really means for a picture, and how to tell whether a wallpaper will look sharp.',
  $md$
Before you set a wallpaper — or after one looks soft — it helps to know the image's real size. Your iPhone can tell you in a couple of taps, with no extra app. This guide shows where to look, and why the number that matters is the pixel size, not the PPI.

## In the Photos app

1. Open the image in **Photos**.
2. Swipe up on it, or tap the **ⓘ** button.
3. Read the line under the date and camera details. It shows the megapixels, the pixel size and the file size — for example **5 MP • 2670 × 1878 • 1.9 MB**.

The first number of the pixel size is the width, the second the height. A downloaded image has no camera details, but the pixel size and file size are still shown.

## In the Files app

Downloads from Safari land in **Files → Downloads** first.

1. Open the **Files** app and find the image.
2. Touch and hold it, then tap **Get Info**.
3. Look for **Dimensions**. You will also see the file size and the file type, such as JPEG, PNG or HEIC.

## With a shortcut, for many images at once

The **Shortcuts** app can read the size of any image you share with it:

1. Create a new shortcut and turn on **Show in Share Sheet** in its details.
2. Add the action **Get Details of Images** and set it to **Width**.
3. Add a second **Get Details of Images** action set to **Height**.
4. Add **Show Result** and put the two values in it.

Now choose the shortcut from the Share sheet in Photos or Files, and it shows the width and height without opening the info panel.

## What about PPI?

**PPI (pixels per inch)** is a property of a screen or a print, not of a picture on its own. An image file may carry a "72 dpi" or "300 dpi" tag, but on a phone that tag is ignored: the iPhone draws each pixel of the image on its own screen pixels. Two files with the same pixel size look identical, whatever their DPI tag says.

PPI matters in two cases:

- **Printing.** Divide the pixel width by the print width in inches. A 3000-pixel-wide photo printed 10 inches wide is printed at 300 PPI, the usual target for a sharp print.
- **Your screen.** Divide the screen's diagonal in pixels by its diagonal in inches. The iPhone Duo outer display — 1398 × 2034 at 5.4 inches — works out to about 457 PPI, and the inner display — 2670 × 1878 at 7.6 inches — to about 430 PPI.

## Is the image big enough for a wallpaper?

Compare the image's pixel size with your screen's:

| Screen | Resolution |
| --- | --- |
| iPhone Duo outer display | 1398 × 2034 |
| iPhone Duo inner display | 2670 × 1878 |
| iPhone 17 Pro, iPhone 18 Pro | 1206 × 2622 |
| iPhone 17 Pro Max, iPhone 18 Pro Max | 1320 × 2868 |

- **Both numbers at least as big as the screen, same orientation:** sharp.
- **Up to about 30% smaller:** acceptable, slightly soft up close.
- **Much smaller, or the wrong orientation:** iOS has to enlarge it a lot, and it will look soft or be heavily cropped.

If the pixel size is fine and the wallpaper still looks soft, you may have saved a preview or a screenshot instead of the original, or iCloud Photos may be showing an optimized copy. Our [blurry wallpaper guide](/blog/why-is-my-iphone-wallpaper-blurry) walks through every cause.

For more on what "4K" and "Retina" mean for a phone wallpaper, read [iPhone wallpaper resolution, 4K and PPI explained](/blog/iphone-wallpaper-resolution-4k-retina-ppi). Every wallpaper page on this site shows the exact pixel size and how it fits each screen before you download, so you can skip this check entirely.
$md$,
  array['resolution', 'how-to', 'guides'],
  'published',
  'How to Check an Image''s Resolution & PPI on iPhone',
  'See any image''s exact pixel size on iPhone in Photos or Files, what PPI really means for a picture, and whether it is big enough for a sharp wallpaper.'
)
on conflict (slug) do nothing;
