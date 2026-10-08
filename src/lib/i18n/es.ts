import { ES_LISTING, ES_TAXONOMY } from "@/lib/i18n/es-taxonomy";
import { ES_SEARCH } from "@/lib/i18n/search-strings";
import { ES_WALLPAPER } from "@/lib/i18n/es-wallpaper";
import type { LocaleContent } from "@/lib/i18n/types";

/**
 * Spanish. Search Console and competitors show searches for "fondos de pantalla iphone duo" and
 * "fondo de pantalla iphone duo"; duowallpaper.org ranks a whole /es section for them. Wallpaper
 * pages themselves stay in English, so these pages link to them and say so.
 */
export const ES: LocaleContent = {
  locale: "es",
  name: "Español",
  ogLocale: "es_ES",
  chrome: {
    locale: "es",
    homeHref: "/es",
    homeLabel: "Inicio",
    searchPath: "/es/search",
    nav: [
      { href: "/es/wallpapers", label: "Fondos", icon: "wallpapers" },
      { href: "/es/categories", label: "Categorías", icon: "categories" },
      { href: "/es/devices", label: "Dispositivos", icon: "devices" },
      { href: "/es/maker", label: "Creador", icon: "maker" },
      { href: "/es/blog", label: "Guías", icon: "guides" },
    ],
    header: {
      skip: "Saltar al contenido",
      home: "Inicio de {site}",
      search: "Buscar…",
      searchLabel: "Buscar fondos de pantalla",
      searchPlaceholder: "Buscar fondos de pantalla…",
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
      close: "Cerrar",
      closeSearch: "Cerrar búsqueda",
      quickLinks: "Accesos rápidos",
      menuLinks: [
        { href: "/about", label: "Quiénes somos" },
        { href: "/contact", label: "Contacto" },
        { href: "/privacy-policy", label: "Privacidad" },
        { href: "/terms", label: "Términos" },
      ],
    },
    quickLinks: [
      { href: "/es/wallpapers?sort=popular", label: "Fondos más descargados" },
      { href: "/es/maker", label: "Creador de fondos para iPhone Duo" },
      { href: "/es/categories/dark", label: "Fondos oscuros y AMOLED" },
      { href: "/es/categories/landscape", label: "Fondos de paisajes" },
      { href: "/es/devices/iphone-duo-inner-display", label: "Pantalla interior del iPhone Duo" },
      { href: "/es/devices/iphone-duo-outer-display", label: "Pantalla exterior del iPhone Duo" },
    ],
    footer: {
      disclaimer:
        "{site} es una web independiente y no está afiliada, patrocinada ni respaldada por Apple Inc. iPhone, iPhone Duo e iOS son marcas comerciales de Apple Inc., registradas en EE. UU. y en otros países, y aquí solo se usan para indicar la compatibilidad. Los fondos se ofrecen para uso personal y no comercial.",
      groups: [
        {
          title: "Explorar",
          links: [
            { href: "/es/wallpapers", label: "Todos los fondos" },
            { href: "/es/wallpapers?sort=popular", label: "Más descargados" },
            { href: "/es/categories", label: "Categorías" },
            { href: "/es/categories/dark", label: "Oscuros y AMOLED" },
            { href: "/es/categories/landscape", label: "Paisajes" },
            { href: "/es/maker", label: "Creador de fondos" },
          ],
        },
        {
          title: "Dispositivos",
          links: [
            { href: "/es/devices/iphone-duo-outer-display", label: "iPhone Duo, pantalla exterior" },
            { href: "/es/devices/iphone-duo-inner-display", label: "iPhone Duo, pantalla interior" },
            { href: "/es/devices/iphone-18-pro-max", label: "iPhone 18 Pro Max" },
            { href: "/es/devices/iphone-18-pro", label: "iPhone 18 Pro" },
          ],
        },
        {
          title: "Guías",
          links: [
            { href: "/es/blog", label: "Todas las guías" },
            { href: "/es/blog/official-iphone-duo-wallpaper", label: "Fondo oficial del iPhone Duo" },
            { href: "/es/blog/iphone-duo-wallpaper-sizes-explained", label: "Tamaños de fondo" },
            { href: "/about", label: "Quiénes somos" },
            { href: "/contact", label: "Contacto" },
          ],
        },
        {
          title: "Legal",
          links: [
            { href: "/privacy-policy", label: "Política de privacidad" },
            { href: "/terms", label: "Términos de uso" },
            { href: "/cookie-policy", label: "Política de cookies" },
            { href: "/disclaimer", label: "Aviso legal" },
            { href: "/dmca", label: "DMCA y derechos de autor" },
          ],
        },
      ],
      rights: "Todos los derechos reservados.",
      languages: "Idiomas",
    },
  },
  cookies: {
    label: "Aviso de cookies",
    before:
      "Usamos cookies para que la web funcione, medir el tráfico y mostrar anuncios de socios como Google. Consulta nuestra ",
    between: " y nuestra ",
    after: ".",
    cookiePolicy: "Política de cookies",
    privacyPolicy: "Política de privacidad",
    accept: "Entendido",
  },
  home: {
    title: "Fondos de Pantalla para iPhone Duo — Gratis en HD",
    description:
      "Descarga gratis fondos de pantalla HD para iPhone Duo, pensados para la pantalla exterior de 5,4 pulgadas y la interior de 7,6 del iPhone 18 Duo. Sin app ni registro.",
    badgeNew: "Nuevo",
    badge: "Hecho para iPhone Duo",
    h1: "Fondos de pantalla para iPhone Duo,",
    h1Accent: "desplegados.",
    intro:
      "Diseños originales a resolución completa para la pantalla exterior de 5,4 pulgadas, la interior de 7,6 pulgadas y el iPhone 18 Pro.",
    browse: "Ver fondos",
    explore: "Explorar categorías",
    stats: {
      wallpapers: "{n} fondos",
      fullResolution: "Resolución completa",
      free: "Gratis, sin registro",
      original: "Originales y con licencia",
    },
    featured: ["Destacados.", "Elegidos a mano."],
    latest: ["Recientes.", "Recién salidos del estudio."],
    categories: ["Categorías.", "Encuentra tu estilo."],
    guides: ["Guías.", "En español."],
    viewAll: "Ver todo",
    makerTitle: "Crea el tuyo.",
    makerBody:
      "Convierte cualquier foto en una pareja a medida: 1398 × 2034 para la pantalla exterior y 2670 × 1878 para la interior, encuadrada para cada una. Gratis, y tu foto nunca sale de tu dispositivo.",
    makerCta: "Abrir el creador de fondos",
    aboutTitle: "Fondos para las dos pantallas del iPhone Duo.",
    about: `El iPhone Duo —también conocido como iPhone 18 Duo o iPhone Fold— tiene dos pantallas con formas muy distintas: una exterior alta de 5,4 pulgadas a 1398 × 2034 y una interior ancha de 7,6 pulgadas a 2670 × 1878 que se abre como una pequeña tableta. Un fondo pensado para un iPhone normal pierde una franja arriba y abajo en la pantalla exterior, y mucho más en la interior.

Todos los fondos de esta web se descargan gratis en HD y a su resolución original, y cada uno indica cómo encaja en la [pantalla exterior](/es/devices/iphone-duo-outer-display) y en la [pantalla interior](/es/devices/iphone-duo-inner-display) antes de guardarlo. ¿No sabes qué tamaño necesitas? Lee nuestra guía de [tamaños de fondo para iPhone Duo](/es/blog/iphone-duo-wallpaper-sizes-explained). ¿Buscas el fondo oficial de Apple con las dunas del desierto? Lo explicamos en [el fondo de pantalla oficial del iPhone Duo](/es/blog/official-iphone-duo-wallpaper).

Las fichas de cada fondo están en inglés, pero la descarga y la comprobación de encaje funcionan igual.`,
    faqTitle: ["¿Preguntas?", "Tenemos respuestas."],
    faq: [
      {
        question: "¿Los fondos son gratis?",
        answer:
          "Sí. Todos los fondos se pueden descargar gratis para uso personal en tus propios dispositivos, sin cuenta ni app. No se permite el uso comercial ni volver a distribuirlos.",
      },
      {
        question: "¿Encajan en la pantalla interior y exterior del iPhone Duo?",
        answer:
          "La página de cada fondo muestra cómo queda la imagen en la pantalla exterior (1398 × 2034), en la pantalla interior desplegada (2670 × 1878) y en los iPhone 18 Pro, para que elijas el adecuado antes de descargarlo.",
      },
      {
        question: "¿iPhone Duo es lo mismo que iPhone 18 Duo o iPhone Fold?",
        answer:
          "Sí, son nombres del mismo iPhone plegable. Tiene una pantalla exterior de 5,4 pulgadas (1398 × 2034) que se usa con el teléfono cerrado y una pantalla interior de 7,6 pulgadas (2670 × 1878) que se abre como una pequeña tableta. Cada fondo de esta web se comprueba en las dos.",
      },
      {
        question: "¿Dónde consigo el fondo de pantalla oficial del iPhone Duo?",
        answer:
          "El fondo oficial de Apple —dunas del desierto frente a una cordillera, en versión clara y oscura— viene instalado en el iPhone Duo. Es una obra protegida por derechos de autor de Apple, así que no lo alojamos; nuestra guía del fondo oficial explica sus tamaños y cómo ponerlo. Todos los fondos de esta web son originales y están hechos para las mismas dos pantallas.",
      },
      {
        question: "¿Son fondos de pantalla 4K?",
        answer:
          "Todavía no: por ahora la biblioteca es HD. Cada fondo se publica a su resolución original y su página muestra el tamaño exacto en píxeles con una etiqueta de calidad (4K solo para archivos de 3840 píxeles o más en el lado largo) y cómo encaja en cada pantalla, para que veas lo nítido que se verá en la pantalla interior de 7,6 pulgadas (2670 × 1878) antes de descargarlo.",
      },
      {
        question: "¿Cómo pongo un fondo de pantalla en mi iPhone?",
        answer:
          "Guarda la imagen en Fotos y abre Ajustes → Fondo de pantalla para añadir uno nuevo, o mantén presionada la pantalla de bloqueo y toca el botón +. En iPhone, las descargas se guardan primero en Archivos → Descargas, así que muévela a Fotos antes de buscarla.",
      },
      {
        question: "¿Tienen relación con Apple?",
        answer:
          "No. Es una web independiente de fans y diseño. iPhone y iPhone Duo son marcas comerciales de Apple Inc. y aquí solo se usan para indicar la compatibilidad con los dispositivos.",
      },
    ],
  },
  maker: {
    title: "Creador de Fondos para iPhone Duo — Exterior e Interior",
    description:
      "Crea un fondo de pantalla para iPhone Duo con cualquier foto: recórtala para la pantalla exterior de 1398 × 2034 y la interior de 2670 × 1878 y descarga ambas. Gratis.",
    eyebrow: "Herramienta gratuita",
    h1: "Creador de fondos para iPhone Duo",
    lead: "Convierte cualquier foto en una pareja a medida para las dos pantallas del iPhone Duo —un archivo alto para la pantalla exterior y uno ancho para la interior— en tu navegador y gratis.",
    breadcrumb: "Creador de fondos",
    stepsTitle: ["Cómo funciona.", "Cuatro pasos, dos pantallas."],
    step: "Paso {n}",
    steps: [
      {
        title: "Elige una foto",
        body: "Selecciona cualquier imagen de tu teléfono o tu computadora, o abre en el creador uno de nuestros fondos desde su página. No se sube nada: el recorte se hace en tu navegador.",
      },
      {
        title: "Encuadra cada pantalla",
        body: "Arrastra la imagen dentro de cada vista previa y usa el control de zoom. La pantalla exterior, alta, y la interior, ancha, tienen su propio encuadre, para que el motivo quede bien en las dos.",
      },
      {
        title: "Comprueba la nitidez",
        body: "Debajo de cada vista previa, el creador te dice si la foto tiene píxeles suficientes para esa pantalla o si hay que ampliarla, con la misma comprobación que muestra cada fondo.",
      },
      {
        title: "Descarga los dos archivos",
        body: "Obtienes un archivo de 1398 × 2034 para la pantalla exterior y otro de 2670 × 1878 para la interior, con nombres claros para distinguirlos en Fotos.",
      },
    ],
    whyTitle: "Por qué el iPhone Duo necesita dos fondos.",
    why: `La pantalla exterior de 5,4 pulgadas es alta y vertical, a 1398 × 2034. Al desplegar el teléfono, la pantalla interior de 7,6 pulgadas es más ancha que alta, a 2670 × 1878. Una sola imagen no llena bien las dos: una foto vertical en la pantalla interior solo conserva una franja central, y una foto horizontal en la exterior solo deja una tira estrecha.

El creador hace un recorte para cada pantalla a su resolución exacta, así iOS la muestra píxel a píxel en lugar de ampliarla. Para un mejor resultado, empieza con una foto de al menos 2670 píxeles de ancho. Centra el motivo en el recorte exterior y, en la pantalla interior, apártalo un poco de la línea central, donde se pliega el teléfono. Encontrarás más detalles en nuestra guía de [tamaños de fondo para iPhone Duo](/es/blog/iphone-duo-wallpaper-sizes-explained).

¿Ya está? [Busca más fondos](/es/wallpapers) hechos para las dos pantallas.`,
    faqTitle: ["¿Preguntas?", "Sobre el creador."],
    faq: [
      {
        question: "¿El creador de fondos para iPhone Duo es gratis?",
        answer:
          "Sí. No hace falta cuenta, no añade marcas de agua y no hay límite de fondos. Los que crees con tus propias fotos son tuyos para usarlos como quieras.",
      },
      {
        question: "¿Se sube mi foto a algún sitio?",
        answer:
          "No. Tu navegador abre y recorta la foto en tu propio dispositivo, y los archivos terminados se guardan directamente desde él. No se envía nada a nuestro servidor.",
      },
      {
        question: "¿Qué tamaños exporta?",
        answer:
          "Exactamente 1398 × 2034 píxeles para la pantalla exterior del iPhone Duo y 2670 × 1878 píxeles para la interior, en JPG o PNG. A esos tamaños, iOS muestra la imagen píxel a píxel en lugar de ampliarla.",
      },
      {
        question: "¿Por qué dice que mi foto se verá suave?",
        answer:
          "La zona que elegiste tiene menos píxeles que la pantalla, así que hay que ampliarla. Aleja el zoom o usa un original más grande: al menos 2670 píxeles de ancho cubren la pantalla interior y al menos 2034 de alto, la exterior.",
      },
      {
        question: "¿Qué formatos de imagen puedo usar?",
        answer:
          "JPG, PNG y WebP funcionan en cualquier navegador moderno. Cuando eliges una foto de la fototeca del iPhone, iOS suele entregarla al navegador como JPG, así que las fotos HEIC también funcionan ahí.",
      },
      {
        question: "¿Cómo pongo los dos archivos en el iPhone Duo?",
        answer:
          "Guarda los dos archivos en Fotos, mantén presionada la pantalla de bloqueo, toca +, elige Fotos y selecciona el archivo de esa pantalla.",
      },
    ],
    ui: {
      outerName: "Pantalla exterior",
      outerHint: "Cerrado · 5,4 pulgadas",
      innerName: "Pantalla interior",
      innerHint: "Abierto · 7,6 pulgadas",
      previewLabel: "Vista previa",
      formatLabel: "Formato de archivo",
      modeLock: "Bloqueo",
      modeHome: "Inicio",
      modeClean: "Limpia",
      pixelPerfect: "Píxel a píxel",
      pixelPerfectNote: "Se reduce para encajar: se mantiene nítida.",
      greatFit: "Muy buen encaje",
      slightlySoft: "Algo suave",
      soft: "Suave",
      enlarged: "Ampliada un {n}% para llenar la pantalla.",
      fixZoomOut: "Aleja el zoom o usa una foto más grande.",
      fixLarger: "Una foto más grande se verá más nítida.",
      zoom: "Zoom",
      reset: "Restablecer el encuadre de la {screen}",
      dragHint: "Vista previa de la {screen}. Arrastra o usa las flechas para mover la imagen.",
      emptyHint: "Elige una foto para ver lo nítida que se verá en esta pantalla.",
      downloadOuter: "Descargar pantalla exterior",
      downloadInner: "Descargar pantalla interior",
      choose: "Elegir una foto",
      change: "Cambiar foto",
      loading: "Cargando fondo…",
      dropHint: "O suelta una imagen aquí. No sale de tu dispositivo.",
      pixels: "{w} × {h} píxeles",
      downloadBoth: "Descargar las dos",
      preparing: "Preparando…",
      exportNote: "Exporta exactamente {outer} y {inner}. Tu foto nunca se sube.",
      loadFailed: "No se pudo cargar este fondo. Elige una foto.",
      notImage: "Ese archivo no es una imagen.",
      tooLarge: "La foto pesa más de 40 MB. Elige una más pequeña.",
      cantOpen: "Este navegador no puede abrir esa imagen. Prueba con JPG, PNG o WebP.",
      exportFailed: "No se pudo crear el fondo. Inténtalo de nuevo o elige otra foto.",
    },
  },
  blog: {
    title: "Guías de Fondos de Pantalla para iPhone Duo",
    description:
      "Guías en español sobre fondos de pantalla para iPhone Duo: el fondo oficial de Apple, los tamaños de la pantalla exterior e interior y cómo elegir uno nítido.",
    breadcrumb: "Guías",
    h1: "Guías en español.",
    lead: "Todo lo que necesitas saber para que tu fondo se vea nítido en las dos pantallas del iPhone Duo.",
    by: "Por",
    team: "el equipo editorial de {site}",
    minRead: "{n} min de lectura",
    toc: "En esta guía",
    english: "Leer en inglés",
    more: ["Más guías.", "En español."],
    wallpapers: ["Fondos para probar.", "Recién salidos de la biblioteca."],
  },
  guides: [
    {
      slug: "official-iphone-duo-wallpaper",
      title: "El fondo de pantalla oficial del iPhone Duo: dunas claras y oscuras, tamaños y cómo conseguirlo",
      seoTitle: "Fondo de Pantalla Oficial del iPhone Duo: Claro y Oscuro",
      description:
        "El fondo oficial del iPhone Duo son dunas del desierto en versión clara y oscura. Tamaños exactos de la pantalla exterior e interior, si es 4K y cómo ponerlo.",
      excerpt:
        "Apple creó cuatro fondos para el iPhone Duo: dunas del desierto bajo una cordillera, en claro y oscuro. Te contamos cómo son, los tamaños exactos de cada pantalla, de dónde salen y cómo ponerlos.",
      tags: ["iPhone Duo", "fondos oficiales"],
      published: "2026-10-08",
      content: `Cuando Apple presentó el iPhone Duo, su primer iPhone plegable, lo mostró con un fondo de pantalla nuevo: amplias dunas del desierto frente a una cordillera escarpada. Es la imagen en la que piensa casi todo el mundo cuando busca "fondo de pantalla iPhone Duo". Esta guía explica cómo es el fondo oficial, los tamaños exactos de cada pantalla, de dónde salen los archivos y cómo conseguir el mismo estilo en el teléfono que ya tienes.

## Cómo es el fondo oficial del iPhone Duo

Hay **cuatro** imágenes oficiales: dos para el modo claro y dos para el modo oscuro.

- **Las versiones claras** muestran las dunas de día: arena beige cálida bajo un cielo azul pálido.
- **Las versiones oscuras** muestran el mismo paisaje de noche, con sombras profundas, un cielo lleno de estrellas y un brillo suave en el horizonte.

Como la mayoría de los fondos recientes de Apple, la pareja está pensada para cambiar con la apariencia del sistema: clara durante el día y oscura por la noche o cuando el modo oscuro está activado.

## Por qué hay dos archivos de cada versión

El iPhone Duo tiene dos pantallas con formas muy diferentes, así que una sola imagen no puede llenar las dos:

| Pantalla | Resolución | Forma |
| --- | --- | --- |
| Exterior (5,4 pulgadas, cerrado) | 1398 × 2034 | Vertical, alta |
| Interior (7,6 pulgadas, abierto) | 2670 × 1878 | Horizontal, ancha |

Apple lo resuelve dibujando la escena para las dos. Cerrado, la pantalla exterior muestra un recorte más cercano de las dunas. Abierto, el fondo se ensancha para mostrar todo el paisaje en la pantalla interior. Por eso el conjunto oficial trae una imagen alta y otra ancha tanto en claro como en oscuro.

Si solo te quedas con un archivo, elige el de la pantalla en la que lo vas a usar. Una imagen alta de la pantalla exterior estirada sobre la interior, que es ancha, se amplía unas 1,9 veces y pierde más de la mitad de su altura. La explicación completa está en [los tamaños de fondo del iPhone Duo](/es/blog/iphone-duo-wallpaper-sizes-explained).

## ¿Los fondos oficiales son 4K?

No. Los archivos de Apple tienen el tamaño exacto de cada pantalla: 1398 × 2034 para la exterior y 2670 × 1878 para la interior. Ninguno llega a 3840 píxeles en el lado largo, que es lo que suele significar 4K. Verás versiones "4K" en internet: son ampliaciones de los archivos de Apple. Una ampliación puede verse limpia en una pantalla más grande, pero no añade detalles que no estaban en el original. En el propio iPhone Duo, los archivos originales ya se ven nítidos píxel a píxel.

## De dónde sale el fondo oficial

Los fondos vienen instalados en el iPhone Duo y aparecen en la galería de fondos al configurar el teléfono. iOS 27 para otros iPhone no los incluye. Antes del lanzamiento se encontraron dentro de las herramientas para desarrolladores de Apple (el simulador del iPhone Duo en la beta de Xcode 27.1) y los publicaron webs de noticias de Apple como [9to5Mac](https://9to5mac.com/2026/09/18/download-the-iphone-duos-official-light-and-dark-wallpapers-here/).

**No alojamos los fondos de Apple.** Son obras de Apple protegidas por derechos de autor: vienen con el dispositivo para usarlas en él, pero no se pueden redistribuir libremente. Todo lo que hay en esta web son diseños originales hechos para las pantallas del iPhone Duo.

## Cómo poner el fondo oficial en el iPhone Duo

1. Mantén presionada la pantalla de bloqueo y toca el botón **+**.
2. Desplázate hasta las colecciones de Apple y elige el fondo de las dunas.
3. Decide si debe seguir la apariencia del sistema (claro de día, oscuro de noche).
4. Toca **Añadir** y elige usarlo también en la pantalla de inicio.

En el iPhone Duo, configura cada pantalla con el teléfono en esa posición —cerrado para la exterior, abierto para la interior— para ver el recorte que vas a obtener de verdad.

## Usar una copia descargada en otro iPhone

Si guardaste una de las imágenes oficiales para usarla en un iPhone 18 Pro o en un iPhone anterior, elige la versión alta de la pantalla exterior. Es la forma más parecida, pero la pantalla exterior es más ancha en proporción que un iPhone normal, así que se recorta aproximadamente un tercio del ancho de la imagen por los lados. La versión ancha de la pantalla interior queda reducida a una tira vertical estrecha. Después, sigue [cómo poner un fondo de pantalla en el iPhone](/blog/how-to-set-wallpaper-on-iphone) (en inglés).

## Fondos originales con el mismo ambiente

Si te gusta la calma del desierto al atardecer del fondo oficial pero quieres algo que no tenga nadie más, estos originales de nuestra biblioteca tienen el mismo tipo de paisaje tranquilo:

- [Midnight Blue Desert Dunes](/es/wallpapers/midnight-blue-desert-dunes-dual-iphone-wallpaper): suaves curvas de arena bajo un cielo nocturno minimalista, lo más parecido a la versión oscura.
- [Monochrome Desert River](/es/wallpapers/monochrome-desert-river-minimalist-wallpaper): dunas negras con un río brillante serpenteando entre ellas.
- [Midnight Peak](/es/wallpapers/midnight-peak-amoled-duo-wallpaper): una única cumbre nevada sobre negro puro, para los fans del AMOLED.
- [Snow Mountain and Moon](/es/wallpapers/minimal-snow-mountain-moon-landscape-duo-wallpaper): picos helados bajo un cielo azul suave.
- [Misty Mountain Pine](/es/wallpapers/misty-mountain-pine-tree-duo-wallpaper): picos rocosos que se pierden entre las nubes.

Cada página de fondo muestra la resolución exacta y cómo encaja la imagen en la pantalla exterior e interior del iPhone Duo y en el iPhone 18 Pro antes de descargarla. Para ver más de este estilo, entra en la categoría [Paisajes](/es/categories/landscape) o en [Oscuros y AMOLED](/es/categories/dark) para escenas nocturnas como la versión oscura. ¿Prefieres usar tu propia foto? El [creador de fondos para iPhone Duo](/es/maker) la recorta para las dos pantallas.`,
    },
    {
      slug: "iphone-duo-wallpaper-sizes-explained",
      title: "Tamaños de fondo de pantalla del iPhone Duo: pantalla exterior e interior",
      seoTitle: "Tamaño de Fondo de Pantalla iPhone Duo: Exterior e Interior",
      description:
        "Resoluciones exactas de la pantalla exterior (1398 × 2034) e interior (2670 × 1878) del iPhone Duo y reglas sencillas para elegir un fondo nítido en las dos.",
      excerpt:
        "El iPhone Duo tiene dos pantallas muy distintas. Estas son las resoluciones exactas y unas reglas sencillas para elegir fondos que se vean nítidos en las dos.",
      tags: ["iPhone Duo", "resolución"],
      published: "2026-10-08",
      content: `El iPhone Duo es el primer iPhone plegable de Apple y tiene **dos pantallas**: una exterior de 5,4 pulgadas que usas con el teléfono cerrado y una interior de 7,6 pulgadas que se abre como un libro. Como las dos pantallas se usan en orientaciones distintas, un fondo que queda perfecto en una puede verse recortado en la otra. Esta guía explica las cifras y te da unas reglas sencillas.

## Resoluciones de un vistazo

| Pantalla | Tamaño | Resolución (en uso) | Orientación |
| --- | --- | --- | --- |
| iPhone Duo, pantalla exterior | 5,4 pulgadas | 1398 × 2034 px | Vertical (alta) |
| iPhone Duo, pantalla interior | 7,6 pulgadas | 2670 × 1878 px | Horizontal (ancha, abierto) |
| iPhone 18 Pro Max | 6,9 pulgadas | 1320 × 2868 px | Vertical |
| iPhone 18 Pro | 6,3 pulgadas | 1206 × 2622 px | Vertical |

Las fichas técnicas suelen indicar la pantalla interior como 1878 × 2670. Es el mismo panel: al abrir el iPhone Duo, la bisagra queda en vertical y la pantalla en horizontal, por eso la indicamos como 2670 × 1878.

## Regla 1: iguala o supera la resolución

Un fondo debe ser **al menos** tan grande como la pantalla en las dos direcciones. Las imágenes más pequeñas se estiran y se ven suaves. Cada fondo de esta web indica su resolución completa, para que lo compruebes antes de descargarlo.

## Regla 2: elige la forma adecuada para cada pantalla

- **Pantalla exterior:** elige fondos altos, en vertical. Cualquiera de 1398 × 2034 o más alto encaja sin problema.
- **Pantalla interior:** elige fondos anchos o una imagen **cuadrada**. Una imagen cuadrada (por ejemplo, 2670 × 2670) deja margen a iOS para reencuadrar si giras el teléfono abierto.
- **El mismo fondo en las dos:** los diseños con un motivo claro en el centro —un planeta, una flor, una esfera de degradado— se recortan bien en las dos formas.

Si quieres usar una foto propia, el [creador de fondos para iPhone Duo](/es/maker) hace los dos recortes por ti, cada uno a su tamaño exacto.

## Regla 3: cuidado con el pliegue y el reloj

En la pantalla interior, la línea de plegado recorre el centro. Los fondos con una línea vertical marcada justo en el medio pueden hacer el pliegue más visible, así que los motivos descentrados suelen quedar mejor. En la pantalla de bloqueo, deja algo de espacio libre arriba para el reloj y los widgets.

## Regla 4: usa formatos de buena calidad

JPEG y PNG funcionan en todas partes. PNG mantiene los colores planos y los degradados sin bandas; JPEG mantiene las fotos ligeras. Evita las capturas de pantalla de fondos: pierden calidad e incluyen elementos de la interfaz.

## Lista rápida

1. Comprueba la resolución del fondo en su página.
2. Usa una imagen vertical para la pantalla exterior y una ancha o cuadrada para la interior.
3. En la pantalla interior, aparta el motivo principal de la línea central.
4. Descarga el archivo original en lugar de guardar una vista previa.

Explora nuestros fondos para la [pantalla interior del iPhone Duo](/es/devices/iphone-duo-inner-display) y para la [pantalla exterior](/es/devices/iphone-duo-outer-display): todos se comprueban antes de publicarse. ¿Buscas el fondo de Apple? Lee sobre [el fondo de pantalla oficial del iPhone Duo](/es/blog/official-iphone-duo-wallpaper).`,
    },
  ],
  wallpaper: ES_WALLPAPER,
  listing: ES_LISTING,
  taxonomy: ES_TAXONOMY,
  search: ES_SEARCH,
};
