import emailjs from 'emailjs-com';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

export interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// needs the VITE_EMAILJS_* env vars set — template should use {{name}}, {{email}},
// {{subject}}, {{message}} as merge fields
export async function sendViaEmailJs(payload: ContactFormPayload): Promise<void> {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    throw new Error('EmailJS is not configured. Set the VITE_EMAILJS_* environment variables.');
  }
  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      from_name: payload.name,
      reply_to: payload.email,
      subject: payload.subject,
      message: payload.message,
    },
    PUBLIC_KEY,
  );
}
