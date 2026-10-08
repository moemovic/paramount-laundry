# Paramount Laundry — website

Pickup & delivery laundry website for Paramount Laundry (Alimosho, Lagos), built with **Next.js 16 (App Router) + React 19 + TypeScript**.

- 3-step pickup booking: services → calendar date + one-hour window → contact details
- Every booking is **emailed to paramountlaundry0@gmail.com** (via [Resend](https://resend.com))
- Booked windows are **locked for everyone** (stored in Upstash Redis), so no two customers can book the same hour
- Rules enforced on the server too: Sundays closed, Thursdays from 10 AM, no past times, bookings up to 120 days ahead (Lagos time)
- Spam honeypot, input validation, SEO metadata and LocalBusiness structured data

## Deploy on Vercel (≈10 minutes)

1. **Import the repo** — vercel.com → *Add New → Project* → pick `moemovic/paramount-laundry` → *Deploy*.
   The site goes live immediately; bookings stay switched off (with a "please call us" message) until steps 2–3 are done.

2. **Booking storage (Upstash Redis)** — in the Vercel project: *Storage → Create Database / Browse Marketplace → Upstash for Redis* (free plan) → connect it to this project.
   This adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically.

3. **Email (Resend)**
   - Sign up at resend.com **using paramountlaundry0@gmail.com** (on the free plan without a domain, Resend only delivers to the address you signed up with).
   - Create an API key.
   - In Vercel: *Settings → Environment Variables* → add `RESEND_API_KEY` = your key.
   - Optional: `BOOKING_EMAIL_TO` (defaults to paramountlaundry0@gmail.com).

4. **Redeploy** (*Deployments → ⋯ → Redeploy*) so the new variables take effect. Make a test booking — the email should arrive within seconds.

### Using your own domain (recommended later)
Add the domain in Vercel (*Settings → Domains*). Then verify the same domain in Resend and set
`BOOKING_EMAIL_FROM="Paramount Laundry <bookings@yourdomain.com>"` so emails come from your own address.

## Run locally

```bash
npm install
cp .env.example .env.local   # optional — without keys, bookings are kept in memory and emails are printed to the terminal
npm run dev                  # http://localhost:3000
```

## Where to change things

| What | File |
|---|---|
| Phone, email, address | `lib/business.ts` |
| Opening hours, pickup windows, how far ahead people can book | `lib/schedule.ts` |
| Page text and sections | `components/Sections.tsx`, `components/Interactive.tsx` (FAQ, hours) |
| Booking form | `components/Booking.tsx` |
| Booking email layout | `lib/email.ts` |
| Colours and styles | `app/globals.css` |
| Photos | `public/images/` |

Photos are from Unsplash (free for commercial use). Swap in your own shop and team photos in `public/images/` using the same file names.
