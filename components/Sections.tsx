import Image from "next/image";
import { BUSINESS } from "@/lib/business";
import { Arrow, ArrowUpRight, Check, Logo, Shirt } from "./Icons";

export function Header() {
  return (
    <header className="site-header">
      <nav className="container nav" aria-label="Main">
        <a href="#top" className="brand" aria-label="Paramount Laundry home">
          <Logo />
          <span className="brand-name">
            Paramount<span> Laundry</span>
          </span>
        </a>
        <div className="nav-links">
          <a href="#services">Services</a>
          <a href="#how">How it works</a>
          <a href="#about">About us</a>
          <a href="#visit">Visit us</a>
          <a href="#faq">FAQ</a>
        </div>
        <a href="#schedule" className="btn btn-dark">
          <span className="label-long">Schedule pickup</span>
          <span className="label-short">Book now</span>
        </a>
      </nav>
    </header>
  );
}

export function Hero() {
  return (
    <section id="top" className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="pill">
            <b>LAGOS</b>
            Pickup &amp; delivery on the Mainland and the Island
          </div>
          <h1>Fresh laundry, without the laundry day.</h1>
          <p className="hero-lead">
            Laundry and dry cleaning pickup &amp; delivery in Lagos. Book in under a minute — we collect, clean, fold
            and return your clothes to your door, crisp, fresh and ready to wear.
          </p>
          <div className="row-wrap">
            <a href="#schedule" className="btn btn-primary">
              Schedule a pickup <Arrow />
            </a>
            <a href={BUSINESS.phoneHref} className="btn btn-ghost">
              Call {BUSINESS.phoneDisplay}
            </a>
          </div>
          <div className="ticks">
            <span><Check color="#1D4ED8" /> Pickup at your door</span>
            <span><Check color="#1D4ED8" /> Back in 3–4 days</span>
            <span><Check color="#1D4ED8" /> Pay by transfer or POS</span>
          </div>
        </div>

        <div className="hero-visual">
          <Image
            className="hero-photo"
            src="/images/hero.jpg"
            alt="Commercial washing machines at Paramount Laundry, Lagos"
            width={1600}
            height={1064}
            sizes="(max-width: 900px) 100vw, 560px"
            fetchPriority="high"
            loading="eager"
          />
          <div className="chip-dark">
            <Shirt />
            <div>
              <b>Folded with care</b>
              <small>Sorted by fabric &amp; colour</small>
            </div>
          </div>
          <div className="status-card" aria-hidden="true">
            <div className="status-head">
              <div>
                <small>Your order</small>
                <strong>Wash, fold &amp; press</strong>
              </div>
              <span className="badge-green">On its way</span>
            </div>
            <div className="timeline">
              <div className="tl-item">
                <div className="tl-rail"><span className="tl-dot"><Check size={14} color="#fff" width={3} /></span><span className="tl-line" /></div>
                <p>Picked up</p>
              </div>
              <div className="tl-item">
                <div className="tl-rail"><span className="tl-dot"><Check size={14} color="#fff" width={3} /></span><span className="tl-line dim" /></div>
                <p>Washed, dried &amp; folded</p>
              </div>
              <div className="tl-item">
                <div className="tl-rail"><span className="tl-dot open" /></div>
                <p>Out for delivery<small>Arriving in your chosen window</small></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const SERVICE_CARDS = [
  { img: "/images/fold.jpg", alt: "Stacks of freshly folded shirts", title: "Wash & Fold", text: "Everyday clothes washed, dried and neatly folded — sorted by colour and fabric." },
  { img: "/images/dry.jpg", alt: "Pressed dress shirts on hangers", title: "Dry Cleaning", text: "Suits, native wear, dresses and delicates cleaned gently and returned on hangers." },
  { img: "/images/iron.jpg", alt: "Steam iron on an ironing board", title: "Ironing & Pressing", text: "Crisp shirts, sharp trousers and wrinkle-free outfits, ready for the week ahead." },
  { img: "/images/bed.jpg", alt: "Laundry basket full of household linens", title: "Bedding & Household", text: "Duvets, sheets, curtains and towels — the bulky loads your machine can't handle." },
];

export function Services() {
  return (
    <section id="services" className="section section-white">
      <div className="container">
        <div className="section-head">
          <div className="stack">
            <div className="eyebrow">Our services</div>
            <h2 className="h2">Everything your wardrobe needs, under one roof.</h2>
          </div>
          <p>Laundry, dry cleaning and ironing in Lagos — from everyday wash &amp; fold to delicate fabrics, every order is handled by people who take fabric seriously.</p>
        </div>
        <div className="cards">
          {SERVICE_CARDS.map((s) => (
            <article key={s.title} className="service-card">
              <Image src={s.img} alt={s.alt} width={779} height={519} sizes="(max-width: 600px) 100vw, 300px" />
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    { n: "01", t: "Schedule a pickup", d: "Choose your services, a date and a one-hour pickup window between 10 AM and 6 PM." },
    { n: "02", t: "We collect & clean", d: "We pick up from your door, send you a message with your order details, then clean every item with care." },
    { n: "03", t: "Delivered in 3–4 days", d: "Your clothes come back folded, pressed or on hangers — fresh and ready to wear." },
  ];
  return (
    <section id="how" className="how">
      <div className="container">
        <div className="how-head">
          <div className="eyebrow">How it works</div>
          <h2 className="h2">Three steps. Zero laundry days.</h2>
        </div>
        <div className="cards">
          {steps.map((s) => (
            <div key={s.n} className="step-card">
              <span className="step-num">{s.n}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="about" className="section section-white">
      <div className="container about-grid">
        <Image
          className="about-photo"
          src="/images/about.jpg"
          alt="Inside a clean, bright laundry with rows of washing machines"
          width={800}
          height={532}
          sizes="(max-width: 900px) 100vw, 560px"
        />
        <div className="about-copy">
          <div className="eyebrow">About us</div>
          <h2 className="h2">Your time is worth more than a laundry day.</h2>
          <p>
            Paramount Laundry gives you a smooth, reliable way to handle your laundry without the stress. We&apos;re
            built for people with busy schedules who still want their clothes properly cleaned and well taken care of.
          </p>
          <p>
            From our base in Alimosho, we pick up across Lagos Mainland and the Island. Book online, we collect, and
            your clothes come back fresh, clean and ready to wear — so you can focus on more important things.
          </p>
          <div className="values">
            <div className="value"><b>Real care</b><span>Sorted by fabric, colour and care label.</span></div>
            <div className="value"><b>On time</b><span>Pickups in the hour you choose.</span></div>
            <div className="value"><b>Trusted pickup</b><span>Your clothes are in safe hands, door to door.</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Cta() {
  return (
    <section style={{ padding: "96px 24px" }}>
      <div className="cta-band">
        <div className="stack" style={{ maxWidth: 640, gap: 14 }}>
          <h2>Clean clothes. Free time. Zero stress.</h2>
          <p>Book a pickup today — we&apos;ll take care of the rest.</p>
        </div>
        <a href="#schedule" className="btn btn-white">
          Schedule a pickup <Arrow />
        </a>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand">
              <Logo />
              <span className="brand-name" style={{ color: "#fff" }}>Paramount Laundry</span>
            </div>
            <p>Pickup &amp; delivery laundry, dry cleaning and pressing across Lagos Mainland and the Island.</p>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <h4>Services</h4>
              <a href="#services">Wash &amp; Fold</a>
              <a href="#services">Dry Cleaning</a>
              <a href="#services">Ironing &amp; Pressing</a>
              <a href="#services">Bedding &amp; Household</a>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <a href="#about">About us</a>
              <a href="#how">How it works</a>
              <a href="#visit">Visit us</a>
              <a href="#faq">FAQ</a>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <a href={BUSINESS.phoneHref}>{BUSINESS.phoneDisplay}</a>
              <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
              <span>1 Baale Cres, Ikola Rd,<br />Alimosho, Lagos 102213</span>
              <span>{BUSINESS.hoursShort}<br />Sunday closed</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Paramount Laundry. All rights reserved.</span>
          <span>Clean clothes, delivered.</span>
        </div>
      </div>
    </footer>
  );
}

export function VisitCopy() {
  return (
    <div className="visit-copy">
      <div className="eyebrow">Visit us</div>
      <h2 className="h2">Prefer to drop off?</h2>
      <div className="visit-addr">
        <b>{BUSINESS.addressLine1}</b>
        <span>{BUSINESS.addressLine2}</span>
      </div>
      <div className="visit-contact">
        <a href={BUSINESS.phoneHref}>{BUSINESS.phoneDisplay}</a>
        <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
      </div>
      <div className="row-wrap">
        <a href={BUSINESS.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontSize: 16, padding: "14px 24px" }}>
          Get directions <ArrowUpRight />
        </a>
        <a href={BUSINESS.phoneHref} className="btn btn-ghost" style={{ fontSize: 16, padding: "14px 24px" }}>
          Call us
        </a>
      </div>
    </div>
  );
}
