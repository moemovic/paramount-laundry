import type { Metadata, Viewport } from "next";
import "./globals.css";

const description =
  "Pickup & delivery laundry in Lagos. Wash & fold, dry cleaning, ironing and bedding — collected from your door on the Mainland and the Island and returned in 3–4 days.";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Paramount Laundry — Pickup & Delivery Laundry in Lagos",
  description,
  openGraph: {
    title: "Paramount Laundry — Pickup & Delivery Laundry in Lagos",
    description,
    images: ["/images/hero.jpg"],
    type: "website",
    locale: "en_NG",
  },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0D1B2A",
};

const localBusiness = {
  "@context": "https://schema.org",
  "@type": "DryCleaningOrLaundry",
  name: "Paramount Laundry",
  telephone: "+2347031365794",
  email: "paramountlaundry0@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "1 Baale Crescent, Ikola Road",
    addressLocality: "Alimosho",
    addressRegion: "Lagos",
    postalCode: "102213",
    addressCountry: "NG",
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Friday", "Saturday"], opens: "08:00", closes: "19:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Thursday", opens: "10:00", closes: "19:00" },
  ],
  areaServed: ["Lagos Mainland", "Lagos Island"],
  paymentAccepted: "Bank transfer, POS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
