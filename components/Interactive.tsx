"use client";

import { useEffect, useState } from "react";
import { BUSINESS } from "@/lib/business";
import { FAQS } from "@/lib/faqs";
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
                <p id={`faq-${i}`} className="faq-a" hidden={!isOpen}>{f.a}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
