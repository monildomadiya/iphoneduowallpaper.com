import { DE_ABOUT, DE_CONTACT } from "@/lib/i18n/de-pages";
import { DE_LISTING, DE_TAXONOMY } from "@/lib/i18n/de-taxonomy";
import { DE_WALLPAPER } from "@/lib/i18n/de-wallpaper";
import { DE_SEARCH } from "@/lib/i18n/search-strings";
import type { LocaleContent } from "@/lib/i18n/types";

/**
 * German. Search Console shows Germany at 142 clicks on English pages. Copy says Hintergrundbild,
 * the word people search and the name of iOS's own Settings menu. Only the most-downloaded
 * wallpapers have a page here, so the others link to English and say so.
 */
export const DE: LocaleContent = {
  locale: "de",
  name: "Deutsch",
  ogLocale: "de_DE",
  chrome: {
    locale: "de",
    homeHref: "/de",
    homeLabel: "Startseite",
    searchPath: "/de/search",
    nav: [
      { href: "/de/wallpapers", label: "Hintergrundbilder", icon: "wallpapers" },
      { href: "/de/categories", label: "Kategorien", icon: "categories" },
      { href: "/de/devices", label: "Geräte", icon: "devices" },
      { href: "/de/maker", label: "Editor", icon: "maker" },
    ],
    header: {
      skip: "Zum Inhalt springen",
      home: "{site} Startseite",
      search: "Suchen…",
      searchLabel: "Hintergrundbilder suchen",
      searchPlaceholder: "Hintergrundbilder suchen…",
      openMenu: "Menü öffnen",
      closeMenu: "Menü schließen",
      close: "Schließen",
      closeSearch: "Suche schließen",
      quickLinks: "Schnellzugriff",
      menuLinks: [
        { href: "/de/about", label: "Über uns" },
        { href: "/de/contact", label: "Kontakt" },
        { href: "/privacy-policy", label: "Datenschutz" },
        { href: "/terms", label: "Nutzungsbedingungen" },
      ],
    },
    quickLinks: [
      { href: "/de/wallpapers?sort=popular", label: "Meistgeladene Hintergrundbilder" },
      { href: "/de/maker", label: "iPhone Duo Hintergrundbild-Editor" },
      { href: "/de/categories/dark", label: "Dunkle & AMOLED Hintergrundbilder" },
      { href: "/de/categories/landscape", label: "Landschafts-Hintergrundbilder" },
      { href: "/de/devices/iphone-duo-inner-display", label: "iPhone Duo Innendisplay" },
      { href: "/de/devices/iphone-duo-outer-display", label: "iPhone Duo Außendisplay" },
    ],
    footer: {
      disclaimer:
        "{site} ist eine unabhängige Website und steht in keiner Verbindung zu Apple Inc., wird weder von Apple unterstützt noch gesponsert. iPhone, iPhone Duo und iOS sind in den USA und anderen Ländern eingetragene Marken von Apple Inc. und werden hier nur zur Angabe der Gerätekompatibilität verwendet. Die Hintergrundbilder sind für die private, nicht kommerzielle Nutzung bestimmt.",
      groups: [
        {
          title: "Entdecken",
          links: [
            { href: "/de/wallpapers", label: "Alle Hintergrundbilder" },
            { href: "/de/wallpapers?sort=popular", label: "Meistgeladen" },
            { href: "/de/categories", label: "Kategorien" },
            { href: "/de/categories/dark", label: "Dunkel & AMOLED" },
            { href: "/de/categories/landscape", label: "Landschaft" },
            { href: "/de/maker", label: "Hintergrundbild-Editor" },
          ],
        },
        {
          title: "Geräte",
          links: [
            { href: "/de/devices/iphone-duo-outer-display", label: "iPhone Duo Außendisplay" },
            { href: "/de/devices/iphone-duo-inner-display", label: "iPhone Duo Innendisplay" },
            { href: "/de/devices/iphone-18-pro-max", label: "iPhone 18 Pro Max" },
            { href: "/de/devices/iphone-18-pro", label: "iPhone 18 Pro" },
          ],
        },
        {
          title: "Anleitungen",
          links: [
            { href: "/de/blog", label: "Alle Anleitungen" },
            { href: "/de/blog/official-iphone-duo-wallpaper", label: "Offizielles iPhone Duo Hintergrundbild" },
            { href: "/de/blog/iphone-duo-wallpaper-sizes-explained", label: "Hintergrundbild-Größen" },
            { href: "/de/about", label: "Über uns" },
            { href: "/de/contact", label: "Kontakt" },
          ],
        },
        {
          title: "Rechtliches",
          links: [
            { href: "/privacy-policy", label: "Datenschutzerklärung" },
            { href: "/terms", label: "Nutzungsbedingungen" },
            { href: "/cookie-policy", label: "Cookie-Richtlinie" },
            { href: "/disclaimer", label: "Haftungsausschluss" },
            { href: "/dmca", label: "DMCA und Urheberrecht" },
          ],
        },
      ],
      rights: "Alle Rechte vorbehalten.",
      languages: "Sprachen",
    },
  },
  cookies: {
    label: "Cookie-Hinweis",
    before: "Wir verwenden Cookies, damit die Seite funktioniert, um Besuche zu messen und um Werbung von Partnern wie Google anzuzeigen. Details findest du in unserer ",
    between: " und unserer ",
    after: ".",
    cookiePolicy: "Cookie-Richtlinie",
    privacyPolicy: "Datenschutzerklärung",
    accept: "Verstanden",
  },
  home: {
    title: "iPhone Duo Hintergrundbilder — Kostenlos in HD laden",
    description: "Kostenlose iPhone Duo Hintergrundbilder in HD für das 5,4-Zoll-Außendisplay und das 7,6-Zoll-Innendisplay des iPhone 18 Duo. Ohne App, ohne Anmeldung.",
    fourK: {
      title: "iPhone Duo Hintergrundbilder 4K — Kostenlos laden",
      description: "Kostenlose 4K-Hintergrundbilder in nativer Größe für das iPhone Duo (iPhone 18 Duo): 1398×2034 außen, 2670×1878 innen. Fertige Paare, ohne Anmeldung.",
      h1: "iPhone Duo Hintergrundbilder,",
      h1Accent: "4K.",
      intro: "Fertige Paare für das 5,4-Zoll-Außendisplay und das 7,6-Zoll-Innendisplay, dazu Größen für das iPhone 18 Pro.",
      fullResolution: "4K, native Größen",
      faqAnswer:
        "Ja. Jedes Hintergrundbild hat eine 4K-Masterdatei (3840 Pixel an der langen Kante) und fertige Dateien in der nativen Größe jedes Displays: 1398 × 2034 außen, 2670 × 1878 innen, dazu iPhone 18 Pro und Pro Max. Die meisten Masterdateien wurden per KI aus dem Originalbild hochskaliert; auf jeder Seite steht das in den Details.",
    },
    badgeNew: "Neu",
    badge: "Gemacht für das iPhone Duo",
    h1: "iPhone Duo Hintergrundbilder,",
    h1Accent: "für zwei Displays.",
    intro: "Eigene Designs in voller Auflösung für das 5,4-Zoll-Außendisplay, das 7,6-Zoll-Innendisplay und das iPhone 18 Pro.",
    browse: "Hintergrundbilder ansehen",
    explore: "Kategorien entdecken",
    stats: {
      wallpapers: "{n} Hintergrundbilder",
      fullResolution: "Volle Auflösung",
      free: "Kostenlos, ohne Anmeldung",
      original: "Eigene Werke & lizenziert",
    },
    featured: ["Empfohlen.", "Von Hand ausgewählt."],
    latest: ["Neueste.", "Frisch aus dem Studio."],
    categories: ["Kategorien.", "Finde deinen Stil."],
    guides: ["Anleitungen.", "Auf Deutsch."],
    viewAll: "Alle ansehen",
    makerTitle: "Mach dein eigenes.",
    makerBody:
      "Mach aus jedem Foto ein Paar für beide Displays: 1398 × 2034 für außen, 2670 × 1878 für innen, jeweils passend zugeschnitten. Kostenlos, und dein Foto verlässt nie dein Gerät.",
    makerCta: "Hintergrundbild-Editor öffnen",
    aboutTitle: "Hintergrundbilder für die beiden Displays des iPhone Duo.",
    about: `Das iPhone Duo, oft auch als iPhone 18 Duo oder iPhone Fold gesucht, hat zwei Displays mit ganz unterschiedlichen Formen: ein schmales 5,4-Zoll-Außendisplay mit 1398 × 2034 Pixel und ein breites 7,6-Zoll-Innendisplay mit 2670 × 1878 Pixel, das sich wie ein kleines Tablet aufklappen lässt. Ein Hintergrundbild für ein normales iPhone verliert außen oben und unten einen Streifen und innen deutlich mehr.

Jedes Hintergrundbild hier lädst du kostenlos in HD und in Originalauflösung herunter, und vor dem Speichern siehst du, wie es auf das [Außendisplay](/de/devices/iphone-duo-outer-display) und das [Innendisplay](/de/devices/iphone-duo-inner-display) passt. Du bist dir bei der Größe nicht sicher? Lies unsere Anleitung zu den [iPhone Duo Hintergrundbild-Größen](/de/blog/iphone-duo-wallpaper-sizes-explained). Du suchst Apples offizielles Hintergrundbild mit den Wüstendünen? Das erklären wir in der Anleitung zum [offiziellen iPhone Duo Hintergrundbild](/de/blog/official-iphone-duo-wallpaper).

Die meistgeladenen Hintergrundbilder haben eine deutsche Seite, die übrigen Seiten sind vorerst auf Englisch. Download und Display-Check funktionieren dort genauso.`,
    faqTitle: ["Noch Fragen?", "Hier sind die Antworten."],
    faq: [
      {
        question: "Sind die Hintergrundbilder kostenlos?",
        answer: "Ja. Jedes Hintergrundbild kannst du kostenlos für die private Nutzung auf deinen eigenen Geräten herunterladen, ohne Konto und ohne App. Kommerzielle Nutzung und Weiterverbreitung sind nicht erlaubt.",
      },
      {
        question: "Passen diese Hintergrundbilder auf Innen- und Außendisplay des iPhone Duo?",
        answer:
          "Jede Hintergrundbild-Seite zeigt, wie das Bild auf das iPhone Duo Außendisplay (1398 × 2034), das aufgeklappte Innendisplay (2670 × 1878) und die iPhone 18 Pro Modelle passt, damit du vor dem Download das richtige auswählen kannst.",
      },
      {
        question: "Ist das iPhone Duo dasselbe wie iPhone 18 Duo oder iPhone Fold?",
        answer:
          "Ja, das sind alles Namen für dasselbe faltbare iPhone. Es hat ein 5,4-Zoll-Außendisplay (1398 × 2034) für den zugeklappten Zustand und ein 7,6-Zoll-Innendisplay (2670 × 1878), das sich wie ein kleines Tablet aufklappen lässt. Jedes Hintergrundbild hier wird auf beiden Displays geprüft.",
      },
      {
        question: "Wo finde ich das offizielle iPhone Duo Hintergrundbild?",
        answer:
          "Apples offizielles iPhone Duo Hintergrundbild zeigt Wüstendünen vor einer Bergkette, in einer hellen und einer dunklen Version, und ist auf dem iPhone Duo vorinstalliert. Es ist urheberrechtlich geschütztes Werk von Apple, deshalb bieten wir es nicht an; unsere Anleitung zum offiziellen Hintergrundbild erklärt die Größen und die Einrichtung. Alle Hintergrundbilder auf dieser Seite sind eigene Werke für dieselben zwei Displays.",
      },
      {
        question: "Sind diese Hintergrundbilder in 4K?",
        answer:
          "Noch nicht; die Sammlung ist derzeit HD. Jedes Hintergrundbild erscheint in seiner Originalauflösung, und seine Seite zeigt die genauen Pixelmaße mit einem Qualitätslabel (4K nur bei Dateien ab 3840 Pixel an der langen Kante) und die Passform auf jedem Display. So siehst du vor dem Download, wie scharf es auf dem 7,6-Zoll-Innendisplay (2670 × 1878) wird.",
      },
      {
        question: "Wie stelle ich auf dem iPhone ein Hintergrundbild ein?",
        answer:
          "Sichere das Bild in „Fotos“ und füge dann unter Einstellungen → Hintergrundbild ein neues hinzu, oder lege den Finger auf den Sperrbildschirm und tippe auf die Taste +. Auf dem iPhone landen Downloads zuerst unter Dateien → Downloads; verschiebe das Bild in „Fotos“, bevor du danach suchst.",
      },
      {
        question: "Besteht eine Verbindung zu Apple?",
        answer: "Nein. Dies ist eine unabhängige Fan- und Designseite. iPhone und iPhone Duo sind Marken von Apple Inc. und werden hier nur zur Angabe der Gerätekompatibilität verwendet.",
      },
    ],
  },
  maker: {
    title: "iPhone Duo Hintergrundbild-Editor — Außen und innen",
    description: "Mach aus jedem Foto ein iPhone Duo Hintergrundbild: Zuschnitt für außen (1398 × 2034) und innen (2670 × 1878), beide herunterladen. Kostenlos im Browser.",
    eyebrow: "Kostenloses Tool",
    h1: "iPhone Duo Hintergrundbild-Editor",
    lead: "Mach aus jedem Foto ein Paar für die beiden Displays des iPhone Duo: eine schmale Datei für außen und eine breite für innen, kostenlos in deinem Browser.",
    breadcrumb: "Hintergrundbild-Editor",
    stepsTitle: ["So funktioniert’s.", "Vier Schritte, zwei Displays."],
    step: "Schritt {n}",
    steps: [
      {
        title: "Foto auswählen",
        body: "Wähle ein beliebiges Bild von deinem Handy oder Computer oder öffne eines unserer Hintergrundbilder von seiner Seite aus im Editor. Nichts wird hochgeladen; der Zuschnitt passiert in deinem Browser.",
      },
      {
        title: "Ausschnitt für jedes Display wählen",
        body: "Zieh das Bild in jeder Vorschau und nutze den Zoom. Das schmale Außendisplay und das breite Innendisplay werden getrennt zugeschnitten, damit das Motiv auf beiden richtig sitzt.",
      },
      {
        title: "Schärfe prüfen",
        body: "Unter jeder Vorschau zeigt dir der Editor, ob dein Foto genug Pixel für dieses Display hat oder vergrößert werden muss. Es ist derselbe Check wie auf jeder Hintergrundbild-Seite.",
      },
      {
        title: "Beide Dateien herunterladen",
        body: "Du bekommst zwei Dateien: 1398 × 2034 für außen und 2670 × 1878 für innen, mit Namen, die du in „Fotos“ leicht unterscheiden kannst.",
      },
    ],
    whyTitle: "Warum das iPhone Duo zwei Hintergrundbild-Dateien braucht",
    why: `Das 5,4-Zoll-Außendisplay ist mit 1398 × 2034 Pixel schmal und hochkant. Klappst du das Handy auf, ist das 7,6-Zoll-Innendisplay mit 2670 × 1878 Pixel breiter als hoch. Ein einziges Bild füllt nicht beide gut aus: Ein Hochformat-Foto behält innen nur einen mittleren Streifen, ein Querformat-Foto schrumpft außen auf einen schmalen Ausschnitt.

Der Editor schneidet für jedes Display getrennt in dessen genauer Auflösung zu, sodass iOS das Bild Pixel für Pixel anzeigt, statt es zu vergrößern. Das beste Ergebnis bekommst du mit einem Foto ab 2670 Pixel Breite. Halte das Motiv im äußeren Zuschnitt mittig und schiebe es innen etwas von der Mittellinie weg, an der das Handy faltet. Mehr dazu in unserer Anleitung zu den [iPhone Duo Hintergrundbild-Größen](/de/blog/iphone-duo-wallpaper-sizes-explained).

Fertig? [Entdecke weitere Hintergrundbilder](/de/wallpapers), die für beide Displays gemacht sind.`,
    faqTitle: ["Noch Fragen?", "Rund um den Editor."],
    faq: [
      {
        question: "Ist der iPhone Duo Hintergrundbild-Editor kostenlos?",
        answer: "Ja. Du brauchst kein Konto, es gibt kein Wasserzeichen und keine Begrenzung, wie viele Hintergrundbilder du erstellst. Was du aus deinen eigenen Fotos machst, kannst du nutzen, wie du möchtest.",
      },
      {
        question: "Wird mein Foto irgendwo hochgeladen?",
        answer: "Nein. Dein Browser öffnet das Foto auf deinem Gerät und schneidet es dort zu, und die fertigen Dateien werden direkt von dort gespeichert. Nichts wird an unseren Server geschickt.",
      },
      {
        question: "In welchen Größen exportiert der Editor?",
        answer: "Genau 1398 × 2034 Pixel für das iPhone Duo Außendisplay und 2670 × 1878 Pixel für das Innendisplay, als JPG oder PNG. In diesen Größen zeigt iOS das Bild Pixel für Pixel an, ohne es zu vergrößern.",
      },
      {
        question: "Warum sagt der Editor, dass mein Foto weich aussehen wird?",
        answer: "Der gewählte Bereich hat weniger Pixel als das Display, also muss das Bild vergrößert werden. Zoome heraus oder nimm ein größeres Original: Mindestens 2670 Pixel Breite reichen für innen, mindestens 2034 Pixel Höhe für außen.",
      },
      {
        question: "Welche Bildformate kann ich verwenden?",
        answer: "JPG, PNG und WebP funktionieren in allen modernen Browsern. Wählst du auf dem iPhone ein Foto aus der Mediathek, gibt iOS es dem Browser meist als JPG weiter, deshalb funktionieren dort auch HEIC-Fotos.",
      },
      {
        question: "Wie stelle ich die beiden Dateien auf dem iPhone Duo ein?",
        answer: "Sichere beide Dateien in „Fotos“, lege den Finger auf den Sperrbildschirm, tippe auf die Taste +, wähle „Fotos“ und dann die Datei für dieses Display.",
      },
    ],
    ui: {
      outerName: "Außendisplay",
      outerHint: "Zugeklappt · 5,4 Zoll",
      innerName: "Innendisplay",
      innerHint: "Aufgeklappt · 7,6 Zoll",
      previewLabel: "Vorschau",
      formatLabel: "Dateiformat",
      modeLock: "Sperrbildschirm",
      modeHome: "Home-Bildschirm",
      modeClean: "Nur Bild",
      pixelPerfect: "Pixelgenau",
      pixelPerfectNote: "Zum Einpassen verkleinert, bleibt scharf.",
      greatFit: "Passt sehr gut",
      slightlySoft: "Etwas weich",
      soft: "Weich",
      enlarged: "Um {n} % vergrößert, um das Display zu füllen.",
      fixZoomOut: "Zoome heraus oder nimm ein größeres Foto.",
      fixLarger: "Ein größeres Foto wird schärfer.",
      zoom: "Zoom",
      reset: "Ausschnitt für {screen} zurücksetzen",
      dragHint: "Vorschau {screen}. Zieh das Bild oder nutze die Pfeiltasten, um es zu verschieben.",
      emptyHint: "Wähle ein Foto, um zu sehen, wie scharf es auf diesem Display wird.",
      downloadOuter: "Außendisplay laden",
      downloadInner: "Innendisplay laden",
      choose: "Foto auswählen",
      change: "Foto ändern",
      loading: "Hintergrundbild wird geladen…",
      dropHint: "Oder zieh ein Bild hierher. Es verlässt dein Gerät nicht.",
      pixels: "{w} × {h} Pixel",
      downloadBoth: "Beide herunterladen",
      preparing: "Wird vorbereitet…",
      exportNote: "Exportiert genau in {outer} und {inner}. Dein Foto wird nie hochgeladen.",
      loadFailed: "Dieses Hintergrundbild konnte nicht geladen werden. Wähle stattdessen ein Foto.",
      notImage: "Diese Datei ist kein Bild.",
      tooLarge: "Dieses Foto ist größer als 40 MB. Wähle ein kleineres.",
      cantOpen: "Dieser Browser kann das Bild nicht öffnen. Versuche es mit JPG, PNG oder WebP.",
      exportFailed: "Das Hintergrundbild konnte nicht erstellt werden. Versuche es noch einmal oder wähle ein anderes Foto.",
    },
  },
  blog: {
    title: "iPhone Duo Hintergrundbild-Anleitungen",
    description: "Anleitungen auf Deutsch zu iPhone Duo Hintergrundbildern: Apples offizielles Bild, die Größen für außen und innen und wie du ein scharfes Bild findest.",
    breadcrumb: "Anleitungen",
    h1: "Anleitungen auf Deutsch.",
    lead: "Alles, was du wissen musst, damit dein Hintergrundbild auf beiden Displays des iPhone Duo scharf aussieht.",
    by: "Von der",
    team: "{author}",
    minRead: "{n} Min. Lesezeit",
    toc: "In dieser Anleitung",
    english: "Auf Englisch lesen",
    more: ["Weitere Anleitungen.", "Auf Deutsch."],
    wallpapers: ["Hintergrundbilder zum Ausprobieren.", "Neu in der Sammlung."],
  },
  guides: [
    {
      slug: "official-iphone-duo-wallpaper",
      title: "Offizielles iPhone Duo Hintergrundbild: helle und dunkle Dünen, Größen und Bezug",
      seoTitle: "Offizielles iPhone Duo Hintergrundbild: Hell und Dunkel",
      description: "Das offizielle iPhone Duo Hintergrundbild zeigt Wüstendünen in Hell und Dunkel. Die genauen Größen für außen und innen, ob es 4K ist und wie du es einstellst.",
      excerpt: "Apple hat für das iPhone Duo vier Hintergrundbilder vorbereitet: Wüstendünen unter einer Bergkette, in Hell und Dunkel. Wie sie aussehen, die genauen Größen für jedes Display, woher sie stammen und wie du sie einstellst.",
      tags: ["iPhone Duo", "offizielle Hintergrundbilder"],
      published: "2026-11-03",
      content: `Als Apple das iPhone Duo vorstellte, sein erstes faltbares iPhone, zeigte es dazu ein neues Hintergrundbild: weite Wüstendünen vor einer schroffen Bergkette. Die meisten, die nach „iPhone Duo Hintergrundbild“ suchen, haben genau dieses Bild im Kopf. Diese Anleitung erklärt, wie das offizielle Hintergrundbild aussieht, welche Größen es für jedes Display hat, woher die Dateien stammen und wie du denselben Look auf deinem jetzigen Handy bekommst.

## Wie sieht das offizielle iPhone Duo Hintergrundbild aus?

Es gibt **vier** offizielle Bilder: zwei für den hellen und zwei für den dunklen Modus.

- **Die hellen Versionen** zeigen die Dünen bei Tag: warmer beiger Sand unter einem blassblauen Himmel.
- **Die dunklen Versionen** zeigen dieselbe Landschaft bei Nacht: tiefe Schatten, ein Himmel voller Sterne und ein sanftes Leuchten am Horizont.

Wie die meisten neueren Hintergrundbilder von Apple wechselt auch dieses Paar mit deinem Erscheinungsbild: hell am Tag, dunkel bei Nacht oder im Dunkelmodus.

## Warum gibt es für jede Version zwei Dateien?

Das iPhone Duo hat zwei Displays mit sehr unterschiedlichen Formen, deshalb kann ein einzelnes Bild nicht beide ausfüllen:

| Display | Auflösung | Form |
| --- | --- | --- |
| Außendisplay (5,4 Zoll, zugeklappt) | 1398 × 2034 | Schmal, Hochformat |
| Innendisplay (7,6 Zoll, aufgeklappt) | 2670 × 1878 | Breit, Querformat |

Apple löst das, indem es die Szene für beide Displays zeichnet. Ist das Handy zugeklappt, zeigt das Außendisplay einen engeren Ausschnitt der Dünen. Beim Aufklappen wird das Hintergrundbild breiter und breitet die ganze Landschaft auf dem Innendisplay aus. Deshalb gibt es das offizielle Set sowohl in Hell als auch in Dunkel mit je einem schmalen und einem breiten Bild.

Wenn du nur eine Datei speicherst, nimm die für das Display, das du nutzen willst. Ein schmales Außenbild wird auf dem breiten Innendisplay etwa 1,9-fach vergrößert und verliert mehr als die Hälfte seiner Höhe. Die ganze Erklärung findest du in der Anleitung zu den [iPhone Duo Hintergrundbild-Größen](/de/blog/iphone-duo-wallpaper-sizes-explained).

## Sind die offiziellen Hintergrundbilder in 4K?

Nein. Apples Dateien haben genau die Größe des jeweiligen Displays: 1398 × 2034 für außen und 2670 × 1878 für innen. Keine erreicht die 3840 Pixel an der langen Kante, die 4K üblicherweise meint. Im Netz findest du vielleicht „4K“-Versionen, das sind vergrößerte Kopien von Apples Dateien. Ein vergrößertes Bild kann auf einem größeren Bildschirm sauber wirken, enthält aber keine Details, die das Original nicht hatte. Auf dem iPhone Duo selbst sind die Originaldateien ohnehin pixelgenau scharf.

## Woher stammt das offizielle Hintergrundbild?

Die Hintergrundbilder sind auf dem iPhone Duo vorinstalliert und nach der Einrichtung in der Hintergrundbild-Galerie zu finden. iOS 27 für andere iPhones enthält sie nicht. Vor dem Start tauchten sie in Apples Entwicklertools auf (im iPhone Duo Simulator der Xcode 27.1 Beta) und wurden von Apple-Newsseiten wie [9to5Mac](https://9to5mac.com/2026/09/18/download-the-iphone-duos-official-light-and-dark-wallpapers-here/) veröffentlicht.

**Wir bieten Apples Hintergrundbilder nicht an.** Sie sind urheberrechtlich geschützte Werke von Apple: Sie gehören zum Gerät und sind für die Nutzung darauf gedacht, dürfen aber nicht frei weiterverbreitet werden. Alles auf dieser Seite sind eigene Werke für die Displays des iPhone Duo.

## So stellst du das offizielle Hintergrundbild auf dem iPhone Duo ein

1. Lege den Finger auf den Sperrbildschirm und tippe dann auf die Taste **+**.
2. Scrolle zu Apples Sammlungen und wähle das Dünen-Hintergrundbild aus.
3. Lege fest, ob es dem Erscheinungsbild folgen soll (hell am Tag, dunkel bei Nacht).
4. Tippe auf **Hinzufügen** und nutze es auch für den Home-Bildschirm.

Stelle auf dem iPhone Duo jedes Display in der passenden Haltung ein, außen zugeklappt und innen aufgeklappt. So siehst du den Zuschnitt, den du tatsächlich bekommst.

## Eine heruntergeladene Kopie auf einem anderen iPhone nutzen

Wenn du eines der offiziellen Bilder für ein iPhone 18 Pro oder ein älteres iPhone gespeichert hast, wähle die schmale Version für das Außendisplay. Die Form kommt dem näher, aber das Außendisplay ist im Verhältnis zur Höhe breiter als ein normales iPhone, deshalb geht seitlich etwa ein Drittel der Bildbreite verloren. Die breite Version für das Innendisplay schrumpft dagegen auf einen schmalen Streifen. Folge dann der Anleitung [Hintergrundbild auf dem iPhone einstellen](/blog/how-to-set-wallpaper-on-iphone) (auf Englisch).

## Eigene Hintergrundbilder mit derselben Stimmung

Wenn dir die Ruhe der Wüste im offiziellen Hintergrundbild gefällt, du aber etwas möchtest, das nicht jeder hat, bieten diese eigenen Werke aus unserer Sammlung dieselbe ruhige Landschaft:

- [Mitternachtsblaue Wüstendünen](/de/wallpapers/midnight-blue-desert-dunes-dual-iphone-wallpaper): weiche Sandkurven unter einem klaren Nachthimmel, am nächsten an der dunklen Version.
- [Monochromer Wüstenfluss](/de/wallpapers/monochrome-desert-river-minimalist-wallpaper): schwarze Dünen, durch die sich ein heller Fluss schlängelt.
- [Mitternachtsgipfel AMOLED](/de/wallpapers/midnight-peak-amoled-duo-wallpaper): für AMOLED-Fans, ein einzelner Schneegipfel auf reinem Schwarz.
- [Schneeberg und Mond](/de/wallpapers/minimal-snow-mountain-moon-landscape-duo-wallpaper): vereiste Gipfel unter einem sanften blauen Himmel.
- [Kiefer im Bergnebel](/de/wallpapers/misty-mountain-pine-tree-duo-wallpaper): felsige Gipfel, die sich in den Wolken verlieren.

Jede Hintergrundbild-Seite zeigt vor dem Download die genaue Auflösung und wie das Bild auf Außen- und Innendisplay des iPhone Duo und auf das iPhone 18 Pro passt. Mehr in diesem Stil findest du in der Kategorie [Landschaft](/de/categories/landscape), Nachtszenen wie die dunkle Version unter [Dunkel & AMOLED](/de/categories/dark). Du möchtest dein eigenes Foto nutzen? Der [iPhone Duo Hintergrundbild-Editor](/de/maker) schneidet es für beide Displays zu.`,
    },
    {
      slug: "iphone-duo-wallpaper-sizes-explained",
      title: "iPhone Duo Hintergrundbild-Größen: Außendisplay und Innendisplay",
      seoTitle: "iPhone Duo Hintergrundbild-Größe: Außen und innen",
      description: "Die genauen Auflösungen von Außendisplay (1398 × 2034) und Innendisplay (2670 × 1878) des iPhone Duo und einfache Regeln für ein scharfes Bild auf beiden.",
      excerpt: "Das iPhone Duo hat zwei Displays mit sehr unterschiedlichen Formen. Hier sind die genauen Auflösungen und einfache Regeln für Hintergrundbilder, die auf beiden scharf aussehen.",
      tags: ["iPhone Duo", "Auflösung"],
      published: "2026-11-03",
      content: `Das iPhone Duo ist Apples erstes faltbares iPhone und hat **zwei Displays**: ein 5,4-Zoll-Außendisplay für den zugeklappten Zustand und ein 7,6-Zoll-Innendisplay, das sich wie ein Buch aufklappen lässt. Weil die beiden in unterschiedlichen Ausrichtungen genutzt werden, kann ein Hintergrundbild, das auf dem einen perfekt aussieht, auf dem anderen beschnitten wirken. Diese Anleitung erklärt die Zahlen und gibt dir ein paar einfache Regeln.

## Displayauflösungen auf einen Blick

| Display | Größe | Auflösung (in Nutzung) | Format |
| --- | --- | --- | --- |
| iPhone Duo Außendisplay | 5,4 Zoll | 1398 × 2034 px | Hochformat (schmal) |
| iPhone Duo Innendisplay | 7,6 Zoll | 2670 × 1878 px | Querformat (breit, aufgeklappt) |
| iPhone 18 Pro Max | 6,9 Zoll | 1320 × 2868 px | Hochformat |
| iPhone 18 Pro | 6,3 Zoll | 1206 × 2622 px | Hochformat |

Datenblätter nennen das Innendisplay oft 1878 × 2670. Das ist dasselbe Panel: Beim Aufklappen des iPhone Duo steht das Scharnier senkrecht und das Display liegt quer, deshalb schreiben wir 2670 × 1878.

## Regel 1: Die Auflösung erreichen oder übertreffen

Ein Hintergrundbild sollte in beiden Richtungen **mindestens** so groß sein wie das Display. Kleinere Bilder werden gestreckt und wirken weich. Jedes Hintergrundbild auf dieser Seite zeigt seine genaue Auflösung, du kannst sie also vor dem Download prüfen.

## Regel 2: Die richtige Form für jedes Display wählen

- **Außendisplay:** Wähle schmale Hintergrundbilder im Hochformat. Alles ab 1398 × 2034 oder länger passt problemlos.
- **Innendisplay:** Wähle breite Hintergrundbilder oder ein **quadratisches** Bild. Ein quadratisches Bild (zum Beispiel 2670 × 2670) lässt iOS beim Drehen des aufgeklappten Handys Spielraum für einen neuen Ausschnitt.
- **Dasselbe Bild auf beiden:** Designs mit einem klaren Motiv in der Mitte, etwa ein Planet, eine Blume oder eine Kugel mit Farbverlauf, lassen sich auf beide Formen elegant zuschneiden.

Wenn du dein eigenes Foto nutzen willst, erledigt der [iPhone Duo Hintergrundbild-Editor](/de/maker) beide Zuschnitte für dich, jeweils in der genauen Größe.

## Regel 3: Auf Falz und Uhr achten

Auf dem Innendisplay verläuft die Faltlinie genau durch die Mitte. Hintergrundbilder mit einer starken senkrechten Linie genau in der Mitte können die Falz deutlicher zeigen, deshalb sehen Motive außerhalb der Mitte meist besser aus. Lass auf dem Sperrbildschirm oben etwas Platz für Uhr und Widgets.

## Regel 4: Hochwertige Formate bevorzugen

JPEG und PNG funktionieren überall. PNG hält einfarbige Flächen und Verläufe frei von Streifenbildung, JPEG hält Fotos klein. Vermeide Screenshots von Hintergrundbildern: Sie verlieren an Qualität und enthalten Bedienelemente.

## Kurze Checkliste

1. Prüfe die Auflösung des Hintergrundbilds auf seiner Seite.
2. Nimm für außen ein Bild im Hochformat, für innen ein breites oder quadratisches.
3. Halte das Hauptmotiv auf dem Innendisplay von der genauen Mittellinie fern.
4. Lade die Originaldatei herunter, statt die Vorschau zu speichern.

Entdecke unsere [Hintergrundbilder für das iPhone Duo Innendisplay](/de/devices/iphone-duo-inner-display) und [für das Außendisplay](/de/devices/iphone-duo-outer-display); alle werden vor der Veröffentlichung auf ihre Größe geprüft. Du suchst das Hintergrundbild von Apple? Lies die Anleitung zum [offiziellen iPhone Duo Hintergrundbild](/de/blog/official-iphone-duo-wallpaper).`,
    },
  ],
  wallpaper: DE_WALLPAPER,
  listing: DE_LISTING,
  taxonomy: DE_TAXONOMY,
  search: DE_SEARCH,
  notFound: {
    eyebrow: "Fehler 404",
    h1: "Diese Seite wurde zusammengefaltet.",
    body: "Die gesuchte Seite gibt es nicht oder sie wurde verschoben. Versuch es mit einem dieser Links.",
    home: "Zur Startseite",
    browse: "Hintergrundbilder ansehen",
    english: "Diese Seite auf Englisch ansehen",
  },
  about: DE_ABOUT,
  contact: DE_CONTACT,
};
