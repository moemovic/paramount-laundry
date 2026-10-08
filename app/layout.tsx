import type { Metadata, Viewport } from "next";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/bricolage-grotesque/500.css";
import "@fontsource/bricolage-grotesque/600.css";
import "@fontsource/bricolage-grotesque/700.css";
import "./globals.css";
import { BUSINESS, SERVICES } from "@/lib/business";
import { FAQS } from "@/lib/faqs";
import { SEO, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SEO.title, template: `%s | ${SEO.shortTitle}` },
  description: SEO.description,
  keywords: SEO.keywords,
  applicationName: SEO.shortTitle,
  alternates: { canonical: "/" },
  category: "Laundry service",
  openGraph: {
    type: "website",
    url: "/",
    siteName: SEO.shortTitle,
    title: SEO.title,
    description: SEO.description,
    locale: "en_NG",
  },
  twitter: { card: "summary_large_image", title: SEO.title, description: SEO.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  formatDetection: { telephone: true, address: true, email: true },
};

export const viewport: Viewport = {
  themeColor: "#0D1B2A",
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["DryCleaningOrLaundry", "LocalBusiness"],
      "@id": `${SITE_URL}/#business`,
      name: BUSINESS.name,
      description: SEO.description,
      url: SITE_URL,
      logo: `${SITE_URL}/brand/paramount-laundry-icon-512.png`,
      image: [`${SITE_URL}/images/hero.jpg`, `${SITE_URL}/images/about.jpg`],
      telephone: "+2347031365794",
      email: BUSINESS.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: "1 Baale Crescent, Ikola Road",
        addressLocality: "Alimosho",
        addressRegion: "Lagos",
        postalCode: "102213",
        addressCountry: "NG",
      },
      hasMap: BUSINESS.mapsUrl,
      openingHoursSpecification: [
        { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Friday", "Saturday"], opens: "08:00", closes: "19:00" },
        { "@type": "OpeningHoursSpecification", dayOfWeek: "Thursday", opens: "10:00", closes: "19:00" },
      ],
      areaServed: [
        { "@type": "City", name: "Lagos" },
        { "@type": "Place", name: "Lagos Mainland" },
        { "@type": "Place", name: "Lagos Island" },
      ],
      paymentAccepted: "Bank transfer, POS",
      currenciesAccepted: "NGN",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Laundry services",
        itemListElement: SERVICES.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: s.label, description: s.desc, areaServed: "Lagos" },
        })),
      },
      potentialAction: {
        "@type": "ReserveAction",
        name: "Schedule a laundry pickup",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/#schedule` },
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: BUSINESS.name,
      publisher: { "@id": `${SITE_URL}/#business` },
      inLanguage: "en-NG",
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
