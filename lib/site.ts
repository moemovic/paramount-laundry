/** Canonical site address. The apex domain redirects to www in Vercel. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.paramountlaundry.co").replace(/\/$/, "");

export const SEO = {
  title: "Paramount Laundry | Laundry & Dry Cleaning Pickup and Delivery in Lagos",
  shortTitle: "Paramount Laundry",
  description:
    "Laundry and dry cleaning pickup & delivery in Lagos. Wash & fold, dry cleaning, ironing and duvet cleaning — collected from your door on the Mainland and the Island and returned in 3–4 days. Book online in a minute.",
  keywords: [
    "laundry service Lagos",
    "laundry pickup and delivery Lagos",
    "dry cleaning Lagos",
    "dry cleaners near me",
    "laundry near me",
    "wash and fold Lagos",
    "ironing service Lagos",
    "duvet cleaning Lagos",
    "laundry Alimosho",
    "laundry Ikeja",
    "laundry Lekki",
    "laundry Lagos Island",
    "Paramount Laundry",
  ],
};
