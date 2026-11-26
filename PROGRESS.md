# Progress

## Phase 1: Structure and design (static)   STATUS: design v3 built (waiting for user review)
Done:
- [x] Project setup (Next.js 14, plain CSS, no Tailwind)
- [x] Original clinic logo (user's image) as transparent PNG pieces in public/images/site/logo-*.png, favicon app/icon.png; animated splash assembles it with the slogan. TODO: replace with the high-resolution/vector original
- [x] Intro splash animation (components/Splash.js), once per browser session
- [x] Bottom-sheet announcement with close button (components/Announcement.js, text in data/announcements.js)
- [x] Header (no top bar), mobile menu, scroll progress bar, back-to-top, mobile bottom action bar, WhatsApp button
- [x] Pages: Home, About, Doctors (+ profile), Specialities (+ page), Facilities, Gallery (lightbox), Contact (Health Blog removed)
- [x] Demo images for hero, about, 7 doctors, 12 specialities, 6 gallery (public/images)
- [x] Animations: hero entrance, floating cards, pulse line, marquee, counters, scroll reveal, hover effects
- [x] Responsive: PC, tablet, mobile; reduced-motion supported

To replace later (content, not code):
- [ ] Demo images -> real photos with the same file names, then set IMAGE_EXT in data/images.js
- [ ] Announcement text, gallery captions (data/*.js are all demo/sample)
- [ ] Confirm speciality summaries, doctor-to-speciality mapping, facilities list

## Phase 2: Functions   STATUS: built (waiting for local test by user)
- [x] Route groups: public site in app/(site), staff admin in app/admin (no site chrome)
- [x] Slot engine (lib/slots.js): doctor days from data/doctors.js, rules in data/booking.js, IST time, lead time, advance window
- [x] Database layer (lib/store): local file DB for development, Supabase for production (supabase/schema.sql)
- [x] Double-booking protection, 10 minute payment hold, refund-needed handling
- [x] /book page (doctor, date, time, details, payment) and /book/confirmation (+ .ics calendar file)
- [x] Razorpay: order creation, signature verification, webhook (lib/razorpay.js, app/api/payments)
- [x] Notifications: console / webhook / WhatsApp Cloud (lib/notify.js) + WhatsApp button in admin
- [x] Admin: login, bookings table, filters, status actions, leave/blocked slots, CSV export
- [x] Core logic tested with a script (booking, conflicts, holds, signatures, tokens)

To do by the user:
- [ ] Confirm real consultation fee and OPD sessions in data/booking.js
- [ ] Create Supabase project + run schema; Razorpay test keys; set env vars (see README)
- [ ] Test the full flow on localhost (book, pay in test mode, check /admin)

## Phase 3: Polish and final   STATUS: not started
- [ ] Animations/SVGs, speed, SEO (sitemap, schema), Hindi, analytics
- [ ] 301 redirects from old Wix URLs (e.g. /team/dr-shahzad-ali -> /doctors/dr-shahzad-ali)
- [ ] Security check, privacy policy

## Phase 4: Launch   STATUS: not started
- [ ] Private GitHub, host, domain ejazclinic.org, Cloudflare

Rule: update files in place, no duplicate copies. If work stops midway, check this file and the folder first, then continue.
