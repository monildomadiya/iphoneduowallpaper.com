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
  zh: {
    slow: "请花点时间填写表单，然后重试。",
    rateLimited: "你最近发送了多条留言。请在 {n} 分钟后重试。",
    nameShort: "请输入你的姓名。",
    nameLong: "姓名太长了。",
    email: "请输入有效的电子邮件地址。",
    subjectLong: "主题太长了。",
    messageShort: "留言至少需要 10 个字符。",
    messageLong: "留言太长了。",
    success: "感谢你的来信！留言已发送，我们会通过电子邮件回复你。",
    failure: "目前无法发送你的留言。请直接给我们发送电子邮件。",
  },
  ko: {
    slow: "잠시 시간을 내어 양식을 작성한 뒤 다시 시도해 주세요.",
    rateLimited: "최근에 메시지를 여러 번 보내셨습니다. {n}분 후에 다시 시도해 주세요.",
    nameShort: "이름을 입력해 주세요.",
    nameLong: "이름이 너무 깁니다.",
    email: "올바른 이메일 주소를 입력해 주세요.",
    subjectLong: "제목이 너무 깁니다.",
    messageShort: "메시지는 10자 이상이어야 합니다.",
    messageLong: "메시지가 너무 깁니다.",
    success: "문의해 주셔서 감사합니다! 메시지가 전송되었으며 이메일로 답변 드리겠습니다.",
    failure: "지금은 메시지를 보낼 수 없습니다. 이메일로 직접 보내 주세요.",
  },
  de: {
    slow: "Nimm dir bitte einen Moment Zeit für das Formular und versuche es dann noch einmal.",
    rateLimited: "Du hast kürzlich mehrere Nachrichten gesendet. Bitte versuche es in {n} Minuten noch einmal.",
    nameShort: "Bitte gib deinen Namen ein.",
    nameLong: "Der Name ist zu lang.",
    email: "Bitte gib eine gültige E-Mail-Adresse ein.",
    subjectLong: "Der Betreff ist zu lang.",
    messageShort: "Deine Nachricht muss mindestens 10 Zeichen lang sein.",
    messageLong: "Deine Nachricht ist zu lang.",
    success: "Danke für deine Nachricht! Sie wurde gesendet, und wir antworten dir per E-Mail.",
    failure: "Deine Nachricht kann gerade nicht gesendet werden. Bitte schreib uns direkt per E-Mail.",
  },
};

export function contactMessages(locale: unknown): ContactMessages {
  const known = typeof locale === "string" && Object.keys(CONTACT_MESSAGES).includes(locale);
  return known ? CONTACT_MESSAGES[locale as Locale] : CONTACT_MESSAGES.en;
}
