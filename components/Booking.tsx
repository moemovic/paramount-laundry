"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BUSINESS, SERVICES, type ServiceId } from "@/lib/business";
import {
  MONTHS, SLOT_START_HOURS, WEEKDAYS, dayStatus, lagosNow, prettyDate, slotLabel, slotStatus, toKey, weekdayOf,
} from "@/lib/schedule";
import { Arrow, Check, Chevron } from "./Icons";

type Step = 1 | 2 | 3;

export default function Booking() {
  const [now, setNow] = useState(() => lagosNow());
  const [step, setStep] = useState<Step>(1);
  const [done, setDone] = useState(false);
  const [picked, setPicked] = useState<ServiceId[]>(["wash"]);
  const [view, setView] = useState(() => ({ y: now.y, m: now.m }));
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<number | null>(null);
  const [booked, setBooked] = useState<number[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "", company: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Keep "today" accurate if the page stays open for a long time.
  useEffect(() => {
    const id = setInterval(() => setNow(lagosNow()), 60_000);
    return () => clearInterval(id);
  }, []);

  const loadAvailability = useCallback(async (key: string) => {
    setLoadingSlots(true);
    try {
      const res = await fetch(`/api/availability?date=${key}`, { cache: "no-store" });
      const data = (await res.json()) as { booked?: number[] };
      setBooked(Array.isArray(data.booked) ? data.booked : []);
    } catch {
      setBooked([]);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (date) loadAvailability(date);
  }, [date, loadAvailability]);

  // Calendar cells (Monday-first)
  const cells = useMemo(() => {
    const lead = (new Date(Date.UTC(view.y, view.m, 1)).getUTCDay() + 6) % 7;
    const dim = new Date(Date.UTC(view.y, view.m + 1, 0)).getUTCDate();
    const out: ({ key: string; day: number; status: ReturnType<typeof dayStatus> } | null)[] = [];
    for (let i = 0; i < lead; i++) out.push(null);
    for (let d = 1; d <= dim; d++) {
      const key = toKey(view.y, view.m, d);
      out.push({ key, day: d, status: dayStatus(key, now) });
    }
    return out;
  }, [view, now]);

  const atCurrentMonth = view.y === now.y && view.m === now.m;
  const shiftMonth = (delta: number) => {
    const d = new Date(Date.UTC(view.y, view.m + delta, 1));
    setView({ y: d.getUTCFullYear(), m: d.getUTCMonth() });
  };

  const slots = SLOT_START_HOURS.map((h) => {
    let note = "";
    let disabled = !date;
    if (date) {
      const st = slotStatus(date, h, now);
      if (st === "closed") { disabled = true; note = "Closed"; }
      else if (st === "passed") { disabled = true; note = "Passed"; }
      else if (booked.includes(h)) { disabled = true; note = "Booked"; }
    }
    return { h, label: slotLabel(h), note, disabled };
  });
  const visibleSlots = slots.filter((s) => s.note !== "Closed");

  const pickedLabels = SERVICES.filter((s) => picked.includes(s.id)).map((s) => s.label);
  const when = date ? `${prettyDate(date)}${slot !== null ? `, ${slotLabel(slot)}` : ""}` : "";

  function validate(upTo: Step): string {
    if (picked.length === 0) return "Please choose at least one service.";
    if (upTo >= 2) {
      if (!date) return "Please pick a date on the calendar.";
      if (slot === null) return "Please choose a one-hour pickup window.";
    }
    if (upTo >= 3) {
      if (form.name.trim().length < 2) return "Please enter your name.";
      if (form.phone.replace(/\D/g, "").length < 10) return "Please enter a valid phone number so we can confirm.";
      if (form.address.trim().length < 5) return "Please enter your pickup address.";
    }
    return "";
  }

  async function next() {
    const err = validate(step);
    if (err) { setError(err); return; }
    setError("");
    if (step < 3) { setStep((step + 1) as Step); return; }

    setSubmitting(true);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services: picked, date, slot, ...form }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (res.status === 409) {
        setSlot(null);
        setStep(2);
        if (date) loadAvailability(date);
        setError(data.error || "Sorry, that time was just booked. Please choose another window.");
        return;
      }
      if (!res.ok) {
        setError(data.error || `Something went wrong. Please call us on ${BUSINESS.phoneDisplay}.`);
        return;
      }
      setDone(true);
      if (date) loadAvailability(date);
    } catch {
      setError(`We couldn't reach the server. Please check your connection or call ${BUSINESS.phoneDisplay}.`);
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setDone(false); setStep(1); setPicked(["wash"]); setSlot(null);
    setForm({ name: "", phone: "", address: "", notes: "", company: "" }); setError("");
  }

  const railSteps = [
    { n: 1 as Step, title: "Services", sub: pickedLabels.length ? `${pickedLabels.length} selected` : "Choose what to clean" },
    {
      n: 2 as Step, title: "Date & time",
      sub: date ? `${WEEKDAYS[weekdayOf(date)].slice(0, 3)} ${Number(date.slice(8))} ${MONTHS[Number(date.slice(5, 7)) - 1].slice(0, 3)}${slot !== null ? ` · ${slotLabel(slot)}` : ""}` : "Pick from the calendar",
    },
    { n: 3 as Step, title: "Your details", sub: "Name, phone, address" },
  ];

  return (
    <section id="schedule" className="section" style={{ paddingTop: 104, paddingBottom: 104 }}>
      <div className="container">
        <div className="stack" style={{ gap: 14, maxWidth: 720, marginBottom: 40 }}>
          <div className="eyebrow">Schedule a pickup</div>
          <h2 className="h2">Book your pickup in three quick steps.</h2>
        </div>

        <div className="booking-wrap">
          <div className="booking-rail">
            {railSteps.map((s) => {
              const active = !done && step === s.n;
              const complete = done || step > s.n;
              const locked = done || s.n > step;
              return (
                <button
                  key={s.n}
                  type="button"
                  className={`rail-step ${active ? "active" : ""} ${complete ? "complete" : ""} ${locked && !complete ? "locked" : ""}`}
                  disabled={locked}
                  aria-current={active ? "step" : undefined}
                  onClick={() => { setError(""); setStep(s.n); }}
                >
                  <span className="rail-dot">{complete ? <Check size={16} width={3} /> : s.n}</span>
                  <span className="rail-text"><b>{s.title}</b><small>{s.sub}</small></span>
                </button>
              );
            })}
            <div className="rail-help">
              <span>Need help booking?</span>
              <a href={BUSINESS.phoneHref}>{BUSINESS.phoneDisplay}</a>
              <span style={{ fontSize: 13 }}>{BUSINESS.hoursShort} · Sun closed</span>
            </div>
          </div>

          <div className="booking-body" aria-live="polite">
            {done ? (
              <div className="done">
                <span className="done-icon"><Check size={30} color="#0B6B45" width={2.6} /></span>
                <h3>You&apos;re booked, {form.name.trim().split(" ")[0] || "there"}.</h3>
                <p>
                  We&apos;ll call {form.phone} to confirm. After pickup, we&apos;ll send you a message with your order
                  details and payment information.
                </p>
                <div className="done-table">
                  <div><span>Services</span><b>{pickedLabels.join(", ")}</b></div>
                  <div><span>Pickup</span><b>{when}</b></div>
                  <div><span>Address</span><b>{form.address}</b></div>
                </div>
                <button type="button" className="btn-outline" onClick={reset}>Book another pickup</button>
              </div>
            ) : (
              <>
                {step === 1 && (
                  <div className="stack" style={{ gap: 22 }}>
                    <h3>What needs cleaning?</h3>
                    <div className="svc-grid">
                      {SERVICES.map((s) => {
                        const on = picked.includes(s.id);
                        return (
                          <button
                            key={s.id}
                            type="button"
                            className="svc-btn"
                            aria-pressed={on}
                            onClick={() => {
                              setError("");
                              setPicked((p) => (on ? p.filter((x) => x !== s.id) : [...p, s.id]));
                            }}
                          >
                            <span><b>{s.label}</b><small>{s.desc}</small></span>
                            <span className="checkbox">{on && <Check size={16} width={3.2} />}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="stack" style={{ gap: 22 }}>
                    <h3>When should we come?</h3>
                    <div className="when">
                      <div className="calendar">
                        <div className="cal-head">
                          <button type="button" className="icon-btn" aria-label="Previous month" disabled={atCurrentMonth} onClick={() => shiftMonth(-1)}>
                            <Chevron dir="left" />
                          </button>
                          <strong aria-live="polite">{MONTHS[view.m]} {view.y}</strong>
                          <button type="button" className="icon-btn" aria-label="Next month" onClick={() => shiftMonth(1)}>
                            <Chevron dir="right" />
                          </button>
                        </div>
                        <div className="cal-grid" aria-hidden="true">
                          {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => <span key={d} className="cal-dow">{d}</span>)}
                        </div>
                        <div className="cal-grid">
                          {cells.map((c, i) =>
                            c === null ? (
                              <span key={`b${i}`} />
                            ) : (
                              <button
                                key={c.key}
                                type="button"
                                className={`cal-day ${c.key === now.key ? "today" : ""} ${c.status === "closed" ? "closed" : ""}`}
                                disabled={c.status !== "ok"}
                                aria-pressed={date === c.key}
                                aria-label={`${prettyDate(c.key)}${c.status === "closed" ? ", closed" : ""}`}
                                onClick={() => { setError(""); setDate(c.key); setSlot(null); }}
                              >
                                {c.day}
                              </button>
                            ),
                          )}
                        </div>
                        <div className="cal-note">Pickups 10 AM – 6 PM · Sundays closed</div>
                      </div>

                      <div className="slots">
                        <div className="slots-head">
                          <b>{date ? prettyDate(date) : "Pick a date to see times"}</b>
                          <small>{loadingSlots ? "Checking availability…" : "One-hour pickup windows"}</small>
                        </div>
                        <div className="slot-grid">
                          {date && visibleSlots.every((s) => s.disabled) && !loadingSlots && (
                            <div className="slot-empty">No windows left on this day — please pick another date.</div>
                          )}
                          {(date ? visibleSlots : slots).map((s) => (
                            <button
                              key={s.h}
                              type="button"
                              className={`slot ${s.note === "Booked" ? "booked" : ""}`}
                              disabled={s.disabled || loadingSlots}
                              aria-pressed={slot === s.h}
                              aria-label={`${s.label}${s.note ? `, ${s.note}` : ""}`}
                              onClick={() => { setError(""); setSlot(s.h); }}
                            >
                              <span className="slot-time">{s.label}</span>
                              {s.note && <span className="slot-note">{s.note}</span>}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="stack" style={{ gap: 18 }}>
                    <h3>Where should we pick up?</h3>
                    <div className="summary-bar"><b>{pickedLabels.join(", ")}</b> · {when}</div>
                    <div className="fields">
                      <div className="field-row">
                        <label className="field">
                          Full name
                          <input type="text" autoComplete="name" value={form.name} maxLength={80}
                            onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
                        </label>
                        <label className="field">
                          Phone number
                          <input type="tel" autoComplete="tel" inputMode="tel" value={form.phone} maxLength={20}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="e.g. 0803 000 0000" />
                        </label>
                      </div>
                      <label className="field">
                        <span>Pickup address <span className="hint">(Mainland or Island)</span></span>
                        <input type="text" autoComplete="street-address" value={form.address} maxLength={200}
                          onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="House number, street, area" />
                      </label>
                      <label className="field">
                        <span>Notes for our driver <span className="hint">(optional)</span></span>
                        <textarea rows={3} value={form.notes} maxLength={500}
                          onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Landmark, gate code, stains to treat…" />
                      </label>
                      {/* Honeypot: hidden from people, filled by bots */}
                      <label className="hp" aria-hidden="true">
                        Company
                        <input type="text" tabIndex={-1} autoComplete="off" value={form.company}
                          onChange={(e) => setForm({ ...form, company: e.target.value })} />
                      </label>
                    </div>
                  </div>
                )}

                <div className="form-actions">
                  {error && <div role="alert" className="alert">{error}</div>}
                  <div className="actions-row">
                    <button type="button" className="link-btn" style={{ visibility: step === 1 ? "hidden" : "visible" }}
                      onClick={() => { setError(""); setStep((step - 1) as Step); }}>
                      Back
                    </button>
                    <button type="button" className="btn-next" onClick={next} disabled={submitting}>
                      {submitting ? "Booking…" : step === 3 ? "Confirm pickup" : "Continue"} <Arrow />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
