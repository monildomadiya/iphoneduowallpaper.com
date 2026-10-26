/** Original selection advice for each collection; no claims about a file's unseen contents. */
export const CATEGORY_ADVICE: Record<string, { title: string; paragraphs: string[] }> = {
  "anime-4k": {
    title: "Keep the character clear of the clock",
    paragraphs: [
      "Start with the face and the silhouette. A close portrait can work on the outer screen but lose its expression when the wider inner crop cuts through the head. A scene with extra sky or space around the character gives you more room to reframe it. Check the top of the preview for hair, eyes or lettering hidden by the clock.",
      "Strong outlines help a character stand out, but small text and highly detailed backgrounds can compete with app labels. Try a quieter crop for the Home Screen. The collection's URL includes an older 4K label; use the dimensions on each artwork page to judge the actual download, rather than treating the category address as a resolution promise.",
    ],
  },
  car: {
    title: "Fit the car, not just the centre of the photograph",
    paragraphs: [
      "A side-on car is wide. On a portrait crop, a perfectly centred image can lose both bumpers while keeping only the doors. Before downloading, check whether the wheels and the ends of the body remain visible. A three-quarter view or a car photographed from farther away usually gives a narrow screen more room to work with.",
      "The wider inner screen can preserve more road and scenery, but watch where the fold guide crosses the windscreen or badge. Keep headlights away from clock digits if their glow makes white text disappear. If one composition cannot serve both screens, reframe each crop from the original instead of stretching the car or cropping an already cropped file.",
    ],
  },
  "halloween-wallpaper": {
    title: "Put the Halloween glow where it helps",
    paragraphs: [
      "A glowing pumpkin or moon makes a strong focal point, but it can also sit directly behind the clock. Look for an area of plain night sky above the subject, then compare light and dark clock text. A mostly dark scene is not automatically easy to read: a small lantern can be the brightest spot in exactly the wrong place.",
      "For a Home Screen, inspect the picture behind the bottom rows of apps as well as the centre. Cobwebs, branches and strings of lights can cross several small labels. Keep the detailed scene for the Lock Screen and try a dimmer companion for apps. Preview both screen shapes before saving so the pumpkin, doorway or ghost you chose remains in the visible crop.",
    ],
  },
  "ios-inspired-wallpapers": {
    title: "Check gradients and glass at the size you will use",
    paragraphs: [
      "Glass shapes and smooth gradients can look simple in a thumbnail while showing rings or compression marks at full size. Open the artwork page and inspect the actual file, particularly broad colour transitions. Saving a screenshot or repeatedly re-encoding a downloaded picture can introduce artefacts that were not visible in the gallery preview.",
      "Treat bright orbs and glass edges as focal points when framing. An orb near the edge may disappear on the outer crop; a broad highlight behind app names may reduce readability. Compare the two previews, leave a calm region behind the clock and choose the file whose dimensions suit your screen. An iOS-inspired design describes a visual style, not an official Apple wallpaper.",
    ],
  },
  landscape: {
    title: "Choose a horizon that survives both crops",
    paragraphs: [
      "A landscape photograph often places its story across the width: a mountain on one side, a tree on the other and a path between them. The outer screen may keep only the middle of that scene. Choose which subject matters before moving the crop, and check that a coastline, summit or lone tree is not clipped at the edge.",
      "On the inner display, inspect the horizon and the fold position together. A tiny subject at the centre can be harder to notice than a broad mountain range or dune. Leave some quieter sky for the clock, and check whether a bright sun sits behind the digits. Start again from the original when making a second crop so you keep as much surrounding scenery as possible.",
    ],
  },
  minimal: {
    title: "Use empty space deliberately",
    paragraphs: [
      "Minimal does not have to mean an empty screen. One shape, a soft colour change or a small off-centre subject can give the wallpaper character while leaving room for information. Look at the area behind your most-used widgets and app labels, rather than judging the picture only as a full-screen composition.",
      "Pale backgrounds often suit darker text, while deep backgrounds can suit lighter text; a gradient may need different choices in different areas. Check the clock and app-label regions separately. Keep a small accent away from crop boundaries, and compare the wide and tall versions before downloading. A larger file can improve the available detail, but it cannot fix a focal point hidden under an icon.",
    ],
  },
};
