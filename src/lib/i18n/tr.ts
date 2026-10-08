import { TR_LISTING, TR_TAXONOMY } from "@/lib/i18n/tr-taxonomy";
import { TR_ABOUT, TR_CONTACT } from "@/lib/i18n/tr-pages";
import { TR_SEARCH } from "@/lib/i18n/search-strings";
import { TR_WALLPAPER } from "@/lib/i18n/tr-wallpaper";
import type { LocaleContent } from "@/lib/i18n/types";

/**
 * Turkish. Search Console shows "iphone duo duvar kağıdı" bringing clicks to the English home page,
 * which has nothing in Turkish. Wallpaper pages themselves stay in English, so these pages link to
 * them and say so.
 */
export const TR: LocaleContent = {
  locale: "tr",
  name: "Türkçe",
  ogLocale: "tr_TR",
  chrome: {
    locale: "tr",
    homeHref: "/tr",
    homeLabel: "Ana sayfa",
    searchPath: "/tr/search",
    nav: [
      { href: "/tr/wallpapers", label: "Duvar kağıtları", icon: "wallpapers" },
      { href: "/tr/categories", label: "Kategoriler", icon: "categories" },
      { href: "/tr/devices", label: "Cihazlar", icon: "devices" },
      { href: "/tr/maker", label: "Oluşturucu", icon: "maker" },
      { href: "/tr/blog", label: "Rehberler", icon: "guides" },
    ],
    header: {
      skip: "İçeriğe geç",
      home: "{site} ana sayfa",
      search: "Ara…",
      searchLabel: "Duvar kağıdı ara",
      searchPlaceholder: "Duvar kağıdı ara…",
      openMenu: "Menüyü aç",
      closeMenu: "Menüyü kapat",
      close: "Kapat",
      closeSearch: "Aramayı kapat",
      quickLinks: "Hızlı bağlantılar",
      menuLinks: [
        { href: "/tr/about", label: "Hakkımızda" },
        { href: "/tr/contact", label: "İletişim" },
        { href: "/privacy-policy", label: "Gizlilik" },
        { href: "/terms", label: "Koşullar" },
      ],
    },
    quickLinks: [
      { href: "/tr/wallpapers?sort=popular", label: "En çok indirilen duvar kağıtları" },
      { href: "/tr/maker", label: "iPhone Duo duvar kağıdı oluşturucu" },
      { href: "/tr/categories/dark", label: "Koyu ve AMOLED duvar kağıtları" },
      { href: "/tr/categories/landscape", label: "Manzara duvar kağıtları" },
      { href: "/tr/devices/iphone-duo-inner-display", label: "iPhone Duo iç ekran" },
      { href: "/tr/devices/iphone-duo-outer-display", label: "iPhone Duo dış ekran" },
    ],
    footer: {
      disclaimer:
        "{site} bağımsız bir web sitesidir; Apple Inc. ile bağlantılı değildir, Apple tarafından onaylanmamış veya desteklenmemiştir. iPhone, iPhone Duo ve iOS, Apple Inc.'in ABD'de ve diğer ülkelerde tescilli ticari markalarıdır ve burada yalnızca cihaz uyumluluğunu belirtmek için kullanılır. Duvar kağıtları kişisel ve ticari olmayan kullanım içindir.",
      groups: [
        {
          title: "Keşfet",
          links: [
            { href: "/tr/wallpapers", label: "Tüm duvar kağıtları" },
            { href: "/tr/wallpapers?sort=popular", label: "En çok indirilenler" },
            { href: "/tr/categories", label: "Kategoriler" },
            { href: "/tr/categories/dark", label: "Koyu ve AMOLED" },
            { href: "/tr/categories/landscape", label: "Manzara" },
            { href: "/tr/maker", label: "Duvar kağıdı oluşturucu" },
          ],
        },
        {
          title: "Cihazlar",
          links: [
            { href: "/tr/devices/iphone-duo-outer-display", label: "iPhone Duo dış ekran" },
            { href: "/tr/devices/iphone-duo-inner-display", label: "iPhone Duo iç ekran" },
            { href: "/tr/devices/iphone-18-pro-max", label: "iPhone 18 Pro Max" },
            { href: "/tr/devices/iphone-18-pro", label: "iPhone 18 Pro" },
          ],
        },
        {
          title: "Rehberler",
          links: [
            { href: "/tr/blog", label: "Tüm rehberler" },
            { href: "/tr/blog/official-iphone-duo-wallpaper", label: "Resmî iPhone Duo duvar kağıdı" },
            { href: "/tr/blog/iphone-duo-wallpaper-sizes-explained", label: "Duvar kağıdı boyutları" },
            { href: "/tr/about", label: "Hakkımızda" },
            { href: "/tr/contact", label: "İletişim" },
          ],
        },
        {
          title: "Yasal",
          links: [
            { href: "/privacy-policy", label: "Gizlilik politikası" },
            { href: "/terms", label: "Kullanım koşulları" },
            { href: "/cookie-policy", label: "Çerez politikası" },
            { href: "/disclaimer", label: "Sorumluluk reddi" },
            { href: "/dmca", label: "DMCA ve telif hakkı" },
          ],
        },
      ],
      rights: "Tüm hakları saklıdır.",
      languages: "Diller",
    },
  },
  cookies: {
    label: "Çerez bildirimi",
    before:
      "Sitenin çalışması, trafiğin ölçülmesi ve Google gibi iş ortaklarının reklamlarının gösterilmesi için çerez kullanıyoruz. Ayrıntılar için ",
    between: " ve ",
    after: " sayfalarımıza göz atın.",
    cookiePolicy: "Çerez Politikası",
    privacyPolicy: "Gizlilik Politikası",
    accept: "Anladım",
  },
  home: {
    title: "iPhone Duo Duvar Kağıtları — Ücretsiz HD İndir",
    description:
      "iPhone 18 Duo'nun 5,4 inç dış ekranı ve 7,6 inç iç ekranı için ücretsiz HD iPhone Duo duvar kağıtları indirin. Uygulama yok, üyelik yok.",
    badgeNew: "Yeni",
    badge: "iPhone Duo için tasarlandı",
    h1: "iPhone Duo duvar kağıtları,",
    h1Accent: "iki ekran için.",
    intro: "5,4 inç dış ekran, 7,6 inç iç ekran ve iPhone 18 Pro için tam çözünürlüklü özgün tasarımlar.",
    browse: "Duvar kağıtlarına göz at",
    explore: "Kategorileri keşfet",
    stats: {
      wallpapers: "{n} duvar kağıdı",
      fullResolution: "Tam çözünürlük",
      free: "Ücretsiz, üyeliksiz",
      original: "Özgün ve lisanslı",
    },
    featured: ["Öne çıkanlar.", "Özenle seçildi."],
    latest: ["En yeniler.", "Stüdyodan taze çıktı."],
    categories: ["Kategoriler.", "Tarzını bul."],
    guides: ["Rehberler.", "Türkçe."],
    viewAll: "Tümünü gör",
    makerTitle: "Kendin yap.",
    makerBody:
      "Herhangi bir fotoğrafı iki ekrana uygun bir çifte dönüştürün: dış ekran için 1398 × 2034, iç ekran için 2670 × 1878, her biri kendi ekranına göre kadrajlanmış. Ücretsiz ve fotoğrafınız cihazınızdan hiç çıkmaz.",
    makerCta: "Duvar kağıdı oluşturucuyu aç",
    aboutTitle: "iPhone Duo'nun iki ekranı için duvar kağıtları.",
    about: `iPhone Duo —iPhone 18 Duo ya da iPhone Fold olarak da aranıyor— şekilleri birbirinden çok farklı iki ekrana sahip: 1398 × 2034 çözünürlüklü, uzun, 5,4 inç bir dış ekran ve küçük bir tablet gibi açılan, 2670 × 1878 çözünürlüklü, geniş, 7,6 inç bir iç ekran. Normal bir iPhone için hazırlanmış bir duvar kağıdı dış ekranda üstten ve alttan bir şerit kaybeder, iç ekranda ise çok daha fazlasını.

Buradaki her duvar kağıdı orijinal çözünürlüğünde, HD olarak ücretsiz indirilebilir ve her biri, kaydetmeden önce [dış ekrana](/tr/devices/iphone-duo-outer-display) ve [iç ekrana](/tr/devices/iphone-duo-inner-display) nasıl oturduğunu gösterir. Hangi boyuta ihtiyacınız olduğundan emin değil misiniz? [iPhone Duo duvar kağıdı boyutları](/tr/blog/iphone-duo-wallpaper-sizes-explained) rehberimizi okuyun. Apple'ın çöl kumullu resmî duvar kağıdını mı arıyorsunuz? [Resmî iPhone Duo duvar kağıdı](/tr/blog/official-iphone-duo-wallpaper) rehberinde anlatıyoruz.

Her duvar kağıdının sayfası İngilizcedir; indirme ve ekran uyumu kontrolü aynı şekilde çalışır.`,
    faqTitle: ["Sorularınız mı var?", "Yanıtlarımız hazır."],
    faq: [
      {
        question: "Duvar kağıtları ücretsiz mi?",
        answer:
          "Evet. Her duvar kağıdı, kendi cihazlarınızda kişisel kullanım için ücretsiz indirilebilir; hesap ya da uygulama gerekmez. Ticari kullanım ve yeniden dağıtım yasaktır.",
      },
      {
        question: "Bu duvar kağıtları iPhone Duo'nun iç ve dış ekranına uyar mı?",
        answer:
          "Her duvar kağıdı sayfası, görselin iPhone Duo dış ekranına (1398 × 2034), açık iç ekrana (2670 × 1878) ve iPhone 18 Pro modellerine nasıl oturduğunu gösterir; böylece indirmeden önce doğru olanı seçebilirsiniz.",
      },
      {
        question: "iPhone Duo, iPhone 18 Duo ya da iPhone Fold ile aynı mı?",
        answer:
          "Evet, hepsi aynı katlanabilir iPhone'un adları. Telefon kapalıyken kullanılan 5,4 inç bir dış ekranı (1398 × 2034) ve küçük bir tablet gibi açılan 7,6 inç bir iç ekranı (2670 × 1878) var. Buradaki her duvar kağıdı iki ekranda da kontrol edilir.",
      },
      {
        question: "Resmî iPhone Duo duvar kağıdını nereden bulabilirim?",
        answer:
          "Apple'ın resmî iPhone Duo duvar kağıdı —bir dağ silsilesinin önündeki çöl kumulları, açık ve koyu sürümleriyle— iPhone Duo'da yüklü gelir. Apple'ın telif hakkıyla korunan bir eseri olduğu için biz barındırmıyoruz; resmî duvar kağıdı rehberimiz boyutlarını ve nasıl ayarlanacağını anlatır. Bu sitedeki tüm duvar kağıtları aynı iki ekran için yapılmış özgün çalışmalardır.",
      },
      {
        question: "Bu duvar kağıtları 4K mı?",
        answer:
          "Henüz değil; kütüphane şimdilik HD. Her duvar kağıdı orijinal çözünürlüğünde yayınlanır ve sayfası tam piksel boyutunu bir kalite etiketiyle (4K yalnızca uzun kenarı 3840 piksel ve üzeri olan dosyalar için) ve her ekrana uyumunu gösterir; böylece 7,6 inç iç ekranda (2670 × 1878) ne kadar net görüneceğini indirmeden önce görebilirsiniz.",
      },
      {
        question: "iPhone'uma nasıl duvar kağıdı ayarlarım?",
        answer:
          "Görseli Fotoğraflar'a kaydedin, ardından Ayarlar → Duvar Kağıdı bölümünden yeni bir duvar kağıdı ekleyin ya da Kilitli Ekran'a dokunup basılı tutun ve + düğmesine dokunun. iPhone'da indirilen dosyalar önce Dosyalar → İndirilenler'e kaydedilir; aramadan önce görseli Fotoğraflar'a taşıyın.",
      },
      {
        question: "Apple ile bir bağlantınız var mı?",
        answer:
          "Hayır. Bu bağımsız bir hayran ve tasarım sitesidir. iPhone ve iPhone Duo, Apple Inc.'in ticari markalarıdır ve burada yalnızca cihaz uyumluluğunu belirtmek için kullanılır.",
      },
    ],
  },
  maker: {
    title: "iPhone Duo Duvar Kağıdı Oluşturucu — Dış ve İç Ekran",
    description:
      "Herhangi bir fotoğraftan iPhone Duo duvar kağıdı yapın: 1398 × 2034 dış ve 2670 × 1878 iç ekran için kırpın, ikisini de indirin. Ücretsiz, tarayıcınızda.",
    eyebrow: "Ücretsiz araç",
    h1: "iPhone Duo duvar kağıdı oluşturucu",
    lead: "Herhangi bir fotoğrafı iPhone Duo'nun iki ekranına uygun bir çifte dönüştürün —dış ekran için uzun, iç ekran için geniş bir dosya— tarayıcınızda ve ücretsiz.",
    breadcrumb: "Duvar kağıdı oluşturucu",
    stepsTitle: ["Nasıl çalışır?", "Dört adım, iki ekran."],
    step: "{n}. adım",
    steps: [
      {
        title: "Bir fotoğraf seçin",
        body: "Telefonunuzdan ya da bilgisayarınızdan herhangi bir görseli seçin veya duvar kağıtlarımızdan birini kendi sayfasından oluşturucuda açın. Hiçbir şey yüklenmez; kırpma tarayıcınızda yapılır.",
      },
      {
        title: "Her ekranı kadrajlayın",
        body: "Görseli her önizlemenin içinde sürükleyin ve yakınlaştırma ayarını kullanın. Uzun dış ekran ve geniş iç ekran ayrı ayrı kadrajlanır; böylece konu ikisinde de doğru yerde durur.",
      },
      {
        title: "Netliği kontrol edin",
        body: "Her önizlemenin altında oluşturucu, fotoğrafın o ekran için yeterli pikseli olup olmadığını ya da büyütülmesi gerekip gerekmediğini söyler; her duvar kağıdı sayfasındaki kontrolün aynısı.",
      },
      {
        title: "İki dosyayı da indirin",
        body: "Dış ekran için 1398 × 2034, iç ekran için 2670 × 1878 boyutunda, Fotoğraflar'da kolayca ayırt edebileceğiniz adlarla iki dosya alırsınız.",
      },
    ],
    whyTitle: "iPhone Duo neden iki duvar kağıdı dosyasına ihtiyaç duyar?",
    why: `5,4 inç dış ekran 1398 × 2034 çözünürlüğünde, uzun ve dikey bir ekrandır. Telefonu açtığınızda 7,6 inç iç ekran, 2670 × 1878 çözünürlüğüyle yüksekliğinden daha geniştir. Tek bir görsel ikisini birden iyi dolduramaz: dikey bir fotoğraf iç ekranda yalnızca ortadaki bir şeridi korur, yatay bir fotoğraf ise dış ekranda dar bir dilime iner.

Oluşturucu her ekran için tam çözünürlüğünde ayrı bir kırpma yapar; böylece iOS görseli büyütmek yerine piksel piksel gösterir. En iyi sonuç için en az 2670 piksel genişliğinde bir fotoğrafla başlayın. Konuyu dış kırpmada ortada tutun; iç ekranda ise telefonun katlandığı orta çizgiden biraz yana kaydırın. Daha fazla ayrıntı [iPhone Duo duvar kağıdı boyutları](/tr/blog/iphone-duo-wallpaper-sizes-explained) rehberimizde.

Bitti mi? İki ekran için yapılmış [diğer duvar kağıtlarına göz atın](/tr/wallpapers).`,
    faqTitle: ["Sorularınız mı var?", "Oluşturucu hakkında."],
    faq: [
      {
        question: "iPhone Duo duvar kağıdı oluşturucu ücretsiz mi?",
        answer:
          "Evet. Hesap gerekmez, filigran eklenmez ve kaç duvar kağıdı yapacağınıza dair bir sınır yoktur. Kendi fotoğraflarınızla yaptıklarınızı dilediğiniz gibi kullanabilirsiniz.",
      },
      {
        question: "Fotoğrafım bir yere yükleniyor mu?",
        answer:
          "Hayır. Fotoğraf kendi cihazınızda tarayıcınız tarafından açılır ve kırpılır; hazır dosyalar doğrudan oradan kaydedilir. Sunucumuza hiçbir şey gönderilmez.",
      },
      {
        question: "Oluşturucu hangi boyutlarda dışa aktarır?",
        answer:
          "iPhone Duo dış ekranı için tam olarak 1398 × 2034 piksel, iç ekranı için 2670 × 1878 piksel, JPG ya da PNG olarak. Bu boyutlarda iOS görseli büyütmeden piksel piksel gösterir.",
      },
      {
        question: "Oluşturucu neden fotoğrafımın yumuşak görüneceğini söylüyor?",
        answer:
          "Seçtiğiniz alanda ekrandan daha az piksel var, bu yüzden görselin büyütülmesi gerekiyor. Uzaklaştırın ya da daha büyük bir orijinal kullanın: en az 2670 piksel genişlik iç ekranı, en az 2034 piksel yükseklik dış ekranı karşılar.",
      },
      {
        question: "Hangi görsel biçimlerini kullanabilirim?",
        answer:
          "JPG, PNG ve WebP tüm modern tarayıcılarda çalışır. iPhone fotoğraf arşivinizden bir fotoğraf seçtiğinizde iOS genellikle onu tarayıcıya JPG olarak verir; bu yüzden HEIC fotoğraflar da orada çalışır.",
      },
      {
        question: "İki dosyayı iPhone Duo'ya nasıl ayarlarım?",
        answer:
          "İki dosyayı da Fotoğraflar'a kaydedin, Kilitli Ekran'a dokunup basılı tutun, + düğmesine dokunun, Fotoğraflar'ı seçin ve o ekranın dosyasını seçin.",
      },
    ],
    ui: {
      outerName: "Dış ekran",
      outerHint: "Kapalı · 5,4 inç",
      innerName: "İç ekran",
      innerHint: "Açık · 7,6 inç",
      previewLabel: "Önizleme",
      formatLabel: "Dosya biçimi",
      modeLock: "Kilitli Ekran",
      modeHome: "Ana Ekran",
      modeClean: "Sade",
      pixelPerfect: "Piksel piksel",
      pixelPerfectNote: "Sığması için küçültüldü, net kalır.",
      greatFit: "Çok iyi uyum",
      slightlySoft: "Biraz yumuşak",
      soft: "Yumuşak",
      enlarged: "Ekranı doldurmak için %{n} büyütüldü.",
      fixZoomOut: "Uzaklaştırın ya da daha büyük bir fotoğraf kullanın.",
      fixLarger: "Daha büyük bir fotoğraf daha net görünür.",
      zoom: "Yakınlaştır",
      reset: "{screen} kadrajını sıfırla",
      dragHint: "{screen} önizlemesi. Görseli taşımak için sürükleyin ya da ok tuşlarını kullanın.",
      emptyHint: "Bu ekranda ne kadar net görüneceğini görmek için bir fotoğraf seçin.",
      downloadOuter: "Dış ekranı indir",
      downloadInner: "İç ekranı indir",
      choose: "Fotoğraf seç",
      change: "Fotoğrafı değiştir",
      loading: "Duvar kağıdı yükleniyor…",
      dropHint: "Ya da bir görseli buraya bırakın. Cihazınızdan çıkmaz.",
      pixels: "{w} × {h} piksel",
      downloadBoth: "İkisini de indir",
      preparing: "Hazırlanıyor…",
      exportNote: "Tam olarak {outer} ve {inner} boyutlarında dışa aktarır. Fotoğrafınız asla yüklenmez.",
      loadFailed: "Bu duvar kağıdı yüklenemedi. Bunun yerine bir fotoğraf seçin.",
      notImage: "Bu dosya bir görsel değil.",
      tooLarge: "Bu fotoğraf 40 MB'tan büyük. Daha küçük bir tane seçin.",
      cantOpen: "Bu tarayıcı o görseli açamıyor. JPG, PNG ya da WebP deneyin.",
      exportFailed: "Duvar kağıdı oluşturulamadı. Tekrar deneyin ya da başka bir fotoğraf seçin.",
    },
  },
  blog: {
    title: "iPhone Duo Duvar Kağıdı Rehberleri",
    description:
      "iPhone Duo duvar kağıtları hakkında Türkçe rehberler: Apple'ın resmî duvar kağıdı, dış ve iç ekran boyutları ve net bir duvar kağıdı seçmenin yolları.",
    breadcrumb: "Rehberler",
    h1: "Türkçe rehberler.",
    lead: "Duvar kağıdınızın iPhone Duo'nun iki ekranında da net görünmesi için bilmeniz gereken her şey.",
    by: "Yazan:",
    team: "{site} editör ekibi",
    minRead: "{n} dk okuma",
    toc: "Bu rehberde",
    english: "İngilizce oku",
    more: ["Diğer rehberler.", "Türkçe."],
    wallpapers: ["Deneyebileceğiniz duvar kağıtları.", "Kütüphaneden yeni çıktı."],
  },
  guides: [
    {
      slug: "official-iphone-duo-wallpaper",
      title: "Resmî iPhone Duo duvar kağıdı: açık ve koyu kumullar, boyutlar ve nasıl edinilir",
      seoTitle: "Resmî iPhone Duo Duvar Kağıdı: Açık ve Koyu, Boyutlar",
      description:
        "Resmî iPhone Duo duvar kağıdı, açık ve koyu sürümleriyle çöl kumullarıdır. Dış ve iç ekran için tam boyutlar, 4K olup olmadığı ve nasıl ayarlanacağı.",
      excerpt:
        "Apple, iPhone Duo için dört duvar kağıdı hazırladı: bir dağ silsilesinin altında çöl kumulları, açık ve koyu sürümleriyle. Nasıl göründüklerini, her ekran için tam boyutlarını, nereden geldiklerini ve nasıl ayarlanacaklarını anlatıyoruz.",
      tags: ["iPhone Duo", "resmî duvar kağıtları"],
      published: "2026-10-08",
      content: `Apple, ilk katlanabilir iPhone'u olan iPhone Duo'yu tanıtırken onu yeni bir duvar kağıdıyla gösterdi: sarp bir dağ silsilesinin önünde uzanan geniş çöl kumulları. "iPhone Duo duvar kağıdı" diye arayan çoğu kişinin aklındaki görsel budur. Bu rehber resmî duvar kağıdının ne olduğunu, her ekran için tam boyutlarını, dosyaların nereden geldiğini ve aynı görünümü şu anki telefonunuzda nasıl elde edeceğinizi anlatıyor.

## Resmî iPhone Duo duvar kağıdı nasıl görünüyor?

**Dört** resmî görsel var: ikisi açık mod, ikisi koyu mod için.

- **Açık sürümler** kumulları gündüz gösterir: soluk mavi bir gökyüzü altında sıcak bej kum.
- **Koyu sürümler** aynı manzarayı gece gösterir: derin gölgeler, yıldızlarla dolu bir gökyüzü ve ufukta yumuşak bir parıltı.

Apple'ın son dönemdeki çoğu duvar kağıdı gibi bu çift de görünüm ayarınıza göre değişmek üzere tasarlandı: gündüz açık, gece ya da Koyu Mod açıkken koyu.

## Her sürüm için neden iki dosya var?

iPhone Duo'nun şekilleri çok farklı iki ekranı var; bu yüzden tek bir görsel ikisini birden dolduramaz:

| Ekran | Çözünürlük | Şekil |
| --- | --- | --- |
| Dış ekran (5,4 inç, kapalı) | 1398 × 2034 | Uzun, dikey |
| İç ekran (7,6 inç, açık) | 2670 × 1878 | Geniş, yatay |

Apple bunu sahneyi iki ekran için de çizerek çözüyor. Telefon kapalıyken dış ekran kumulların daha yakın bir kesitini gösterir. Açıldığında duvar kağıdı genişleyerek tüm manzarayı iç ekrana yayar. Resmî setin hem açık hem koyu sürüm için birer uzun ve birer geniş görselle gelmesinin nedeni budur.

Yalnızca tek bir dosya alacaksanız, kullanacağınız ekran için yapılmış olanı alın. Uzun dış ekran görseli geniş iç ekrana yayıldığında yaklaşık 1,9 kat büyütülür ve yüksekliğinin yarısından fazlasını kaybeder. Ayrıntılı açıklama [iPhone Duo duvar kağıdı boyutları](/tr/blog/iphone-duo-wallpaper-sizes-explained) rehberinde.

## Resmî duvar kağıtları 4K mı?

Hayır. Apple'ın dosyaları her ekranın tam boyutundadır: dış ekran için 1398 × 2034, iç ekran için 2670 × 1878. Hiçbiri uzun kenarda 4K'nın genel anlamı olan 3840 piksele ulaşmaz. İnternette "4K" sürümler görebilirsiniz; bunlar Apple'ın dosyalarının büyütülmüş hâlleridir. Büyütülmüş bir görsel daha büyük bir ekranda temiz görünebilir ama orijinalde olmayan ayrıntıyı eklemez. iPhone Duo'nun kendisinde orijinal dosyalar zaten piksel piksel nettir.

## Resmî duvar kağıdı nereden geliyor?

Duvar kağıtları iPhone Duo'da yüklü gelir ve telefonu kurduğunuzda duvar kağıdı galerisinde hazırdır. Diğer iPhone'lar için olan iOS 27 bunları içermez. Çıkıştan önce Apple'ın geliştirici araçlarında (Xcode 27.1 beta içindeki iPhone Duo simülatörü) bulundular ve [9to5Mac](https://9to5mac.com/2026/09/18/download-the-iphone-duos-official-light-and-dark-wallpapers-here/) gibi Apple haber siteleri tarafından yayınlandılar.

**Apple'ın duvar kağıtlarını barındırmıyoruz.** Bunlar Apple'ın telif hakkıyla korunan eserleridir: cihazda kullanılmak üzere cihazla birlikte gelirler ama serbestçe yeniden dağıtılamazlar. Bu sitedeki her şey iPhone Duo ekranları için yapılmış özgün çalışmalardır.

## Resmî duvar kağıdı iPhone Duo'ya nasıl ayarlanır?

1. Kilitli Ekran'a dokunup basılı tutun, ardından **+** düğmesine dokunun.
2. Apple'ın koleksiyonlarına kaydırın ve kumullu duvar kağıdını seçin.
3. Görünümünüze uyup uymayacağını seçin (gündüz açık, gece koyu).
4. **Ekle**'ye dokunun ve Ana Ekran'da da kullanmayı seçin.

iPhone Duo'da her ekranı telefon o konumdayken ayarlayın —dış ekran için kapalı, iç ekran için açık—; böylece gerçekte elde edeceğiniz kırpmayı görürsünüz.

## İndirilmiş bir kopyayı başka bir iPhone'da kullanmak

Resmî görsellerden birini iPhone 18 Pro'da ya da daha eski bir iPhone'da kullanmak için kaydettiyseniz, uzun dış ekran sürümünü seçin. Şekli daha yakındır ama dış ekran, yüksekliğine göre normal bir iPhone'dan daha geniştir; bu yüzden görselin genişliğinin yaklaşık üçte biri yanlardan kesilir. Geniş iç ekran sürümü ise dar, dikey bir dilime iner. Ardından [iPhone'da duvar kağıdı ayarlama](/blog/how-to-set-wallpaper-on-iphone) rehberini (İngilizce) izleyin.

## Aynı havayı taşıyan özgün duvar kağıtları

Resmî duvar kağıdındaki gün batımında çölün sakinliğini seviyor ama kimsede olmayan bir şey istiyorsanız, kütüphanemizdeki şu özgün çalışmalar aynı türden sakin bir manzara sunuyor:

- [Midnight Blue Desert Dunes](/tr/wallpapers/midnight-blue-desert-dunes-dual-iphone-wallpaper): sade bir gece gökyüzü altında yumuşak kum kıvrımları; koyu sürüme en yakın olanı.
- [Monochrome Desert River](/tr/wallpapers/monochrome-desert-river-minimalist-wallpaper): aralarından parlak bir nehrin kıvrılarak aktığı siyah kumullar.
- [Midnight Peak](/tr/wallpapers/midnight-peak-amoled-duo-wallpaper): AMOLED sevenler için saf siyah üzerinde tek bir karlı zirve.
- [Snow Mountain and Moon](/tr/wallpapers/minimal-snow-mountain-moon-landscape-duo-wallpaper): yumuşak mavi bir gökyüzü altında buzlu zirveler.
- [Misty Mountain Pine](/tr/wallpapers/misty-mountain-pine-tree-duo-wallpaper): bulutların içinde kaybolan kayalık zirveler.

Her duvar kağıdı sayfası, indirmeden önce tam çözünürlüğü ve görselin iPhone Duo'nun dış ve iç ekranına ve iPhone 18 Pro'ya nasıl oturduğunu gösterir. Bu tarzda daha fazlası için [Manzara](/tr/categories/landscape) kategorisine, koyu sürüm gibi gece sahneleri için [Koyu ve AMOLED](/tr/categories/dark) sayfasına göz atın. Kendi fotoğrafınızı mı kullanmak istiyorsunuz? [iPhone Duo duvar kağıdı oluşturucu](/tr/maker) onu iki ekran için kırpar.`,
    },
    {
      slug: "iphone-duo-wallpaper-sizes-explained",
      title: "iPhone Duo duvar kağıdı boyutları: dış ekran ve iç ekran",
      seoTitle: "iPhone Duo Duvar Kağıdı Boyutu: Dış ve İç Ekran",
      description:
        "iPhone Duo dış ekranının (1398 × 2034) ve iç ekranının (2670 × 1878) tam çözünürlükleri ve ikisinde de net görünen bir duvar kağıdı seçmek için basit kurallar.",
      excerpt:
        "iPhone Duo'nun birbirinden çok farklı iki ekranı var. İşte tam çözünürlükler ve ikisinde de net görünen duvar kağıtlarını seçmek için basit kurallar.",
      tags: ["iPhone Duo", "çözünürlük"],
      published: "2026-10-08",
      content: `iPhone Duo, Apple'ın ilk katlanabilir iPhone'udur ve **iki ekranı** vardır: telefon kapalıyken kullandığınız 5,4 inç bir dış ekran ve bir kitap gibi açılan 7,6 inç bir iç ekran. İki ekran farklı yönlerde kullanıldığı için birinde mükemmel görünen bir duvar kağıdı diğerinde kırpılmış görünebilir. Bu rehber rakamları açıklıyor ve size birkaç basit kural veriyor.

## Bir bakışta ekran çözünürlükleri

| Ekran | Boyut | Çözünürlük (kullanımda) | Yön |
| --- | --- | --- | --- |
| iPhone Duo dış ekran | 5,4 inç | 1398 × 2034 px | Dikey (uzun) |
| iPhone Duo iç ekran | 7,6 inç | 2670 × 1878 px | Yatay (geniş, açık) |
| iPhone 18 Pro Max | 6,9 inç | 1320 × 2868 px | Dikey |
| iPhone 18 Pro | 6,3 inç | 1206 × 2622 px | Dikey |

Teknik özellik sayfaları iç ekranı çoğu zaman 1878 × 2670 olarak verir. Bu aynı paneldir: iPhone Duo'yu açtığınızda menteşe dikey durur ve ekran yatay konumdadır; biz de bu yüzden 2670 × 1878 yazıyoruz.

## Kural 1: Çözünürlüğü yakalayın ya da geçin

Bir duvar kağıdı her iki yönde de **en az** ekran kadar büyük olmalıdır. Daha küçük görseller gerilir ve yumuşak görünür. Bu sitedeki her duvar kağıdı tam çözünürlüğünü gösterir; indirmeden önce kontrol edebilirsiniz.

## Kural 2: Her ekran için doğru şekli seçin

- **Dış ekran:** uzun, dikey duvar kağıtları seçin. 1398 × 2034 ya da daha uzun her görsel rahatça sığar.
- **İç ekran:** geniş duvar kağıtları ya da **kare** bir görsel seçin. Kare bir görsel (örneğin 2670 × 2670), açık telefonu döndürdüğünüzde iOS'a görseli yeniden kadrajlamak için alan bırakır.
- **İkisinde aynı duvar kağıdı:** ortasında belirgin bir konu olan tasarımlar —bir gezegen, bir çiçek, degrade bir küre— iki şekle de zarifçe kırpılır.

Kendi fotoğrafınızı kullanmak istiyorsanız [iPhone Duo duvar kağıdı oluşturucu](/tr/maker) iki kırpmayı da sizin için, her birini tam boyutunda yapar.

## Kural 3: Kat yerine ve saate dikkat edin

İç ekranda katlanma çizgisi tam ortadan geçer. Tam ortasında güçlü bir dikey çizgi olan duvar kağıtları kat izini daha belirgin gösterebilir; bu yüzden ortadan kaydırılmış konular genellikle daha iyi görünür. Kilitli Ekran'da saat ve araç takımları için üst kısımda biraz boş alan bırakın.

## Kural 4: Kaliteli biçimleri tercih edin

JPEG ve PNG her yerde çalışır. PNG düz renkleri ve degradeleri bantlanmadan korur; JPEG fotoğrafları küçük tutar. Duvar kağıtlarının ekran görüntülerinden kaçının: kalite kaybederler ve arayüz öğeleri içerirler.

## Hızlı kontrol listesi

1. Duvar kağıdının çözünürlüğünü kendi sayfasında kontrol edin.
2. Dış ekran için dikey, iç ekran için geniş ya da kare bir görsel kullanın.
3. İç ekranda ana konuyu tam orta çizgiden uzak tutun.
4. Önizlemeyi kaydetmek yerine orijinal dosyayı indirin.

[iPhone Duo iç ekran duvar kağıtlarımıza](/tr/devices/iphone-duo-inner-display) ve [dış ekran duvar kağıtlarımıza](/tr/devices/iphone-duo-outer-display) göz atın; hepsi yayınlanmadan önce boyut açısından kontrol edilir. Apple'ın duvar kağıdını mı arıyorsunuz? [Resmî iPhone Duo duvar kağıdı](/tr/blog/official-iphone-duo-wallpaper) rehberini okuyun.`,
    },
  ],
  wallpaper: TR_WALLPAPER,
  listing: TR_LISTING,
  taxonomy: TR_TAXONOMY,
  search: TR_SEARCH,
  notFound: {
    eyebrow: "Hata 404",
    h1: "Bu sayfa katlanıp gitti.",
    body: "Aradığınız sayfa yok ya da taşınmış. Bunlardan birini deneyin.",
    home: "Ana sayfaya git",
    browse: "Duvar kağıtlarına göz at",
    english: "Bu sayfayı İngilizce görüntüle",
  },
  about: TR_ABOUT,
  contact: TR_CONTACT,
};
