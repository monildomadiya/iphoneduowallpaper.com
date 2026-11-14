import { ZH_SEARCH } from "@/lib/i18n/search-strings";
import { ZH_ABOUT, ZH_CONTACT } from "@/lib/i18n/zh-pages";
import { ZH_LISTING, ZH_TAXONOMY } from "@/lib/i18n/zh-taxonomy";
import { ZH_WALLPAPER } from "@/lib/i18n/zh-wallpaper";
import type { LocaleContent } from "@/lib/i18n/types";

/**
 * Simplified Chinese. Search Console shows "iphone duo 壁纸" at 15% CTR on the English home page.
 * Copy says 壁纸, the word people search; instructions say 墙纸 where iOS's own Settings menu does.
 * Only the most-downloaded wallpapers have a page here, so the others link to English and say so.
 */
export const ZH: LocaleContent = {
  locale: "zh",
  name: "简体中文",
  ogLocale: "zh_CN",
  chrome: {
    locale: "zh",
    homeHref: "/zh",
    homeLabel: "首页",
    searchPath: "/zh/search",
    nav: [
      { href: "/zh/wallpapers", label: "壁纸", icon: "wallpapers" },
      { href: "/zh/categories", label: "分类", icon: "categories" },
      { href: "/zh/devices", label: "设备", icon: "devices" },
      { href: "/zh/maker", label: "壁纸制作", icon: "maker" },
    ],
    header: {
      skip: "跳到正文",
      home: "{site} 首页",
      search: "搜索……",
      searchLabel: "搜索壁纸",
      searchPlaceholder: "搜索壁纸……",
      openMenu: "打开菜单",
      closeMenu: "关闭菜单",
      close: "关闭",
      closeSearch: "关闭搜索",
      quickLinks: "快速链接",
      menuLinks: [
        { href: "/zh/about", label: "关于我们" },
        { href: "/zh/contact", label: "联系我们" },
        { href: "/privacy-policy", label: "隐私" },
        { href: "/terms", label: "条款" },
      ],
    },
    quickLinks: [
      { href: "/zh/wallpapers?sort=popular", label: "下载最多的壁纸" },
      { href: "/zh/maker", label: "iPhone Duo 壁纸制作工具" },
      { href: "/zh/categories/dark", label: "暗色与 AMOLED 壁纸" },
      { href: "/zh/categories/landscape", label: "风景壁纸" },
      { href: "/zh/devices/iphone-duo-inner-display", label: "iPhone Duo 内屏" },
      { href: "/zh/devices/iphone-duo-outer-display", label: "iPhone Duo 外屏" },
    ],
    footer: {
      disclaimer:
        "{site} 是一个独立网站，与 Apple Inc. 没有关联，也未获得 Apple 的认可或赞助。iPhone、iPhone Duo 和 iOS 是 Apple Inc. 在美国和其他国家/地区的注册商标，在此仅用于说明设备兼容性。壁纸仅供个人非商业使用。",
      groups: [
        {
          title: "浏览",
          links: [
            { href: "/zh/wallpapers", label: "全部壁纸" },
            { href: "/zh/wallpapers?sort=popular", label: "下载最多" },
            { href: "/zh/categories", label: "分类" },
            { href: "/zh/categories/dark", label: "暗色与 AMOLED" },
            { href: "/zh/categories/landscape", label: "风景" },
            { href: "/zh/maker", label: "壁纸制作工具" },
          ],
        },
        {
          title: "设备",
          links: [
            { href: "/zh/devices/iphone-duo-outer-display", label: "iPhone Duo 外屏" },
            { href: "/zh/devices/iphone-duo-inner-display", label: "iPhone Duo 内屏" },
            { href: "/zh/devices/iphone-18-pro-max", label: "iPhone 18 Pro Max" },
            { href: "/zh/devices/iphone-18-pro", label: "iPhone 18 Pro" },
          ],
        },
        {
          title: "指南",
          links: [
            { href: "/zh/blog", label: "全部指南" },
            { href: "/zh/blog/official-iphone-duo-wallpaper", label: "iPhone Duo 官方壁纸" },
            { href: "/zh/blog/iphone-duo-wallpaper-sizes-explained", label: "壁纸尺寸" },
            { href: "/zh/about", label: "关于我们" },
            { href: "/zh/contact", label: "联系我们" },
          ],
        },
        {
          title: "法律信息",
          links: [
            { href: "/privacy-policy", label: "隐私政策" },
            { href: "/terms", label: "使用条款" },
            { href: "/cookie-policy", label: "Cookie 政策" },
            { href: "/disclaimer", label: "免责声明" },
            { href: "/dmca", label: "DMCA 与版权" },
          ],
        },
      ],
      rights: "保留所有权利。",
      languages: "语言",
    },
  },
  cookies: {
    label: "Cookie 提示",
    before: "我们使用 Cookie 来保证网站运行、统计访问量，并展示 Google 等合作伙伴的广告。详情请见",
    between: "和",
    after: "。",
    cookiePolicy: "Cookie 政策",
    privacyPolicy: "隐私政策",
    accept: "知道了",
  },
  home: {
    title: "iPhone Duo 壁纸 — 免费高清下载",
    description: "免费下载 iPhone Duo 高清（HD）壁纸，适配 iPhone 18 Duo 的 5.4 英寸外屏和 7.6 英寸内屏。无需 App，无需注册。",
    fourK: {
      title: "iPhone Duo 4K 壁纸 — 免费下载",
      description: "iPhone Duo（iPhone 18 Duo）原生尺寸的免费 4K 壁纸：外屏 1398×2034，内屏 2670×1878。成对文件，无需注册。",
      h1: "iPhone Duo 壁纸",
      h1Accent: "4K",
      intro: "为 5.4 英寸外屏和 7.6 英寸内屏准备的成对文件，另有 iPhone 18 Pro 尺寸。",
      fullResolution: "4K，原生尺寸",
      faqAnswer:
        "是的。每张壁纸都有 4K 原始文件（长边 3840 像素），以及每块屏幕原生尺寸的现成文件：外屏 1398 × 2034，内屏 2670 × 1878，另有 iPhone 18 Pro 和 Pro Max 版本。大多数原始文件由原图经 AI 放大而成，每个页面的详细信息都会说明。",
    },
    badgeNew: "新",
    badge: "专为 iPhone Duo 设计",
    h1: "iPhone Duo 壁纸",
    h1Accent: "为两块屏幕而生",
    intro: "为 5.4 英寸外屏、7.6 英寸内屏和 iPhone 18 Pro 准备的全分辨率原创设计。",
    browse: "浏览壁纸",
    explore: "探索分类",
    stats: {
      wallpapers: "{n} 张壁纸",
      fullResolution: "全分辨率",
      free: "免费，无需注册",
      original: "原创且有授权",
    },
    featured: ["精选。", "用心挑选。"],
    latest: ["最新。", "新鲜上架。"],
    categories: ["分类。", "找到你的风格。"],
    guides: ["指南。", "中文版。"],
    viewAll: "查看全部",
    makerTitle: "自己动手做。",
    makerBody:
      "把任意照片变成适配两块屏幕的一对壁纸：外屏 1398 × 2034，内屏 2670 × 1878，每张都按对应屏幕取景。免费使用，照片不会离开你的设备。",
    makerCta: "打开壁纸制作工具",
    aboutTitle: "为 iPhone Duo 两块屏幕准备的壁纸。",
    about: `iPhone Duo（也有人搜索 iPhone 18 Duo 或 iPhone Fold）有两块形状完全不同的屏幕：一块细长的 5.4 英寸外屏，分辨率 1398 × 2034；一块像小平板一样展开的宽大 7.6 英寸内屏，分辨率 2670 × 1878。为普通 iPhone 制作的壁纸在外屏上下会损失一条，在内屏上损失更多。

这里的每张壁纸都可以按原始分辨率免费下载高清版本，并在保存前告诉你它在[外屏](/zh/devices/iphone-duo-outer-display)和[内屏](/zh/devices/iphone-duo-inner-display)上的效果。不确定需要什么尺寸？请阅读 [iPhone Duo 壁纸尺寸](/zh/blog/iphone-duo-wallpaper-sizes-explained)指南。想找 Apple 那张沙漠沙丘的官方壁纸？我们在 [iPhone Duo 官方壁纸](/zh/blog/official-iphone-duo-wallpaper)指南里做了介绍。

下载最多的壁纸都有中文页面，其余壁纸的页面暂时是英文的，下载和屏幕适配检查的方式完全一样。`,
    faqTitle: ["有疑问？", "这里有答案。"],
    faq: [
      {
        question: "这些壁纸免费吗？",
        answer: "免费。每张壁纸都可以免费下载，供你在自己的设备上个人使用，不需要账号或 App。禁止商业使用和二次分发。",
      },
      {
        question: "这些壁纸适配 iPhone Duo 的内屏和外屏吗？",
        answer:
          "每个壁纸页面都会显示图片在 iPhone Duo 外屏（1398 × 2034）、展开的内屏（2670 × 1878）和 iPhone 18 Pro 系列上的效果，方便你在下载前选对。",
      },
      {
        question: "iPhone Duo、iPhone 18 Duo 和 iPhone Fold 是同一款手机吗？",
        answer:
          "是的，它们都是这款折叠 iPhone 的名称。它有一块合上时使用的 5.4 英寸外屏（1398 × 2034）和一块像小平板一样展开的 7.6 英寸内屏（2670 × 1878）。这里的每张壁纸都会在两块屏幕上检查。",
      },
      {
        question: "哪里可以找到 iPhone Duo 官方壁纸？",
        answer:
          "Apple 的 iPhone Duo 官方壁纸是山脉前的沙漠沙丘，有浅色和深色两种版本，预装在 iPhone Duo 上。它是 Apple 享有版权的作品，所以我们不提供下载；官方壁纸指南会介绍它的尺寸和设置方法。本站所有壁纸都是为这两块屏幕制作的原创作品。",
      },
      {
        question: "这些壁纸是 4K 的吗？",
        answer:
          "还不是，壁纸库目前是高清（HD）。每张壁纸都按原始分辨率发布，页面会显示准确的像素尺寸、画质标签（只有长边达到 3840 像素的文件才标 4K）以及与每块屏幕的适配情况，让你在下载前就知道它在 7.6 英寸内屏（2670 × 1878）上有多清晰。",
      },
      {
        question: "如何在 iPhone 上设置壁纸？",
        answer:
          "把图片存到“照片”，然后在“设置”→“墙纸”中添加新墙纸，或者按住锁定屏幕并点击 + 按钮。在 iPhone 上，下载的文件会先保存到“文件”→“下载”，查找前请先把图片移到“照片”。",
      },
      {
        question: "你们和 Apple 有关系吗？",
        answer: "没有。这是一个独立的爱好者和设计网站。iPhone 和 iPhone Duo 是 Apple Inc. 的商标，在此仅用于说明设备兼容性。",
      },
    ],
  },
  maker: {
    title: "iPhone Duo 壁纸制作工具 — 外屏和内屏",
    description: "用任意照片制作 iPhone Duo 壁纸：按 1398 × 2034 外屏和 2670 × 1878 内屏裁切，两张一起下载。免费，在浏览器中完成。",
    eyebrow: "免费工具",
    h1: "iPhone Duo 壁纸制作工具",
    lead: "把任意照片变成适配 iPhone Duo 两块屏幕的一对壁纸：外屏一张竖长文件，内屏一张横宽文件，在浏览器中免费完成。",
    breadcrumb: "壁纸制作工具",
    stepsTitle: ["如何使用。", "四个步骤，两块屏幕。"],
    step: "第 {n} 步",
    steps: [
      {
        title: "选择一张照片",
        body: "从手机或电脑选择任意图片，或者从壁纸页面把我们的壁纸在制作工具中打开。不会上传任何内容，裁切在你的浏览器中完成。",
      },
      {
        title: "为每块屏幕取景",
        body: "在每个预览里拖动图片并调整缩放。细长的外屏和宽大的内屏分别取景，让主体在两边都处在合适的位置。",
      },
      {
        title: "检查清晰度",
        body: "每个预览下方，制作工具都会告诉你照片的像素是否足够这块屏幕使用，或者是否需要放大，和每个壁纸页面上的检查一样。",
      },
      {
        title: "下载两个文件",
        body: "你会得到两个文件：外屏 1398 × 2034，内屏 2670 × 1878，文件名便于在“照片”中区分。",
      },
    ],
    whyTitle: "为什么 iPhone Duo 需要两个壁纸文件",
    why: `5.4 英寸外屏分辨率为 1398 × 2034，是一块细长的竖屏。展开手机后，7.6 英寸内屏分辨率为 2670 × 1878，宽度大于高度。一张图片很难同时铺好两块屏幕：竖版照片在内屏上只能保留中间一条，横版照片在外屏上只剩窄窄的一片。

制作工具会按每块屏幕的准确分辨率分别裁切，这样 iOS 就能逐像素显示，不用放大图片。想要最好的效果，请使用宽度至少 2670 像素的照片。外屏裁切时把主体放在中间；内屏则把主体稍微移开手机折叠的中线。更多细节请看 [iPhone Duo 壁纸尺寸](/zh/blog/iphone-duo-wallpaper-sizes-explained)指南。

做好了？可以[浏览更多壁纸](/zh/wallpapers)，它们同样为两块屏幕而做。`,
    faqTitle: ["有疑问？", "关于制作工具。"],
    faq: [
      {
        question: "iPhone Duo 壁纸制作工具免费吗？",
        answer: "免费。不需要账号，不加水印，制作数量也没有限制。用你自己的照片做出来的壁纸可以随意使用。",
      },
      {
        question: "我的照片会被上传吗？",
        answer: "不会。照片由你设备上的浏览器打开和裁切，生成的文件直接从那里保存。不会向我们的服务器发送任何内容。",
      },
      {
        question: "制作工具导出什么尺寸？",
        answer: "iPhone Duo 外屏正好 1398 × 2034 像素，内屏 2670 × 1878 像素，格式为 JPG 或 PNG。在这些尺寸下，iOS 会逐像素显示图片，不需要放大。",
      },
      {
        question: "为什么制作工具提示我的照片会模糊？",
        answer: "你选中的区域像素比屏幕少，所以图片需要放大。请缩小取景或使用更大的原图：宽度至少 2670 像素可满足内屏，高度至少 2034 像素可满足外屏。",
      },
      {
        question: "可以使用哪些图片格式？",
        answer: "所有现代浏览器都支持 JPG、PNG 和 WebP。在 iPhone 上从照片图库选择照片时，iOS 通常会以 JPG 格式交给浏览器，所以 HEIC 照片在那里也能使用。",
      },
      {
        question: "如何把两个文件设置到 iPhone Duo 上？",
        answer: "把两个文件都存到“照片”，按住锁定屏幕，点击 + 按钮，选择“照片”，然后选择对应屏幕的文件。",
      },
    ],
    ui: {
      outerName: "外屏",
      outerHint: "合上 · 5.4 英寸",
      innerName: "内屏",
      innerHint: "展开 · 7.6 英寸",
      previewLabel: "预览",
      formatLabel: "文件格式",
      modeLock: "锁定屏幕",
      modeHome: "主屏幕",
      modeClean: "仅壁纸",
      pixelPerfect: "像素级清晰",
      pixelPerfectNote: "缩小后适配，依然清晰。",
      greatFit: "非常合适",
      slightlySoft: "略微模糊",
      soft: "模糊",
      enlarged: "放大了 {n}% 以铺满屏幕。",
      fixZoomOut: "请缩小取景或使用更大的照片。",
      fixLarger: "更大的照片会更清晰。",
      zoom: "缩放",
      reset: "重置{screen}取景",
      dragHint: "{screen}预览。拖动图片或使用方向键移动。",
      emptyHint: "选择一张照片，看看它在这块屏幕上有多清晰。",
      downloadOuter: "下载外屏文件",
      downloadInner: "下载内屏文件",
      choose: "选择照片",
      change: "更换照片",
      loading: "正在加载壁纸……",
      dropHint: "或者把图片拖到这里。它不会离开你的设备。",
      pixels: "{w} × {h} 像素",
      downloadBoth: "两张都下载",
      preparing: "正在准备……",
      exportNote: "导出尺寸正好是 {outer} 和 {inner}。你的照片绝不会被上传。",
      loadFailed: "无法加载这张壁纸。请改选一张照片。",
      notImage: "这个文件不是图片。",
      tooLarge: "这张照片超过 40 MB。请选择小一些的照片。",
      cantOpen: "这个浏览器打不开这张图片。请试试 JPG、PNG 或 WebP。",
      exportFailed: "无法生成壁纸。请重试或换一张照片。",
    },
  },
  blog: {
    title: "iPhone Duo 壁纸指南",
    description: "iPhone Duo 壁纸中文指南：Apple 官方壁纸、外屏和内屏尺寸，以及如何挑选清晰的壁纸。",
    breadcrumb: "指南",
    h1: "中文指南。",
    lead: "让壁纸在 iPhone Duo 两块屏幕上都清晰好看，你需要知道的都在这里。",
    by: "作者：",
    team: "{author}",
    minRead: "阅读约 {n} 分钟",
    toc: "本指南内容",
    english: "阅读英文版",
    more: ["更多指南。", "中文版。"],
    wallpapers: ["可以试试这些壁纸。", "壁纸库最新上架。"],
  },
  guides: [
    {
      slug: "official-iphone-duo-wallpaper",
      title: "iPhone Duo 官方壁纸：浅色和深色沙丘、尺寸与获取方式",
      seoTitle: "iPhone Duo 官方壁纸：浅色与深色、尺寸",
      description: "iPhone Duo 官方壁纸是沙漠沙丘，有浅色和深色版本。这里介绍外屏和内屏的准确尺寸、它是不是 4K，以及如何设置。",
      excerpt: "Apple 为 iPhone Duo 准备了四张壁纸：山脉下的沙漠沙丘，有浅色和深色版本。这里介绍它们的样子、每块屏幕的准确尺寸、来源以及设置方法。",
      tags: ["iPhone Duo", "官方壁纸"],
      published: "2026-11-03",
      content: `Apple 发布首款折叠 iPhone——iPhone Duo 时，展示了一张新壁纸：陡峭山脉前绵延的广阔沙漠沙丘。搜索“iPhone Duo 壁纸”的人，大多想找的就是这张图。这篇指南会介绍官方壁纸是什么样、每块屏幕的准确尺寸、文件来自哪里，以及如何在你现在的手机上获得同样的感觉。

## iPhone Duo 官方壁纸长什么样

官方图片共有**四张**：两张用于浅色模式，两张用于深色模式。

- **浅色版本**展示白天的沙丘：淡蓝色天空下温暖的米色沙地。
- **深色版本**展示夜晚的同一片风景：深邃的阴影、满天星空和地平线上柔和的光芒。

和 Apple 近年的大多数壁纸一样，这一组也会随外观设置变化：白天浅色，夜间或开启深色模式时变成深色。

## 为什么每个版本有两个文件

iPhone Duo 的两块屏幕形状差别很大，一张图无法同时铺满：

| 屏幕 | 分辨率 | 形状 |
| --- | --- | --- |
| 外屏（5.4 英寸，合上） | 1398 × 2034 | 细长，竖向 |
| 内屏（7.6 英寸，展开） | 2670 × 1878 | 宽大，横向 |

Apple 的解决办法是为两块屏幕分别绘制这一场景。手机合上时，外屏显示沙丘的近景。展开后，壁纸向两侧延伸，把整片风景铺满内屏。这就是官方壁纸的浅色和深色版本各有一张细长图和一张宽幅图的原因。

如果只打算保存一个文件，请选择为你要使用的屏幕制作的那个。细长的外屏图铺到宽大的内屏上时，会放大约 1.9 倍，并损失一半以上的高度。详细说明请看 [iPhone Duo 壁纸尺寸](/zh/blog/iphone-duo-wallpaper-sizes-explained)指南。

## 官方壁纸是 4K 吗

不是。Apple 的文件是每块屏幕的准确尺寸：外屏 1398 × 2034，内屏 2670 × 1878。两者都没有达到 4K 通常所指的长边 3840 像素。网上可能看到“4K”版本，那是 Apple 文件的放大版。放大后的图片在更大的屏幕上也许看着干净，但不会增加原图没有的细节。在 iPhone Duo 上，原始文件本来就逐像素清晰。

## 官方壁纸从哪里来

这些壁纸预装在 iPhone Duo 上，设置手机后就能在壁纸库中找到。面向其他 iPhone 的 iOS 27 不包含它们。发布前，它们曾出现在 Apple 的开发者工具中（Xcode 27.1 beta 里的 iPhone Duo 模拟器），并被 [9to5Mac](https://9to5mac.com/2026/09/18/download-the-iphone-duos-official-light-and-dark-wallpapers-here/) 等 Apple 新闻网站发布。

**我们不提供 Apple 壁纸的下载。** 它们是 Apple 享有版权的作品：随设备提供、供设备使用，但不能随意二次分发。本站的所有内容都是为 iPhone Duo 屏幕制作的原创作品。

## 如何在 iPhone Duo 上设置官方壁纸

1. 按住锁定屏幕，然后点击 **+** 按钮。
2. 滑到 Apple 的合集，选择沙丘壁纸。
3. 选择是否跟随外观变化（白天浅色，夜间深色）。
4. 点击**添加**，并选择同时用于主屏幕。

在 iPhone Duo 上，请在手机处于相应状态时设置每块屏幕：外屏合上设置，内屏展开设置，这样就能看到实际的裁切效果。

## 在其他 iPhone 上使用下载的副本

如果你保存了某张官方图片，想用在 iPhone 18 Pro 或更早的 iPhone 上，请选择细长的外屏版本。它的形状更接近，但外屏相对高度比普通 iPhone 更宽，所以图片宽度约有三分之一会被两侧裁掉。宽大的内屏版本则只剩下一条窄窄的竖向画面。然后按照[在 iPhone 上设置壁纸](/blog/how-to-set-wallpaper-on-iphone)指南（英文）操作。

## 同样氛围的原创壁纸

如果你喜欢官方壁纸里沙漠黄昏的宁静，又想要一张与众不同的壁纸，我们壁纸库中的这些原创作品也有同样平静的风景：

- [午夜蓝沙丘](/zh/wallpapers/midnight-blue-desert-dunes-dual-iphone-wallpaper)：简洁夜空下柔和的沙丘曲线，最接近深色版本。
- [黑白沙漠之河](/zh/wallpapers/monochrome-desert-river-minimalist-wallpaper)：一条明亮的河流蜿蜒穿过黑色沙丘。
- [午夜雪峰 AMOLED](/zh/wallpapers/midnight-peak-amoled-duo-wallpaper)：为 AMOLED 爱好者准备，纯黑背景上的一座雪峰。
- [雪山与月亮](/zh/wallpapers/minimal-snow-mountain-moon-landscape-duo-wallpaper)：柔和蓝天下的冰雪山峰。
- [云雾山间孤松](/zh/wallpapers/misty-mountain-pine-tree-duo-wallpaper)：隐入云雾的嶙峋山峰。

每个壁纸页面都会在下载前显示准确的分辨率，以及图片在 iPhone Duo 外屏、内屏和 iPhone 18 Pro 上的效果。这种风格的更多作品可以看[风景](/zh/categories/landscape)分类，想找深色版本那样的夜景可以看[暗色与 AMOLED](/zh/categories/dark)页面。想用自己的照片？[iPhone Duo 壁纸制作工具](/zh/maker)会帮你裁成两块屏幕的尺寸。`,
    },
    {
      slug: "iphone-duo-wallpaper-sizes-explained",
      title: "iPhone Duo 壁纸尺寸：外屏和内屏",
      seoTitle: "iPhone Duo 壁纸尺寸：外屏和内屏",
      description: "iPhone Duo 外屏（1398 × 2034）和内屏（2670 × 1878）的准确分辨率，以及挑选两块屏幕都清晰的壁纸的简单规则。",
      excerpt: "iPhone Duo 有两块形状差别很大的屏幕。这里是准确的分辨率，以及挑选两边都清晰的壁纸的简单规则。",
      tags: ["iPhone Duo", "分辨率"],
      published: "2026-11-03",
      content: `iPhone Duo 是 Apple 首款折叠 iPhone，它有**两块屏幕**：合上时使用的 5.4 英寸外屏，以及像书一样展开的 7.6 英寸内屏。两块屏幕的使用方向不同，所以在一块屏幕上完美的壁纸，到另一块上可能会被裁切。这篇指南会解释这些数字，并给你几条简单的规则。

## 屏幕分辨率一览

| 屏幕 | 尺寸 | 分辨率（使用时） | 方向 |
| --- | --- | --- | --- |
| iPhone Duo 外屏 | 5.4 英寸 | 1398 × 2034 px | 竖向（细长） |
| iPhone Duo 内屏 | 7.6 英寸 | 2670 × 1878 px | 横向（宽大，展开） |
| iPhone 18 Pro Max | 6.9 英寸 | 1320 × 2868 px | 竖向 |
| iPhone 18 Pro | 6.3 英寸 | 1206 × 2622 px | 竖向 |

规格表上常把内屏写成 1878 × 2670，这是同一块面板：展开 iPhone Duo 时，铰链竖直，屏幕处于横向，所以我们写成 2670 × 1878。

## 规则 1：分辨率要达到或超过屏幕

壁纸的长和宽都应该**至少**和屏幕一样大。更小的图片会被拉伸，看起来发虚。本站每张壁纸都标明了准确的分辨率，你可以在下载前核对。

## 规则 2：为每块屏幕选对形状

- **外屏**：选择细长的竖版壁纸。1398 × 2034 或更长的图片都能轻松适配。
- **内屏**：选择宽幅壁纸或**方形**图片。方形图片（例如 2670 × 2670）在旋转展开的手机时，能给 iOS 留出重新取景的空间。
- **两块屏幕用同一张**：主体在中央的设计，比如行星、花朵或渐变球体，裁成两种形状都好看。

想用自己的照片？[iPhone Duo 壁纸制作工具](/zh/maker)会替你完成两次裁切，每张都是准确尺寸。

## 规则 3：注意折痕和时钟

内屏的折叠线正好穿过中间。正中有强烈竖线的壁纸会让折痕更明显，所以主体偏离中心通常更好看。在锁定屏幕上，请在上方给时钟和小组件留一些空间。

## 规则 4：优先选择高质量格式

JPEG 和 PNG 到处都能用。PNG 能让纯色和渐变不出现色带；JPEG 能让照片文件保持较小。不要使用壁纸的截图：它们会损失画质，还带着界面元素。

## 快速检查清单

1. 在壁纸页面上查看它的分辨率。
2. 外屏用竖版，内屏用宽幅或方形。
3. 在内屏上，让主要内容避开正中线。
4. 下载原始文件，不要保存预览图。

欢迎浏览我们的 [iPhone Duo 内屏壁纸](/zh/devices/iphone-duo-inner-display)和[外屏壁纸](/zh/devices/iphone-duo-outer-display)，每张发布前都检查过尺寸。想找 Apple 的壁纸？请阅读 [iPhone Duo 官方壁纸](/zh/blog/official-iphone-duo-wallpaper)指南。`,
    },
  ],
  wallpaper: ZH_WALLPAPER,
  listing: ZH_LISTING,
  taxonomy: ZH_TAXONOMY,
  search: ZH_SEARCH,
  notFound: {
    eyebrow: "404 错误",
    h1: "这一页被折叠起来了。",
    body: "你要找的页面不存在或已经移动。可以试试下面的链接。",
    home: "返回首页",
    browse: "浏览壁纸",
    english: "查看这个页面的英文版",
  },
  about: ZH_ABOUT,
  contact: ZH_CONTACT,
};
