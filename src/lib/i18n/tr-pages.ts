import type { AboutStrings, ContactStrings } from "@/lib/i18n/types";

export const TR_ABOUT: AboutStrings = {
  title: "Hakkımızda",
  description:
    "{site}, iPhone Duo'nun iç ve dış ekranı için tasarlanmış ücretsiz, tam çözünürlüklü duvar kağıtlarından oluşan bağımsız bir kütüphanedir.",
  eyebrow: "Hakkımızda",
  h1: "İki ekran",
  h1Accent: "harika duvar kağıtlarını hak eder.",
  lead: "{site}, ilk katlanabilir iPhone için kurulmuş bağımsız bir duvar kağıdı kütüphanesidir. Amacımız basit: sahip olduğunuz her ekranda doğru görünen, güzel ve tam çözünürlüklü duvar kağıtlarını bulmanıza yardım etmek.",
  principles: [
    {
      title: "Uyması için yapıldı",
      body: "iPhone Duo'nun uzun, 5,4 inç bir dış ekranı ve geniş, 7,6 inç bir iç ekranı var. Her duvar kağıdını ikisinde ve iPhone 18 Pro modellerinde kontrol ediyor, indirmeden önce nasıl oturduğunu size gösteriyoruz.",
    },
    {
      title: "Her zaman tam çözünürlük",
      body: "Bulanık önizlemeler ya da ekran görüntüleri yok. Her sayfada tam çözünürlüğü ve dosya boyutu yazan orijinal dosyayı indirirsiniz.",
    },
    {
      title: "Sanatçılara saygı",
      body: "Özgün çalışmalar, bir insan tarafından incelenmiş yapay zekâ destekli tasarımlar, lisanslı görseller ve kamu malı eserler yayınlıyor; gereken her yerde sanatçıların adını veriyoruz.",
    },
    {
      title: "Özenle düzenlendi",
      body: "Kategoriler ve cihaz sayfaları, tarzınıza ve ekranınıza uyan bir duvar kağıdını bulmayı kolaylaştırır.",
    },
  ],
  sections: [
    {
      title: "Neden başladık?",
      body: "Yeni bir iPhone çıktığında insanlar ekranına uyan duvar kağıtları arar. iPhone Duo bunu zorlaştırdı: dış ekranı uzun ve dikey, iç ekranı ise ortasında bir kat yeri olan geniş bir tuvale açılıyor. Duvar kağıdı sitelerinin çoğu tek bir telefon şekli için kurulmuştu; biz de iki şekil için bir site kurduk.",
    },
    {
      title: "Duvar kağıtlarını nasıl seçiyoruz?",
      body: "Her duvar kağıdını yayınlamadan önce inceliyoruz. Çözünürlüğe, Kilitli Ekran saati ve kat yeri çevresindeki kompozisyona, OLED ekranlardaki renk kalitesine ve paylaşma hakkımız olup olmadığına bakıyoruz. Her duvar kağıdının açık bir başlığı, bir açıklaması, bir kategorisi ve çözünürlük, dosya boyutu gibi ayrıntıları var; böylece ne indirdiğinizi tam olarak bilirsiniz.",
    },
    {
      title: "Gerçekten işe yarayan rehberler",
      body: "Duvar kağıtlarının yanı sıra pratik [rehberler](/tr/blog) yayınlıyoruz: iPhone Duo ekranlarının tam boyutlarından Apple'ın resmî duvar kağıdına kadar. Bazı rehberler şimdilik yalnızca İngilizce.",
    },
    {
      id: "editorial-team",
      title: "Editör ekibimiz ve ilkelerimiz",
      body: `Rehberlerimizi, her duvar kağıdını yayınlanmadan önce inceleyen {site} editör ekibi yazıp düzenliyor. En çok sorulan sorular hakkında yazıyor ve her rehbere aynı ilkeleri uyguluyoruz:

- **Net ve pratik.** Dolgu yerine tam ekran boyutları, gerçek menü yolları ve adım adım talimatlar.
- **Yayından önce kontrol edilir.** Adımları Apple'ın kendi belgeleri ve iOS'un güncel sürümüyle karşılaştırırız. Menü adları iOS sürümleri arasında farklıysa bunu belirtiriz.
- **Güncel tutulur.** Her rehber son güncelleme tarihini gösterir; iOS bir şeyin işleyişini değiştirdiğinde rehberleri yeniden düzenleriz.
- **Bağımsız.** İçerik için ödeme kabul etmeyiz. Reklamlar açıkça belirtilir ve içeriğimizden ayrı tutulur.
- **Düzeltmelere açık.** Bir şey yanlış ya da eskiyse [bize haber verin](/tr/contact), düzeltelim.`,
    },
    {
      title: "Bağımsız ve ücretsiz",
      body: "Apple Inc. ile bir bağlantımız yok. Site ücretsizdir ve açıkça belirtilmiş reklamlarla desteklenir. Duvar kağıtları kendi cihazlarınızda kişisel kullanım içindir; [Kullanım Koşulları](/terms) sayfamıza (İngilizce) göz atın.",
    },
    {
      title: "Bize ulaşın",
      body: "Duvar kağıdı isteğiniz, geri bildiriminiz ya da bir iş birliği fikriniz mi var? [İletişim sayfamızı](/tr/contact) ziyaret edin ya da [{email}](mailto:{email}) adresine yazın. Eserlerini burada izinsiz bulan sanatçılar [telif hakkı sayfamızdan](/dmca) (İngilizce) bize ulaşabilir.",
    },
  ],
};

export const TR_CONTACT: ContactStrings = {
  title: "İletişim",
  description: "Duvar kağıdı istekleri, geri bildirim, iş birlikleri ya da destek için {site} ile iletişime geçin.",
  eyebrow: "İletişim",
  h1: "Sizden haber almak isteriz.",
  lead: "Duvar kağıdı istekleri, geri bildirim, iş birliği fikirleri ya da bir indirme sorunu: bize bir mesaj gönderin.",
  emailTitle: "E-posta",
  responseTitle: "Yanıt süresi",
  responseBody: "2–3 iş günü içinde yanıt vermeye çalışıyoruz.",
  copyrightTitle: "Telif hakkı",
  copyrightBefore: "Hak sahipleri en hızlı inceleme için ",
  dmcaLink: "DMCA sayfamızdan",
  copyrightAfter: " (İngilizce) bildirimde bulunabilir.",
  form: {
    name: "Ad",
    email: "E-posta",
    subject: "Konu",
    subjectPlaceholder: "Duvar kağıdı isteği, geri bildirim, iş birliği…",
    message: "Mesaj",
    send: "Mesaj gönder",
    sending: "Gönderiliyor…",
  },
};
