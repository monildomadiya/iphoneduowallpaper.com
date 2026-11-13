import type { AboutStrings, ContactStrings } from "@/lib/i18n/types";

export const DE_ABOUT: AboutStrings = {
  title: "Über uns",
  description: "{site} ist eine unabhängige Sammlung kostenloser Hintergrundbilder in voller Auflösung für das Innen- und Außendisplay des iPhone Duo.",
  eyebrow: "Über uns",
  h1: "Zwei Displays verdienen",
  h1Accent: "großartige Hintergrundbilder.",
  lead: "{site} ist eine unabhängige Sammlung von Hintergrundbildern für das erste faltbare iPhone. Unser Ziel ist einfach: Wir helfen dir, schöne Hintergrundbilder in voller Auflösung zu finden, die auf jedem deiner Displays richtig aussehen.",
  principles: [
    {
      title: "Passend gemacht",
      body: "Das iPhone Duo hat ein schmales 5,4-Zoll-Außendisplay und ein breites 7,6-Zoll-Innendisplay. Wir prüfen jedes Hintergrundbild auf beiden und auf den iPhone 18 Pro Modellen und zeigen dir vor dem Download, wie es passt.",
    },
    {
      title: "Immer volle Auflösung",
      body: "Keine unscharfen Vorschauen, keine Screenshots. Auf jeder Seite stehen die genaue Auflösung und die Dateigröße, und du lädst die Originaldatei herunter.",
    },
    {
      title: "Respekt vor Kreativen",
      body: "Wir veröffentlichen eigene Werke, von Menschen geprüfte KI-gestützte Designs, lizenzierte Bilder und gemeinfreie Werke und nennen die Urheber überall dort, wo es nötig ist.",
    },
    {
      title: "Mit Sorgfalt sortiert",
      body: "Kategorien und Geräteseiten machen es leicht, ein Hintergrundbild zu finden, das zu deinem Stil und deinem Display passt.",
    },
  ],
  sections: [
    {
      title: "Warum wir angefangen haben",
      body: "Wenn ein neues iPhone erscheint, suchen viele nach Hintergrundbildern, die zum Display passen. Das iPhone Duo hat das schwieriger gemacht: Das Außendisplay ist schmal und hochkant, das Innendisplay klappt zu einer breiten Fläche mit einer Falz in der Mitte auf. Die meisten Hintergrundbild-Seiten sind auf eine einzige Handyform ausgelegt, also haben wir eine Seite für zwei Formen gebaut.",
    },
    {
      title: "Wie wir Hintergrundbilder auswählen",
      body: "Wir prüfen jedes Hintergrundbild vor der Veröffentlichung: die Auflösung, die Komposition rund um die Uhr auf dem Sperrbildschirm und die Falz, die Farbqualität auf OLED-Displays und ob wir es teilen dürfen. Jedes Hintergrundbild hat einen klaren Titel, eine Beschreibung, eine Kategorie und Angaben wie Auflösung und Dateigröße, damit du genau weißt, was du herunterlädst.",
    },
    {
      title: "Anleitungen, die wirklich helfen",
      body: "Neben Hintergrundbildern veröffentlichen wir praktische [Anleitungen](/de/blog), von den genauen Maßen der iPhone Duo Displays bis zum offiziellen Hintergrundbild von Apple. Einige Anleitungen gibt es bisher nur auf Englisch.",
    },
    {
      id: "editorial-team",
      title: "Unsere Redaktion und unsere Grundsätze",
      body: `Unsere Anleitungen schreibt und bearbeitet die Redaktion von {site}, die auch jedes Hintergrundbild vor der Veröffentlichung prüft. Wir schreiben über die häufigsten Fragen und wenden auf jede Anleitung dieselben Grundsätze an:

- **Klar und praktisch.** Genaue Displaymaße, echte Menüpfade und Schritt-für-Schritt-Anleitungen statt Füllwörter.
- **Vor der Veröffentlichung geprüft.** Wir gleichen die Schritte mit Apples eigener Dokumentation und der aktuellen iOS-Version ab. Unterscheiden sich Menünamen zwischen iOS-Versionen, weisen wir darauf hin.
- **Aktuell gehalten.** Jede Anleitung zeigt das Datum der letzten Aktualisierung, und wir überarbeiten sie, wenn iOS etwas ändert.
- **Unabhängig.** Wir nehmen kein Geld für Inhalte an. Werbung ist klar gekennzeichnet und von unseren Inhalten getrennt.
- **Offen für Korrekturen.** Wenn etwas falsch oder veraltet ist, [sag uns Bescheid](/de/contact), dann korrigieren wir es.`,
    },
    {
      title: "Unabhängig und kostenlos",
      body: "Wir haben keine Verbindung zu Apple Inc. Die Seite ist kostenlos und finanziert sich über klar gekennzeichnete Werbung. Die Hintergrundbilder sind für die private Nutzung auf deinen eigenen Geräten gedacht; siehe unsere [Nutzungsbedingungen](/terms) (auf Englisch).",
    },
    {
      title: "Kontakt",
      body: "Du hast einen Wunsch für ein Hintergrundbild, Feedback oder eine Idee für eine Zusammenarbeit? Besuche unsere [Kontaktseite](/de/contact) oder schreib an [{email}](mailto:{email}). Kreative, die ihre Werke ohne Erlaubnis hier finden, erreichen uns über unsere [Urheberrechtsseite](/dmca) (auf Englisch).",
    },
  ],
};

export const DE_CONTACT: ContactStrings = {
  title: "Kontakt",
  description: "Kontaktiere {site} bei Wünschen für Hintergrundbilder, Feedback, Kooperationen oder Support.",
  eyebrow: "Kontakt",
  h1: "Wir freuen uns auf deine Nachricht.",
  lead: "Wünsche für Hintergrundbilder, Feedback, Ideen für Kooperationen oder ein Problem beim Download: Schreib uns einfach.",
  emailTitle: "E-Mail",
  responseTitle: "Antwortzeit",
  responseBody: "Wir versuchen, innerhalb von 2–3 Werktagen zu antworten.",
  copyrightTitle: "Urheberrecht",
  copyrightBefore: "Rechteinhaber können für die schnellste Prüfung eine Meldung über unsere ",
  dmcaLink: "DMCA-Seite",
  copyrightAfter: " (auf Englisch) einreichen.",
  form: {
    name: "Name",
    email: "E-Mail",
    subject: "Betreff",
    subjectPlaceholder: "Wunsch für ein Hintergrundbild, Feedback, Kooperation…",
    message: "Nachricht",
    send: "Nachricht senden",
    sending: "Wird gesendet…",
  },
};
