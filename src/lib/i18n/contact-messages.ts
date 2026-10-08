import type { Locale } from "@/lib/i18n/types";

/** What the contact form's server action says back, in the language of the page it was sent from. */
export interface ContactMessages {
  slow: string;
  /** `{n}` is the number of minutes. */
  rateLimited: string;
  nameShort: string;
  nameLong: string;
  email: string;
  subjectLong: string;
  messageShort: string;
  messageLong: string;
  success: string;
  failure: string;
}

export const CONTACT_MESSAGES: Record<Locale, ContactMessages> = {
  en: {
    slow: "Please take a moment to complete the form, then try again.",
    rateLimited: "You've sent several messages recently. Please try again in {n} minutes.",
    nameShort: "Please enter your name.",
    nameLong: "Name is too long.",
    email: "Please enter a valid email address.",
    subjectLong: "Subject is too long.",
    messageShort: "Your message should be at least 10 characters.",
    messageLong: "Your message is too long.",
    success: "Thanks for reaching out! Your message has been sent and we'll reply by email.",
    failure: "We couldn't send your message right now. Please email us directly instead.",
  },
  es: {
    slow: "Tómate un momento para completar el formulario y vuelve a intentarlo.",
    rateLimited: "Has enviado varios mensajes hace poco. Vuelve a intentarlo dentro de {n} minutos.",
    nameShort: "Escribe tu nombre.",
    nameLong: "El nombre es demasiado largo.",
    email: "Escribe un correo electrónico válido.",
    subjectLong: "El asunto es demasiado largo.",
    messageShort: "El mensaje debe tener al menos 10 caracteres.",
    messageLong: "El mensaje es demasiado largo.",
    success: "¡Gracias por escribirnos! Tu mensaje se ha enviado y te responderemos por correo.",
    failure: "Ahora mismo no podemos enviar tu mensaje. Escríbenos directamente por correo.",
  },
  tr: {
    slow: "Lütfen formu doldurmak için biraz zaman ayırın ve tekrar deneyin.",
    rateLimited: "Kısa süre içinde birkaç mesaj gönderdiniz. Lütfen {n} dakika sonra tekrar deneyin.",
    nameShort: "Lütfen adınızı yazın.",
    nameLong: "Ad çok uzun.",
    email: "Lütfen geçerli bir e-posta adresi yazın.",
    subjectLong: "Konu çok uzun.",
    messageShort: "Mesajınız en az 10 karakter olmalı.",
    messageLong: "Mesajınız çok uzun.",
    success: "Bize yazdığınız için teşekkürler! Mesajınız gönderildi, size e-postayla yanıt vereceğiz.",
    failure: "Mesajınızı şu anda gönderemiyoruz. Lütfen doğrudan e-posta gönderin.",
  },
};

export function contactMessages(locale: unknown): ContactMessages {
  return locale === "es" || locale === "tr" ? CONTACT_MESSAGES[locale] : CONTACT_MESSAGES.en;
}
