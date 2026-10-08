import type { BookingEmail } from "./email";

/**
 * WhatsApp alert to the business owner via CallMeBot (free, personal-use API).
 * Setup: https://www.callmebot.com/blog/free-api-whatsapp-messages/
 *   1. Save the CallMeBot number shown on that page in your phone contacts.
 *   2. Send it "I allow callmebot to send me messages" on WhatsApp.
 *   3. Put the API key it replies with in CALLMEBOT_APIKEY.
 * Optional: WHATSAPP_ALERT_PHONE (defaults to the business number).
 *
 * Alerts are best-effort: if this fails, the booking still succeeds (email is the record).
 */

export const whatsappAlertConfigured = Boolean(process.env.CALLMEBOT_APIKEY);

export async function sendWhatsAppAlert(b: BookingEmail): Promise<void> {
  const apikey = process.env.CALLMEBOT_APIKEY;
  if (!apikey) return;
  const phone = process.env.WHATSAPP_ALERT_PHONE || "+2347031365794";

  const lines = [
    "*New pickup booking* 🧺",
    "",
    `*Date:* ${b.dateLabel}`,
    `*Time:* ${b.slotLabel}`,
    `*Services:* ${b.services.join(", ")}`,
    "",
    `*Name:* ${b.name}`,
    `*Phone:* ${b.phone}`,
    `*Address:* ${b.address}`,
    b.notes ? `*Notes:* ${b.notes}` : "",
    "",
    `Ref: ${b.id}`,
  ].filter((l, i, a) => !(l === "" && a[i - 1] === ""));

  const url =
    "https://api.callmebot.com/whatsapp.php?" +
    new URLSearchParams({ phone, text: lines.join("\n"), apikey }).toString();

  const res = await fetch(url, { method: "GET", cache: "no-store", signal: AbortSignal.timeout(8000) });
  const body = await res.text();
  if (!res.ok || /error|invalid|not\s+allowed/i.test(body.slice(0, 500))) {
    throw new Error(`CallMeBot ${res.status}: ${body.replace(/<[^>]+>/g, " ").trim().slice(0, 200)}`);
  }
}
