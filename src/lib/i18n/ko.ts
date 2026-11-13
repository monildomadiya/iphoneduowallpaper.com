import { KO_ABOUT, KO_CONTACT } from "@/lib/i18n/ko-pages";
import { KO_LISTING, KO_TAXONOMY } from "@/lib/i18n/ko-taxonomy";
import { KO_WALLPAPER } from "@/lib/i18n/ko-wallpaper";
import { KO_SEARCH } from "@/lib/i18n/search-strings";
import type { LocaleContent } from "@/lib/i18n/types";

/**
 * Korean. Search Console shows South Korea at 95 clicks from 1,351 impressions on English pages.
 * Titles spell the phone 아이폰 듀오 with 배경화면, as people search it; body copy keeps Apple's
 * "iPhone Duo". Only the most-downloaded wallpapers have a page here, so the others link to English.
 */
export const KO: LocaleContent = {
  locale: "ko",
  name: "한국어",
  ogLocale: "ko_KR",
  chrome: {
    locale: "ko",
    homeHref: "/ko",
    homeLabel: "홈",
    searchPath: "/ko/search",
    nav: [
      { href: "/ko/wallpapers", label: "배경화면", icon: "wallpapers" },
      { href: "/ko/categories", label: "카테고리", icon: "categories" },
      { href: "/ko/devices", label: "기기", icon: "devices" },
      { href: "/ko/maker", label: "만들기", icon: "maker" },
    ],
    header: {
      skip: "본문으로 건너뛰기",
      home: "{site} 홈",
      search: "검색…",
      searchLabel: "배경화면 검색",
      searchPlaceholder: "배경화면 검색…",
      openMenu: "메뉴 열기",
      closeMenu: "메뉴 닫기",
      close: "닫기",
      closeSearch: "검색 닫기",
      quickLinks: "바로가기",
      menuLinks: [
        { href: "/ko/about", label: "소개" },
        { href: "/ko/contact", label: "문의하기" },
        { href: "/privacy-policy", label: "개인정보" },
        { href: "/terms", label: "약관" },
      ],
    },
    quickLinks: [
      { href: "/ko/wallpapers?sort=popular", label: "다운로드 많은 배경화면" },
      { href: "/ko/maker", label: "iPhone Duo 배경화면 만들기" },
      { href: "/ko/categories/dark", label: "다크 & AMOLED 배경화면" },
      { href: "/ko/categories/landscape", label: "풍경 배경화면" },
      { href: "/ko/devices/iphone-duo-inner-display", label: "iPhone Duo 내부 화면" },
      { href: "/ko/devices/iphone-duo-outer-display", label: "iPhone Duo 외부 화면" },
    ],
    footer: {
      disclaimer:
        "{site}는 독립 웹사이트로 Apple Inc.와 제휴 관계가 없으며 Apple의 승인이나 후원을 받지 않습니다. iPhone, iPhone Duo, iOS는 미국 및 기타 국가에 등록된 Apple Inc.의 상표이며, 여기서는 기기 호환성을 설명하기 위해서만 사용됩니다. 배경화면은 개인적이고 비상업적인 사용을 위해 제공됩니다.",
      groups: [
        {
          title: "둘러보기",
          links: [
            { href: "/ko/wallpapers", label: "모든 배경화면" },
            { href: "/ko/wallpapers?sort=popular", label: "다운로드 많은 순" },
            { href: "/ko/categories", label: "카테고리" },
            { href: "/ko/categories/dark", label: "다크 & AMOLED" },
            { href: "/ko/categories/landscape", label: "풍경" },
            { href: "/ko/maker", label: "배경화면 만들기" },
          ],
        },
        {
          title: "기기",
          links: [
            { href: "/ko/devices/iphone-duo-outer-display", label: "iPhone Duo 외부 화면" },
            { href: "/ko/devices/iphone-duo-inner-display", label: "iPhone Duo 내부 화면" },
            { href: "/ko/devices/iphone-18-pro-max", label: "iPhone 18 Pro Max" },
            { href: "/ko/devices/iphone-18-pro", label: "iPhone 18 Pro" },
          ],
        },
        {
          title: "가이드",
          links: [
            { href: "/ko/blog", label: "모든 가이드" },
            { href: "/ko/blog/official-iphone-duo-wallpaper", label: "iPhone Duo 공식 배경화면" },
            { href: "/ko/blog/iphone-duo-wallpaper-sizes-explained", label: "배경화면 크기" },
            { href: "/ko/about", label: "소개" },
            { href: "/ko/contact", label: "문의하기" },
          ],
        },
        {
          title: "법적 고지",
          links: [
            { href: "/privacy-policy", label: "개인정보 처리방침" },
            { href: "/terms", label: "이용 약관" },
            { href: "/cookie-policy", label: "쿠키 정책" },
            { href: "/disclaimer", label: "면책 조항" },
            { href: "/dmca", label: "DMCA 및 저작권" },
          ],
        },
      ],
      rights: "모든 권리 보유.",
      languages: "언어",
    },
  },
  cookies: {
    label: "쿠키 안내",
    before: "사이트 운영, 방문자 측정, Google 등 파트너의 광고 표시를 위해 쿠키를 사용합니다. 자세한 내용은 ",
    between: " 및 ",
    after: "에서 확인하세요.",
    cookiePolicy: "쿠키 정책",
    privacyPolicy: "개인정보 처리방침",
    accept: "확인",
  },
  home: {
    title: "아이폰 듀오 배경화면 — iPhone Duo 무료 HD 다운로드",
    description: "iPhone 18 Duo의 5.4인치 외부 화면과 7.6인치 내부 화면에 맞는 아이폰 듀오 HD 배경화면을 무료로 다운로드하세요. 앱도 가입도 필요 없습니다.",
    fourK: {
      title: "아이폰 듀오 4K 배경화면 — 무료 다운로드",
      description: "iPhone Duo(iPhone 18 Duo) 기본 해상도의 무료 4K 배경화면: 외부 화면 1398×2034, 내부 화면 2670×1878. 바로 쓰는 세트, 가입 필요 없음.",
      h1: "아이폰 듀오 배경화면,",
      h1Accent: "4K.",
      intro: "5.4인치 외부 화면과 7.6인치 내부 화면을 위한 세트, iPhone 18 Pro 크기도 함께 제공합니다.",
      fullResolution: "4K, 기본 해상도",
      faqAnswer:
        "네. 모든 배경화면에 4K 원본 파일(긴 변 3840픽셀)과 각 화면의 기본 해상도 파일이 있습니다. 외부 화면 1398 × 2034, 내부 화면 2670 × 1878, 그리고 iPhone 18 Pro와 Pro Max용입니다. 대부분의 원본은 원래 이미지를 AI로 확대한 것이며 각 페이지의 상세 정보에 표시합니다.",
    },
    badgeNew: "NEW",
    badge: "iPhone Duo를 위한 디자인",
    h1: "아이폰 듀오 배경화면,",
    h1Accent: "두 화면을 위해.",
    intro: "5.4인치 외부 화면, 7.6인치 내부 화면, iPhone 18 Pro를 위한 원본 해상도 오리지널 디자인.",
    browse: "배경화면 둘러보기",
    explore: "카테고리 살펴보기",
    stats: {
      wallpapers: "배경화면 {n}개",
      fullResolution: "원본 해상도",
      free: "무료, 가입 없음",
      original: "오리지널 & 라이선스",
    },
    featured: ["추천.", "직접 골랐습니다."],
    latest: ["최신.", "방금 도착했습니다."],
    categories: ["카테고리.", "내 스타일을 찾아보세요."],
    guides: ["가이드.", "한국어로."],
    viewAll: "모두 보기",
    makerTitle: "직접 만들어 보세요.",
    makerBody:
      "어떤 사진이든 두 화면에 맞는 세트로 바꿔 보세요. 외부 화면 1398 × 2034, 내부 화면 2670 × 1878로 각 화면에 맞춰 구도를 잡습니다. 무료이며 사진은 기기 밖으로 나가지 않습니다.",
    makerCta: "배경화면 만들기 열기",
    aboutTitle: "iPhone Duo의 두 화면을 위한 배경화면.",
    about: `iPhone Duo(iPhone 18 Duo나 아이폰 폴드로도 검색됩니다)에는 모양이 전혀 다른 두 화면이 있습니다. 해상도 1398 × 2034의 길쭉한 5.4인치 외부 화면과, 작은 태블릿처럼 펼쳐지는 해상도 2670 × 1878의 넓은 7.6인치 내부 화면입니다. 일반 iPhone용 배경화면은 외부 화면에서 위아래가 조금 잘리고, 내부 화면에서는 훨씬 많이 잘립니다.

여기 있는 모든 배경화면은 원본 해상도의 HD로 무료 다운로드할 수 있으며, 저장하기 전에 [외부 화면](/ko/devices/iphone-duo-outer-display)과 [내부 화면](/ko/devices/iphone-duo-inner-display)에 어떻게 맞는지 보여 드립니다. 어떤 크기가 필요한지 잘 모르겠다면 [iPhone Duo 배경화면 크기](/ko/blog/iphone-duo-wallpaper-sizes-explained) 가이드를 읽어 보세요. Apple의 사막 사구 공식 배경화면을 찾으신다면 [iPhone Duo 공식 배경화면](/ko/blog/official-iphone-duo-wallpaper) 가이드에서 설명합니다.

다운로드가 많은 배경화면은 한국어 페이지가 있고, 나머지 페이지는 아직 영어입니다. 다운로드와 화면 맞춤 확인은 똑같이 작동합니다.`,
    faqTitle: ["궁금한 점이 있으신가요?", "답을 준비했습니다."],
    faq: [
      {
        question: "배경화면은 무료인가요?",
        answer: "네. 모든 배경화면은 본인 기기에서 개인적으로 사용하도록 무료로 다운로드할 수 있으며 계정이나 앱이 필요 없습니다. 상업적 사용과 재배포는 금지됩니다.",
      },
      {
        question: "이 배경화면은 iPhone Duo의 내부·외부 화면에 맞나요?",
        answer:
          "각 배경화면 페이지에서 iPhone Duo 외부 화면(1398 × 2034), 펼친 내부 화면(2670 × 1878), iPhone 18 Pro 모델에 어떻게 맞는지 보여 드리므로 다운로드 전에 알맞은 것을 고를 수 있습니다.",
      },
      {
        question: "iPhone Duo, iPhone 18 Duo, 아이폰 폴드는 같은 제품인가요?",
        answer:
          "네, 모두 같은 폴더블 iPhone을 가리키는 이름입니다. 접었을 때 쓰는 5.4인치 외부 화면(1398 × 2034)과 작은 태블릿처럼 펼쳐지는 7.6인치 내부 화면(2670 × 1878)이 있습니다. 여기 있는 모든 배경화면은 두 화면에서 확인합니다.",
      },
      {
        question: "iPhone Duo 공식 배경화면은 어디에서 찾을 수 있나요?",
        answer:
          "Apple의 iPhone Duo 공식 배경화면은 산맥 앞에 펼쳐진 사막 사구로, 라이트와 다크 버전이 있으며 iPhone Duo에 기본 탑재되어 있습니다. Apple의 저작물이므로 여기서는 제공하지 않으며, 공식 배경화면 가이드에서 크기와 설정 방법을 설명합니다. 이 사이트의 모든 배경화면은 같은 두 화면을 위해 만든 오리지널 작품입니다.",
      },
      {
        question: "이 배경화면은 4K인가요?",
        answer:
          "아직은 아닙니다. 지금 라이브러리는 HD입니다. 모든 배경화면은 원본 해상도로 게시하며, 페이지에 정확한 픽셀 크기와 화질 표시(긴 변 3840픽셀 이상인 파일만 4K로 표시), 화면별 맞춤 정보를 보여 드립니다. 그래서 7.6인치 내부 화면(2670 × 1878)에서 얼마나 선명할지 다운로드 전에 알 수 있습니다.",
      },
      {
        question: "iPhone에 배경화면을 어떻게 설정하나요?",
        answer:
          "이미지를 사진에 저장한 다음 설정 → 배경화면에서 새 배경화면을 추가하거나, 잠금 화면을 길게 누르고 + 버튼을 탭합니다. iPhone에서는 다운로드한 파일이 먼저 파일 → 다운로드에 저장되므로, 찾기 전에 이미지를 사진으로 옮겨 주세요.",
      },
      {
        question: "Apple과 관련이 있나요?",
        answer: "아니요. 이곳은 독립적인 팬 및 디자인 사이트입니다. iPhone과 iPhone Duo는 Apple Inc.의 상표이며, 여기서는 기기 호환성을 설명하기 위해서만 사용됩니다.",
      },
    ],
  },
  maker: {
    title: "아이폰 듀오 배경화면 만들기 — 외부·내부 화면",
    description: "어떤 사진으로든 iPhone Duo 배경화면을 만드세요. 1398 × 2034 외부 화면과 2670 × 1878 내부 화면에 맞게 자르고 함께 다운로드합니다. 브라우저에서 무료로.",
    eyebrow: "무료 도구",
    h1: "iPhone Duo 배경화면 만들기",
    lead: "어떤 사진이든 iPhone Duo의 두 화면에 맞는 세트로 바꿔 보세요. 외부 화면용 길쭉한 파일과 내부 화면용 넓은 파일을 브라우저에서 무료로 만듭니다.",
    breadcrumb: "배경화면 만들기",
    stepsTitle: ["사용 방법.", "네 단계, 두 화면."],
    step: "{n}단계",
    steps: [
      {
        title: "사진 고르기",
        body: "휴대폰이나 컴퓨터에서 이미지를 고르거나, 배경화면 페이지에서 저희 배경화면을 만들기 도구로 여세요. 아무것도 업로드되지 않으며 자르기는 브라우저에서 이루어집니다.",
      },
      {
        title: "화면별 구도 잡기",
        body: "각 미리보기 안에서 이미지를 끌고 확대·축소를 조정하세요. 길쭉한 외부 화면과 넓은 내부 화면의 구도를 따로 잡으므로 피사체가 양쪽 모두에서 제자리에 놓입니다.",
      },
      {
        title: "선명도 확인하기",
        body: "각 미리보기 아래에 사진의 픽셀이 그 화면에 충분한지, 확대가 필요한지 알려 줍니다. 모든 배경화면 페이지의 확인과 같은 기능입니다.",
      },
      {
        title: "두 파일 다운로드하기",
        body: "외부 화면용 1398 × 2034, 내부 화면용 2670 × 1878 파일 두 개를 받습니다. 파일 이름으로 사진 앱에서 쉽게 구분할 수 있습니다.",
      },
    ],
    whyTitle: "iPhone Duo에 배경화면 파일이 두 개 필요한 이유",
    why: `5.4인치 외부 화면은 해상도 1398 × 2034의 길쭉한 세로 화면입니다. 휴대폰을 펼치면 7.6인치 내부 화면은 해상도 2670 × 1878로 높이보다 너비가 넓습니다. 이미지 하나로 두 화면을 모두 잘 채우기는 어렵습니다. 세로 사진은 내부 화면에서 가운데 부분만 남고, 가로 사진은 외부 화면에서 좁은 조각이 됩니다.

만들기 도구는 화면마다 정확한 해상도로 따로 잘라 iOS가 이미지를 확대하지 않고 픽셀 그대로 표시하게 합니다. 가장 좋은 결과를 얻으려면 너비 2670픽셀 이상의 사진으로 시작하세요. 외부 화면에서는 피사체를 가운데에 두고, 내부 화면에서는 휴대폰이 접히는 중앙선에서 살짝 비켜 두세요. 자세한 내용은 [iPhone Duo 배경화면 크기](/ko/blog/iphone-duo-wallpaper-sizes-explained) 가이드에 있습니다.

다 만드셨나요? 두 화면을 위해 만든 [다른 배경화면도 둘러보세요](/ko/wallpapers).`,
    faqTitle: ["궁금한 점이 있으신가요?", "만들기 도구에 대해."],
    faq: [
      {
        question: "iPhone Duo 배경화면 만들기는 무료인가요?",
        answer: "네. 계정이 필요 없고 워터마크도 없으며 만들 수 있는 개수에 제한도 없습니다. 직접 찍은 사진으로 만든 배경화면은 자유롭게 사용하세요.",
      },
      {
        question: "제 사진이 어딘가에 업로드되나요?",
        answer: "아니요. 사진은 기기의 브라우저에서 열리고 잘리며, 완성된 파일도 거기서 바로 저장됩니다. 서버로 전송되는 것은 없습니다.",
      },
      {
        question: "어떤 크기로 내보내나요?",
        answer: "iPhone Duo 외부 화면은 정확히 1398 × 2034픽셀, 내부 화면은 2670 × 1878픽셀이며 JPG 또는 PNG입니다. 이 크기에서는 iOS가 이미지를 확대하지 않고 픽셀 그대로 표시합니다.",
      },
      {
        question: "제 사진이 흐릿하게 보인다고 나오는 이유는 무엇인가요?",
        answer: "선택한 영역의 픽셀이 화면보다 적어 이미지를 확대해야 하기 때문입니다. 축소하거나 더 큰 원본을 사용하세요. 너비 2670픽셀 이상이면 내부 화면을, 높이 2034픽셀 이상이면 외부 화면을 채웁니다.",
      },
      {
        question: "어떤 이미지 형식을 사용할 수 있나요?",
        answer: "모든 최신 브라우저에서 JPG, PNG, WebP를 사용할 수 있습니다. iPhone 사진 보관함에서 사진을 고르면 iOS가 보통 JPG로 브라우저에 넘겨주므로 HEIC 사진도 사용할 수 있습니다.",
      },
      {
        question: "두 파일을 iPhone Duo에 어떻게 설정하나요?",
        answer: "두 파일을 모두 사진에 저장하고 잠금 화면을 길게 누른 뒤 + 버튼을 탭하고, 사진을 선택한 다음 해당 화면의 파일을 고르세요.",
      },
    ],
    ui: {
      outerName: "외부 화면",
      outerHint: "접었을 때 · 5.4인치",
      innerName: "내부 화면",
      innerHint: "펼쳤을 때 · 7.6인치",
      previewLabel: "미리보기",
      formatLabel: "파일 형식",
      modeLock: "잠금 화면",
      modeHome: "홈 화면",
      modeClean: "배경화면만",
      pixelPerfect: "픽셀 단위로 선명",
      pixelPerfectNote: "맞추기 위해 축소되었지만 선명합니다.",
      greatFit: "아주 잘 맞음",
      slightlySoft: "약간 흐릿함",
      soft: "흐릿함",
      enlarged: "화면을 채우기 위해 {n}% 확대했습니다.",
      fixZoomOut: "축소하거나 더 큰 사진을 사용하세요.",
      fixLarger: "더 큰 사진이 더 선명합니다.",
      zoom: "확대",
      reset: "{screen} 구도 초기화",
      dragHint: "{screen} 미리보기. 이미지를 끌거나 화살표 키로 옮기세요.",
      emptyHint: "이 화면에서 얼마나 선명한지 보려면 사진을 고르세요.",
      downloadOuter: "외부 화면 다운로드",
      downloadInner: "내부 화면 다운로드",
      choose: "사진 고르기",
      change: "사진 바꾸기",
      loading: "배경화면을 불러오는 중…",
      dropHint: "또는 이미지를 여기에 놓으세요. 기기 밖으로 나가지 않습니다.",
      pixels: "{w} × {h}픽셀",
      downloadBoth: "둘 다 다운로드",
      preparing: "준비 중…",
      exportNote: "정확히 {outer}와 {inner} 크기로 내보냅니다. 사진은 절대 업로드되지 않습니다.",
      loadFailed: "이 배경화면을 불러올 수 없습니다. 대신 사진을 골라 주세요.",
      notImage: "이 파일은 이미지가 아닙니다.",
      tooLarge: "이 사진은 40MB를 넘습니다. 더 작은 사진을 골라 주세요.",
      cantOpen: "이 브라우저에서 이미지를 열 수 없습니다. JPG, PNG, WebP를 시도해 보세요.",
      exportFailed: "배경화면을 만들 수 없습니다. 다시 시도하거나 다른 사진을 골라 주세요.",
    },
  },
  blog: {
    title: "아이폰 듀오 배경화면 가이드",
    description: "iPhone Duo 배경화면 한국어 가이드: Apple 공식 배경화면, 외부·내부 화면 크기, 선명한 배경화면을 고르는 방법.",
    breadcrumb: "가이드",
    h1: "한국어 가이드.",
    lead: "iPhone Duo의 두 화면에서 배경화면이 선명하게 보이도록 알아야 할 모든 것.",
    by: "작성:",
    team: "{site} 편집팀",
    minRead: "{n}분 분량",
    toc: "이 가이드의 내용",
    english: "영어로 읽기",
    more: ["더 많은 가이드.", "한국어로."],
    wallpapers: ["이런 배경화면을 써 보세요.", "라이브러리의 새 작품."],
  },
  guides: [
    {
      slug: "official-iphone-duo-wallpaper",
      title: "iPhone Duo 공식 배경화면: 라이트와 다크 사구, 크기, 받는 방법",
      seoTitle: "아이폰 듀오 공식 배경화면: 라이트와 다크, 크기",
      description: "iPhone Duo 공식 배경화면은 라이트와 다크 버전의 사막 사구입니다. 외부·내부 화면의 정확한 크기, 4K 여부, 설정 방법을 알아봅니다.",
      excerpt: "Apple은 iPhone Duo를 위해 배경화면 네 장을 준비했습니다. 산맥 아래 사막 사구로, 라이트와 다크 버전이 있습니다. 모습, 화면별 정확한 크기, 출처, 설정 방법을 소개합니다.",
      tags: ["iPhone Duo", "공식 배경화면"],
      published: "2026-11-03",
      content: `Apple은 첫 폴더블 iPhone인 iPhone Duo를 발표하면서 새 배경화면을 함께 선보였습니다. 험준한 산맥 앞에 펼쳐진 광활한 사막 사구입니다. "아이폰 듀오 배경화면"을 검색하는 분들이 떠올리는 이미지가 대부분 이것입니다. 이 가이드에서는 공식 배경화면이 어떤 모습인지, 화면별 정확한 크기, 파일의 출처, 지금 쓰는 휴대폰에서 같은 분위기를 내는 방법을 설명합니다.

## iPhone Duo 공식 배경화면은 어떤 모습인가요

공식 이미지는 **네 장**입니다. 두 장은 라이트 모드용, 두 장은 다크 모드용입니다.

- **라이트 버전**은 낮의 사구를 보여 줍니다. 옅은 파란 하늘 아래 따뜻한 베이지색 모래입니다.
- **다크 버전**은 같은 풍경의 밤입니다. 깊은 그림자, 별이 가득한 하늘, 지평선의 은은한 빛이 어우러집니다.

최근 Apple 배경화면 대부분이 그렇듯, 이 세트도 화면 모드에 따라 바뀌도록 설계되었습니다. 낮에는 라이트, 밤이나 다크 모드에서는 다크로 표시됩니다.

## 버전마다 파일이 두 개인 이유

iPhone Duo의 두 화면은 모양이 많이 달라 이미지 하나로 모두 채울 수 없습니다.

| 화면 | 해상도 | 형태 |
| --- | --- | --- |
| 외부 화면(5.4인치, 접었을 때) | 1398 × 2034 | 길쭉한 세로형 |
| 내부 화면(7.6인치, 펼쳤을 때) | 2670 × 1878 | 넓은 가로형 |

Apple은 두 화면에 맞춰 장면을 각각 그리는 방식으로 이 문제를 해결했습니다. 휴대폰을 접으면 외부 화면에 사구의 가까운 부분이 보입니다. 펼치면 배경화면이 넓어지면서 전체 풍경이 내부 화면을 채웁니다. 공식 세트에 라이트와 다크 버전별로 길쭉한 이미지와 넓은 이미지가 하나씩 있는 이유입니다.

파일을 하나만 받는다면 사용할 화면에 맞춰 만든 파일을 고르세요. 길쭉한 외부 화면 이미지를 넓은 내부 화면에 채우면 약 1.9배 확대되고 높이의 절반 이상이 사라집니다. 자세한 설명은 [iPhone Duo 배경화면 크기](/ko/blog/iphone-duo-wallpaper-sizes-explained) 가이드에 있습니다.

## 공식 배경화면은 4K인가요

아닙니다. Apple의 파일은 각 화면의 정확한 크기입니다. 외부 화면은 1398 × 2034, 내부 화면은 2670 × 1878입니다. 어느 쪽도 보통 4K를 뜻하는 긴 변 3840픽셀에 미치지 않습니다. 인터넷에서 "4K" 버전을 볼 수도 있지만 Apple 파일을 확대한 것입니다. 확대한 이미지는 큰 화면에서 깔끔해 보일 수 있어도 원본에 없던 디테일이 생기지는 않습니다. iPhone Duo에서는 원본 파일이 이미 픽셀 단위로 선명합니다.

## 공식 배경화면은 어디에서 왔나요

이 배경화면들은 iPhone Duo에 기본 탑재되어 있어 휴대폰을 설정하면 배경화면 갤러리에서 바로 쓸 수 있습니다. 다른 iPhone용 iOS 27에는 포함되어 있지 않습니다. 출시 전에 Apple 개발자 도구(Xcode 27.1 베타의 iPhone Duo 시뮬레이터)에서 발견되었고, [9to5Mac](https://9to5mac.com/2026/09/18/download-the-iphone-duos-official-light-and-dark-wallpapers-here/) 같은 Apple 소식 사이트에 공개되었습니다.

**저희는 Apple의 배경화면을 제공하지 않습니다.** Apple의 저작물로, 기기에서 쓰도록 기기와 함께 제공되지만 자유롭게 재배포할 수는 없습니다. 이 사이트의 모든 것은 iPhone Duo 화면을 위해 만든 오리지널 작품입니다.

## iPhone Duo에 공식 배경화면 설정하기

1. 잠금 화면을 길게 누른 다음 **+** 버튼을 탭합니다.
2. Apple 컬렉션으로 스크롤해 사구 배경화면을 선택합니다.
3. 화면 모드에 따라 바뀌게 할지 선택합니다(낮에는 라이트, 밤에는 다크).
4. **추가**를 탭하고 홈 화면에도 사용하도록 선택합니다.

iPhone Duo에서는 각 화면을 해당 상태에서 설정하세요. 외부 화면은 접은 상태, 내부 화면은 펼친 상태에서 설정하면 실제로 잘리는 모습을 볼 수 있습니다.

## 다운로드한 사본을 다른 iPhone에서 쓰기

공식 이미지를 저장해 iPhone 18 Pro나 이전 iPhone에서 쓰려면 길쭉한 외부 화면 버전을 고르세요. 형태가 더 비슷하지만, 외부 화면은 높이에 비해 일반 iPhone보다 넓어 이미지 너비의 약 3분의 1이 좌우에서 잘립니다. 넓은 내부 화면 버전은 좁은 세로 조각만 남습니다. 그런 다음 [iPhone에서 배경화면 설정하기](/blog/how-to-set-wallpaper-on-iphone) 가이드(영어)를 따라 하세요.

## 비슷한 분위기의 오리지널 배경화면

공식 배경화면의 고요한 사막 황혼이 좋지만 남들과 다른 것을 원하신다면, 라이브러리의 오리지널 작품 중 이런 차분한 풍경이 있습니다.

- [미드나잇 블루 사구](/ko/wallpapers/midnight-blue-desert-dunes-dual-iphone-wallpaper): 깔끔한 밤하늘 아래 부드러운 모래 곡선. 다크 버전과 가장 비슷합니다.
- [흑백 사막의 강](/ko/wallpapers/monochrome-desert-river-minimalist-wallpaper): 검은 사구 사이를 굽이치는 밝은 강.
- [미드나잇 설봉 AMOLED](/ko/wallpapers/midnight-peak-amoled-duo-wallpaper): AMOLED를 좋아하는 분을 위한, 순수한 검정 위의 눈 덮인 봉우리 하나.
- [설산과 달](/ko/wallpapers/minimal-snow-mountain-moon-landscape-duo-wallpaper): 부드러운 파란 하늘 아래 얼어붙은 봉우리.
- [안개 산의 소나무](/ko/wallpapers/misty-mountain-pine-tree-duo-wallpaper): 구름 속으로 사라지는 바위 봉우리.

각 배경화면 페이지에서 다운로드 전에 정확한 해상도와, iPhone Duo 외부·내부 화면 및 iPhone 18 Pro에 어떻게 맞는지 확인할 수 있습니다. 이런 스타일을 더 보려면 [풍경](/ko/categories/landscape) 카테고리를, 다크 버전 같은 야경을 보려면 [다크 & AMOLED](/ko/categories/dark) 페이지를 둘러보세요. 직접 찍은 사진을 쓰고 싶으신가요? [iPhone Duo 배경화면 만들기](/ko/maker)가 두 화면에 맞게 잘라 줍니다.`,
    },
    {
      slug: "iphone-duo-wallpaper-sizes-explained",
      title: "iPhone Duo 배경화면 크기: 외부 화면과 내부 화면",
      seoTitle: "아이폰 듀오 배경화면 크기: 외부·내부 화면",
      description: "iPhone Duo 외부 화면(1398 × 2034)과 내부 화면(2670 × 1878)의 정확한 해상도, 두 화면 모두 선명한 배경화면을 고르는 간단한 규칙.",
      excerpt: "iPhone Duo에는 모양이 많이 다른 두 화면이 있습니다. 정확한 해상도와, 양쪽 모두 선명한 배경화면을 고르는 간단한 규칙을 소개합니다.",
      tags: ["iPhone Duo", "해상도"],
      published: "2026-11-03",
      content: `iPhone Duo는 Apple의 첫 폴더블 iPhone으로 **두 개의 화면**이 있습니다. 접었을 때 쓰는 5.4인치 외부 화면과 책처럼 펼쳐지는 7.6인치 내부 화면입니다. 두 화면의 사용 방향이 달라, 한쪽에서 완벽한 배경화면이 다른 쪽에서는 잘려 보일 수 있습니다. 이 가이드에서는 숫자를 설명하고 몇 가지 간단한 규칙을 알려 드립니다.

## 화면 해상도 한눈에 보기

| 화면 | 크기 | 해상도(사용 시) | 방향 |
| --- | --- | --- | --- |
| iPhone Duo 외부 화면 | 5.4인치 | 1398 × 2034 px | 세로(길쭉함) |
| iPhone Duo 내부 화면 | 7.6인치 | 2670 × 1878 px | 가로(넓음, 펼침) |
| iPhone 18 Pro Max | 6.9인치 | 1320 × 2868 px | 세로 |
| iPhone 18 Pro | 6.3인치 | 1206 × 2622 px | 세로 |

사양표에는 내부 화면이 1878 × 2670으로 적힌 경우가 많습니다. 같은 패널입니다. iPhone Duo를 펼치면 힌지가 세로로 놓이고 화면은 가로가 되므로, 저희는 2670 × 1878로 표기합니다.

## 규칙 1: 해상도를 맞추거나 넘기기

배경화면은 가로세로 모두 **최소한** 화면만큼 커야 합니다. 더 작은 이미지는 늘어나 흐릿해 보입니다. 이 사이트의 모든 배경화면은 정확한 해상도를 표시하므로 다운로드 전에 확인할 수 있습니다.

## 규칙 2: 화면마다 알맞은 형태 고르기

- **외부 화면**: 길쭉한 세로형 배경화면을 고르세요. 1398 × 2034 이상으로 긴 이미지라면 무리 없이 맞습니다.
- **내부 화면**: 넓은 배경화면이나 **정사각형** 이미지를 고르세요. 정사각형 이미지(예: 2670 × 2670)는 펼친 휴대폰을 돌릴 때 iOS가 구도를 다시 잡을 여유를 줍니다.
- **두 화면에 같은 배경화면**: 행성, 꽃, 그라데이션 구체처럼 가운데에 뚜렷한 피사체가 있는 디자인은 두 형태 모두 보기 좋게 잘립니다.

직접 찍은 사진을 쓰고 싶다면 [iPhone Duo 배경화면 만들기](/ko/maker)가 두 번의 자르기를 정확한 크기로 해 드립니다.

## 규칙 3: 주름과 시계 살피기

내부 화면의 접히는 선은 정확히 가운데를 지나갑니다. 한가운데에 강한 세로선이 있는 배경화면은 주름을 더 눈에 띄게 할 수 있으므로, 피사체가 가운데에서 비켜 있으면 대체로 더 보기 좋습니다. 잠금 화면에서는 시계와 위젯을 위해 위쪽에 여백을 조금 남겨 두세요.

## 규칙 4: 화질 좋은 형식 고르기

JPEG와 PNG는 어디서나 사용할 수 있습니다. PNG는 단색과 그라데이션을 밴딩 없이 유지하고, JPEG는 사진 용량을 작게 유지합니다. 배경화면 스크린샷은 피하세요. 화질이 떨어지고 인터페이스 요소가 함께 찍힙니다.

## 빠른 체크리스트

1. 배경화면 페이지에서 해상도를 확인합니다.
2. 외부 화면에는 세로형, 내부 화면에는 넓거나 정사각형인 이미지를 씁니다.
3. 내부 화면에서는 주요 피사체를 정확한 중앙선에서 비켜 둡니다.
4. 미리보기를 저장하지 말고 원본 파일을 다운로드합니다.

[iPhone Duo 내부 화면 배경화면](/ko/devices/iphone-duo-inner-display)과 [외부 화면 배경화면](/ko/devices/iphone-duo-outer-display)을 둘러보세요. 모두 게시 전에 크기를 확인했습니다. Apple의 배경화면을 찾으신다면 [iPhone Duo 공식 배경화면](/ko/blog/official-iphone-duo-wallpaper) 가이드를 읽어 보세요.`,
    },
  ],
  wallpaper: KO_WALLPAPER,
  listing: KO_LISTING,
  taxonomy: KO_TAXONOMY,
  search: KO_SEARCH,
  notFound: {
    eyebrow: "404 오류",
    h1: "이 페이지는 접혀서 사라졌습니다.",
    body: "찾으시는 페이지가 없거나 옮겨졌습니다. 아래 링크를 이용해 보세요.",
    home: "홈으로 가기",
    browse: "배경화면 둘러보기",
    english: "이 페이지를 영어로 보기",
  },
  about: KO_ABOUT,
  contact: KO_CONTACT,
};
