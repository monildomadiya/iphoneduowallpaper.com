import type { AboutStrings, ContactStrings } from "@/lib/i18n/types";

export const ES_ABOUT: AboutStrings = {
  title: "Quiénes Somos",
  description:
    "{site} es una biblioteca independiente de fondos de pantalla gratis y a resolución completa, pensados para la pantalla interior y exterior del iPhone Duo.",
  eyebrow: "Quiénes somos",
  h1: "Dos pantallas merecen",
  h1Accent: "grandes fondos.",
  lead: "{site} es una biblioteca independiente de fondos creada para el primer iPhone plegable. Nuestro objetivo es sencillo: ayudarte a encontrar fondos bonitos y a resolución completa que se vean bien en todas tus pantallas.",
  principles: [
    {
      title: "Hechos para encajar",
      body: "El iPhone Duo tiene una pantalla exterior alta de 5,4 pulgadas y una interior ancha de 7,6 pulgadas. Comprobamos cada fondo en las dos, además de en los iPhone 18 Pro, y te mostramos cómo encaja antes de descargarlo.",
    },
    {
      title: "Siempre a resolución completa",
      body: "Nada de vistas previas borrosas ni capturas. Descargas el archivo original, con la resolución exacta y el tamaño del archivo indicados en cada página.",
    },
    {
      title: "Respeto por los creadores",
      body: "Publicamos obras originales, diseños creados con ayuda de IA y revisados por una persona, imágenes con licencia y obras de dominio público, y damos crédito a los artistas siempre que corresponde.",
    },
    {
      title: "Organizados con cuidado",
      body: "Las categorías y las páginas por dispositivo hacen que sea fácil encontrar un fondo que vaya con tu estilo y con tu pantalla.",
    },
  ],
  sections: [
    {
      title: "Por qué empezamos",
      body: "Cuando llega un iPhone nuevo, la gente busca fondos que encajen con su pantalla. El iPhone Duo lo puso más difícil: su pantalla exterior es alta y vertical, mientras que la interior se abre en un lienzo ancho con un pliegue en el centro. La mayoría de las webs de fondos estaban pensadas para un solo tipo de teléfono, así que creamos una para las dos formas.",
    },
    {
      title: "Cómo elegimos los fondos",
      body: "Revisamos cada fondo antes de publicarlo. Miramos la resolución, la composición alrededor del reloj de la pantalla de bloqueo y del pliegue, la calidad del color en pantallas OLED y si tenemos derecho a compartirlo. Cada fondo tiene un título claro, una descripción, una categoría y detalles como la resolución y el tamaño del archivo, para que sepas exactamente qué descargas.",
    },
    {
      title: "Guías que de verdad ayudan",
      body: "Además de fondos, publicamos [guías prácticas](/es/blog): desde los tamaños exactos de las pantallas del iPhone Duo hasta el fondo oficial de Apple. Algunas guías, por ahora, solo están en inglés.",
    },
    {
      id: "editorial-team",
      title: "Nuestro equipo editorial y nuestros criterios",
      body: `Nuestras guías las escribe y edita el equipo editorial de {site}, las mismas personas que revisan cada fondo antes de publicarlo. Escribimos sobre las preguntas que más nos hacen y aplicamos los mismos criterios a todas las guías:

- **Concretas y prácticas.** Tamaños de pantalla exactos, rutas de menú reales e instrucciones paso a paso, sin relleno.
- **Revisadas antes de publicarse.** Comparamos los pasos con la documentación de Apple y con la versión actual de iOS. Cuando los nombres de los menús cambian entre versiones de iOS, lo decimos.
- **Actualizadas.** Cada guía muestra la fecha de su última actualización, y las revisamos cuando iOS cambia la forma de hacer algo.
- **Independientes.** No aceptamos pagos por publicar contenido. La publicidad está claramente señalada y separada de nuestro contenido.
- **Abiertas a correcciones.** Si algo está mal o desactualizado, [avísanos](/es/contact) y lo corregimos.`,
    },
    {
      title: "Independientes y gratis",
      body: "No tenemos relación con Apple Inc. La web es gratuita y se mantiene con publicidad claramente señalada. Los fondos son para uso personal en tus propios dispositivos; consulta nuestros [Términos de uso](/terms) (en inglés).",
    },
    {
      title: "Contacto",
      body: "¿Quieres pedir un fondo, darnos tu opinión o proponernos una colaboración? Visita nuestra [página de contacto](/es/contact) o escríbenos a [{email}](mailto:{email}). Los creadores que encuentren aquí su obra sin permiso pueden escribirnos desde nuestra [página de derechos de autor](/dmca) (en inglés).",
    },
  ],
};

export const ES_CONTACT: ContactStrings = {
  title: "Contacto",
  description: "Escribe a {site} para pedir fondos, darnos tu opinión, proponer colaboraciones o pedir ayuda.",
  eyebrow: "Contacto",
  h1: "Nos encantará saber de ti.",
  lead: "Peticiones de fondos, comentarios, ideas de colaboración o un problema con una descarga: envíanos un mensaje.",
  emailTitle: "Correo electrónico",
  responseTitle: "Tiempo de respuesta",
  responseBody: "Intentamos responder en 2 o 3 días hábiles.",
  copyrightTitle: "Derechos de autor",
  copyrightBefore: "Los titulares de derechos pueden presentar un aviso en nuestra ",
  dmcaLink: "página DMCA",
  copyrightAfter: " (en inglés) para que lo revisemos lo antes posible.",
  form: {
    name: "Nombre",
    email: "Correo electrónico",
    subject: "Asunto",
    subjectPlaceholder: "Petición de fondo, comentario, colaboración…",
    message: "Mensaje",
    send: "Enviar mensaje",
    sending: "Enviando…",
  },
};
