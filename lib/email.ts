import { Resend } from "resend";
import { BUSINESS } from "./business";

export type BookingEmail = {
  id: string;
  services: string[];
  dateLabel: string;
  slotLabel: string;
  name: string;
  phone: string;
  address: string;
  notes: string;
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const emailConfigured = Boolean(process.env.RESEND_API_KEY);

export async function sendBookingEmail(b: BookingEmail): Promise<void> {
  const to = process.env.BOOKING_EMAIL_TO || BUSINESS.email;
  const from = process.env.BOOKING_EMAIL_FROM || "Paramount Laundry <onboarding@resend.dev>";
  const subject = `New pickup: ${b.dateLabel}, ${b.slotLabel} — ${b.name}`;

  const rows: [string, string][] = [
    ["Pickup date", b.dateLabel],
    ["Time window", b.slotLabel],
    ["Services", b.services.join(", ")],
    ["Name", b.name],
    ["Phone", b.phone],
    ["Address", b.address],
    ["Notes", b.notes || "—"],
    ["Booking ref", b.id],
  ];

  const text = ["New pickup booking from the website", "", ...rows.map(([k, v]) => `${k}: ${v}`)].join("\n");

  const html = `<!doctype html><html><body style="margin:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;color:#0d1b2a">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden">
<tr><td style="background:#1d4ed8;color:#ffffff;padding:22px 28px;font-size:20px;font-weight:bold">New pickup booking</td></tr>
<tr><td style="padding:24px 28px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;line-height:1.5">
${rows
  .map(
    ([k, v]) =>
      `<tr><td style="padding:8px 0;color:#5b6575;width:130px;vertical-align:top">${esc(k)}</td><td style="padding:8px 0;font-weight:bold">${esc(v)}</td></tr>`,
  )
  .join("")}
</table>
<p style="margin:20px 0 0"><a href="tel:${esc(b.phone.replace(/[^\d+]/g, ""))}" style="display:inline-block;background:#0d1b2a;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:bold">Call ${esc(b.name)}</a></p>
</td></tr></table>
<p style="font-size:12px;color:#5b6575">Sent automatically by the Paramount Laundry website.</p>
</td></tr></table></body></html>`;

  if (!emailConfigured) {
    // Local development without a key: log instead of sending.
    console.warn("[booking] RESEND_API_KEY not set — email not sent.\n" + text);
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({ from, to: [to], subject, text, html });
  if (error) throw new Error(`Resend error: ${error.message}`);
}
