import { Resend } from "resend";

export function getResend() {
  return new Resend(process.env.RESEND_API_KEY!);
}

export const FROM_EMAIL = "aeronix holidays <hello@aeronixholidays.com>";
