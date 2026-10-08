"use client";

import { useEffect, useState } from "react";
import { BUSINESS } from "@/lib/business";
import { OPENING, WEEKDAYS, formatHour, lagosNow } from "@/lib/schedule";
import { Plus } from "./Icons";

export function HoursCard() {
  const [today, setToday] = useState<number | null>(null);
  useEffect(() => {
    const n = lagosNow();
    setToday(new Date(Date.UTC(n.y, n.m, n.d)).getUTCDay());
  }, []);
  const order = [1, 2, 3, 4, 5, 6, 0];
  return (
    <div className="hours-card">
      <h3>Opening hours</h3>
      {order.map((d) => {
        const h = OPENING[d];
        const cls = ["hours-row", d === today ? "today" : "", !h ? "closed" : ""].join(" ");
        return (
          <div key={d} className={cls}>
            <b>
              {WEEKDAYS[d]}
              {d === today && <em>Today</em>}
            </b>
            <span>{h ? `${formatHour(h.open)} – ${formatHour(h.close)}` : "Closed"}</span>
          </div>
        );
      })}
    </div>
  );
}

const FAQS = [
  { q: "Which areas do you pick up from?", a: "We pick up and deliver across Lagos — both the Mainland and the Island. Our base is at 1 Baale Crescent, Ikola Road, Alimosho." },
  { q: "How long until I get my clothes back?", a: "Your clothes are returned within 3 to 4 days of pickup or drop-off." },
  { q: "How do I pay?", a: "We accept bank transfer and POS. After pickup, we send you a message with your order details so you can complete payment." },
  { q: "What are your opening hours?", a: "Monday to Saturday, 8 AM to 7 PM (Thursdays from 10 AM). We are closed on Sundays." },
  { q: "Do I need to separate my clothes?", a: "No. Just bag everything up — we sort by colour, fabric and care label before anything is washed." },
  { q: "What if something is damaged or missing?", a: "Every item is checked before and after cleaning. If anything is not right, contact us within 4 to 7 days and we will make it right." },
];

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="section section-white">
      <div className="container faq-grid">
        <div className="faq-intro">
          <div className="eyebrow">FAQ</div>
          <h2 className="h2">Good questions.</h2>
          <p>
            Can&apos;t find what you need? Call us on <a href={BUSINESS.phoneHref}><b>{BUSINESS.phoneDisplay}</b></a> or
            email <a href={`mailto:${BUSINESS.email}`}><b>{BUSINESS.email}</b></a>.
          </p>
        </div>
        <div className="faq-list">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="faq-item">
                <button
                  type="button"
                  className="faq-q"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span>{f.q}</span>
                  <span className="faq-icon"><Plus /></span>
                </button>
                {isOpen && <p id={`faq-${i}`} className="faq-a">{f.a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
