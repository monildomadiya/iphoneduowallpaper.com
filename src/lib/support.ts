import type { Locale } from "@/lib/i18n/types";

/**
 * Luna's Buy Me a Coffee page. Every support link on the site points here, so the handle only ever
 * has to change in one place.
 */
export const SUPPORT_URL = "https://buymeacoffee.com/support_luna";

/** Shown under the button so people can see where the link goes before they tap it. */
export const SUPPORT_HANDLE = "buymeacoffee.com/support_luna";

export interface SupportStrings {
  /** Small label over the heading. */
  eyebrow: string;
  title: string;
  body: string;
  /** The button itself. */
  cta: string;
  /** Reassurance under the button: one-off, no account. */
  note: string;
  /** Compact label for the header, the footer strip and the mobile menu. */
  short: string;
  /** One line next to the footer strip's label. */
  footerNote: string;
  /** Accessible name — the link opens a third-party page in a new tab. */
  aria: string;
  /** The nudge that appears once a wallpaper has actually been downloaded. */
  thanksTitle: string;
  thanksBody: string;
  dismiss: string;
}

/**
 * Translated in place rather than in each locale file: the copy is the same handful of lines on
 * every page, and keeping it here means a new language needs one entry instead of an edit to a
 * 2,000-line content file.
 */
export const SUPPORT_STRINGS: Record<Locale, SupportStrings> = {
  en: {
    eyebrow: "Support my work",
    title: "Keep the wallpapers free",
    body: "Every wallpaper here is made and shared for free by one person. If one of them is on your Lock Screen right now, a coffee keeps the next batch coming.",
    cta: "Buy me a coffee",
    note: "One-off, from $1 — no account, no subscription.",
    short: "Buy me a coffee",
    footerNote: "Wallpapers stay free. A coffee keeps new ones coming.",
    aria: "Buy me a coffee on Buy Me a Coffee (opens in a new tab)",
    thanksTitle: "Enjoy your wallpaper!",
    thanksBody: "It's free, but it isn't effortless. A small coffee pays for the next set.",
    dismiss: "Not now",
  },
  es: {
    eyebrow: "Apoya mi trabajo",
    title: "Que los fondos sigan siendo gratis",
    body: "Cada fondo de esta web lo crea y comparte gratis una sola persona. Si uno de ellos está ahora en tu pantalla de bloqueo, un café ayuda a que lleguen los siguientes.",
    cta: "Invítame a un café",
    note: "Pago único, desde 1 $: sin cuenta y sin suscripción.",
    short: "Invítame a un café",
    footerNote: "Los fondos siguen siendo gratis. Un café trae más.",
    aria: "Invítame a un café en Buy Me a Coffee (se abre en una pestaña nueva)",
    thanksTitle: "¡Disfruta tu fondo!",
    thanksBody: "Es gratis, pero no sale solo. Un café paga los próximos.",
    dismiss: "Ahora no",
  },
  tr: {
    eyebrow: "Çalışmamı destekle",
    title: "Duvar kağıtları ücretsiz kalsın",
    body: "Buradaki her duvar kağıdını tek bir kişi hazırlıyor ve ücretsiz paylaşıyor. Biri şu anda kilit ekranındaysa, bir kahve yenilerinin gelmesini sağlar.",
    cta: "Bana bir kahve ısmarla",
    note: "Tek seferlik, 1 dolardan başlıyor — hesap da abonelik de gerekmez.",
    short: "Bana bir kahve ısmarla",
    footerNote: "Duvar kağıtları ücretsiz kalır. Bir kahve yenilerini getirir.",
    aria: "Buy Me a Coffee'de bana bir kahve ısmarla (yeni sekmede açılır)",
    thanksTitle: "Duvar kağıdının keyfini çıkar!",
    thanksBody: "Ücretsiz ama emeksiz değil. Küçük bir kahve yenilerinin masrafını karşılıyor.",
    dismiss: "Şimdi değil",
  },
  zh: {
    eyebrow: "支持我的创作",
    title: "让壁纸一直免费",
    body: "这里的每一张壁纸都由一个人独自制作并免费分享。如果其中一张正在你的锁屏上，一杯咖啡就能让新作品继续更新。",
    cta: "请我喝杯咖啡",
    note: "一次性支持，1 美元起，无需注册，也不是订阅。",
    short: "请我喝杯咖啡",
    footerNote: "壁纸始终免费，一杯咖啡带来更多新作。",
    aria: "在 Buy Me a Coffee 上请我喝杯咖啡（在新标签页中打开）",
    thanksTitle: "祝你用得开心！",
    thanksBody: "壁纸免费，但并不轻松。一杯咖啡就能换来下一批新壁纸。",
    dismiss: "暂时不用",
  },
  ko: {
    eyebrow: "작업 응원하기",
    title: "배경화면을 계속 무료로",
    body: "이곳의 모든 배경화면은 한 사람이 만들어 무료로 나눕니다. 그중 하나가 지금 잠금 화면에 있다면, 커피 한 잔이 다음 배경화면을 만듭니다.",
    cta: "커피 한 잔 사주기",
    note: "1달러부터 한 번만, 가입도 구독도 필요 없습니다.",
    short: "커피 한 잔 사주기",
    footerNote: "배경화면은 계속 무료입니다. 커피 한 잔이 새 작업으로 돌아옵니다.",
    aria: "Buy Me a Coffee에서 커피 한 잔 사주기 (새 탭에서 열림)",
    thanksTitle: "배경화면 마음에 드시길!",
    thanksBody: "무료지만 거저 만들어지지는 않아요. 커피 한 잔이 다음 배경화면이 됩니다.",
    dismiss: "다음에",
  },
  de: {
    eyebrow: "Meine Arbeit unterstützen",
    title: "Damit die Wallpaper kostenlos bleiben",
    body: "Jedes Wallpaper hier wird von einer einzigen Person gestaltet und kostenlos geteilt. Wenn eines gerade auf deinem Sperrbildschirm liegt, sorgt ein Kaffee für die nächsten.",
    cta: "Spendier mir einen Kaffee",
    note: "Einmalig, ab 1 $ — ohne Konto und ohne Abo.",
    short: "Spendier mir einen Kaffee",
    footerNote: "Die Wallpaper bleiben kostenlos. Ein Kaffee bringt neue.",
    aria: "Spendier mir einen Kaffee auf Buy Me a Coffee (wird in einem neuen Tab geöffnet)",
    thanksTitle: "Viel Freude mit deinem Wallpaper!",
    thanksBody: "Kostenlos heißt nicht mühelos. Ein kleiner Kaffee zahlt die nächsten.",
    dismiss: "Jetzt nicht",
  },
};

export function supportStrings(locale: Locale = "en"): SupportStrings {
  return SUPPORT_STRINGS[locale] ?? SUPPORT_STRINGS.en;
}
