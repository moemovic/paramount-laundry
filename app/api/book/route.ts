import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { BUSINESS, SERVICES } from "@/lib/business";
import { dayStatus, parseKey, prettyDate, slotLabel, slotStatus } from "@/lib/schedule";
import { claimSlot, releaseSlot, storeConfigured } from "@/lib/store";
import { emailConfigured, sendBookingEmail } from "@/lib/email";
import { sendWhatsAppAlert } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max) : "";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot — bots fill the hidden "company" field. Pretend success.
  if (clean(body.company, 100)) return NextResponse.json({ ok: true });

  if (process.env.NODE_ENV === "production" && (!storeConfigured || !emailConfigured)) {
    console.error("[book] Missing configuration: storage", storeConfigured, "email", emailConfigured);
    return NextResponse.json(
      { error: `Online booking is temporarily unavailable. Please call us on ${BUSINESS.phoneDisplay}.` },
      { status: 503 },
    );
  }

  const validIds = new Set<string>(SERVICES.map((s) => s.id));
  const services = Array.isArray(body.services)
    ? [...new Set(body.services.filter((s): s is string => typeof s === "string" && validIds.has(s)))]
    : [];
  const date = clean(body.date, 10);
  const slot = typeof body.slot === "number" ? body.slot : NaN;
  const name = clean(body.name, 80);
  const phone = clean(body.phone, 20);
  const address = clean(body.address, 200);
  const notes = clean(body.notes, 500);

  if (services.length === 0) return NextResponse.json({ error: "Please choose at least one service." }, { status: 400 });
  if (!parseKey(date) || dayStatus(date) !== "ok") return NextResponse.json({ error: "Please pick an available date." }, { status: 400 });
  if (!Number.isInteger(slot) || slotStatus(date, slot) !== "ok")
    return NextResponse.json({ error: "Please choose an available time window." }, { status: 400 });
  if (name.length < 2) return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  if (phone.replace(/\D/g, "").length < 10) return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
  if (address.length < 5) return NextResponse.json({ error: "Please enter your pickup address." }, { status: 400 });

  const id = randomUUID().slice(0, 8).toUpperCase();
  const serviceLabels = SERVICES.filter((s) => services.includes(s.id)).map((s) => s.label);
  const record = { id, services: serviceLabels, date, slot, name, phone, address, notes, createdAt: new Date().toISOString() };

  let claimed = false;
  try {
    claimed = await claimSlot(date, slot, JSON.stringify(record));
  } catch (e) {
    console.error("[book] storage error", e);
    return NextResponse.json({ error: `We couldn't save your booking. Please call us on ${BUSINESS.phoneDisplay}.` }, { status: 500 });
  }
  if (!claimed) {
    return NextResponse.json({ error: "Sorry, that time was just booked. Please choose another window." }, { status: 409 });
  }

  const details = {
    id, services: serviceLabels, dateLabel: prettyDate(date), slotLabel: slotLabel(slot), name, phone, address, notes,
  };

  try {
    await sendBookingEmail(details);
  } catch (e) {
    console.error("[book] email error", e);
    await releaseSlot(date, slot).catch(() => {});
    return NextResponse.json({ error: `We couldn't send your booking. Please try again or call ${BUSINESS.phoneDisplay}.` }, { status: 502 });
  }

  // WhatsApp alert after the booking is confirmed; a failure here never undoes the booking.
  await sendWhatsAppAlert(details).catch((e) => console.error("[book] whatsapp alert failed", e));

  return NextResponse.json({ ok: true, id });
}
