# Ejaz Clinic website (Next.js 14, App Router)

## Run on your computer
1. Install Node.js 18.17 or newer.
2. In this folder: `npm install`
3. `npm run dev`, then open http://localhost:3000
4. Production test: `npm run build` then `npm start`

No extra setup is needed to try booking: copy `.env.local.example` to `.env.local`, set `ADMIN_PASSWORD`, restart,
and open http://localhost:3000/book. Bookings are saved in `.data/db.json` (created automatically, git-ignored).
Staff panel: http://localhost:3000/admin.

## Where to edit
- Clinic details, phone, address: `data/clinic.js`
- Doctors: `data/doctors.js` (the `days` text also decides which days can be booked)
- Booking rules (fee, slot length, hours, how many days ahead): `data/booking.js`
- Announcement popup: `data/announcements.js`
- Images: `public/images` (see the note at the top of `data/images.js`)
- Colors and styles: `app/globals.css`

## How booking works
1. Patient picks a doctor, date and time on /book. Only free slots can be chosen.
2. "Pay at clinic": the slot is confirmed immediately.
   "Pay now" (only when Razorpay keys are set): the slot is held for `holdMinutes`, Razorpay Checkout opens,
   the server verifies the payment signature, and the booking is confirmed. The Razorpay webhook is a safety net
   that confirms the booking even if the patient closes the browser after paying.
3. If someone pays after their hold expired and the slot was taken, the booking is marked "Refund needed" in /admin.
4. Staff manage everything in /admin: mark completed / no show / paid, cancel, block a doctor's leave, export CSV,
   and send a WhatsApp message to the patient with one tap.

## Going live (production)
1. **Database**: create a free project at supabase.com, run `supabase/schema.sql` in its SQL Editor, then set
   `STORE=supabase`, `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` (service_role key) in your host's environment variables.
   The file database does NOT work on Vercel.
2. **Admin**: set `ADMIN_PASSWORD` and a long random `SESSION_SECRET`.
3. **Razorpay** (optional): create keys in the Razorpay dashboard (test mode first). Set `RAZORPAY_KEY_ID` and
   `RAZORPAY_KEY_SECRET`. Add a webhook to `https://YOUR-DOMAIN/api/payments/webhook` for the events
   `payment.captured`, `order.paid` and `payment.failed`, with a secret you choose, and put it in `RAZORPAY_WEBHOOK_SECRET`.
4. **Messages** (optional): `NOTIFY_PROVIDER=webhook` posts JSON to any automation (n8n, Zapier, an SMS provider flow).
   `NOTIFY_PROVIDER=whatsapp` uses the Meta WhatsApp Cloud API; plain text only reaches people who messaged you in the
   last 24 hours, so for real confirmations you need an approved message template (change `lib/notify.js` for that).
   Without any provider, messages are printed in the server log and staff can use the WhatsApp button in /admin.

## Show it to the manager (demo on your own domain, GitHub + Vercel)
Use a SUBDOMAIN such as `demo.yourdomain.com`. Do not point the main domain of a live site to Vercel.
1. **GitHub**: create a new PRIVATE repository, then in this folder run
   `git init`, `git add .`, `git commit -m "Ejaz Clinic website"`, `git branch -M main`,
   `git remote add origin https://github.com/YOUR-USERNAME/ejaz-clinic.git`, `git push -u origin main`.
2. **Supabase** (free, needed so bookings are really saved on Vercel): create a project, open SQL Editor, run
   `supabase/schema.sql`. Copy the Project URL and the `service_role` key (Project Settings > API).
3. **Vercel**: Add New > Project > import the GitHub repo (Framework: Next.js, nothing to change). Before pressing Deploy,
   add Environment Variables: `STORE=supabase`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `ADMIN_PASSWORD`, `SESSION_SECRET`,
   `SITE_NOINDEX=1`, and optionally Razorpay TEST keys (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`). Deploy.
   You get a link like `ejaz-clinic.vercel.app`. After changing variables, use Deployments > Redeploy.
4. **Your domain (Hostinger)**: in Vercel open Project > Settings > Domains > add `demo.yourdomain.com`. Vercel shows a CNAME
   value. In Hostinger hPanel > Domains > DNS / Nameservers > DNS records, add a CNAME record: name `demo`, target = the value
   Vercel shows. Wait 5 to 30 minutes; Vercel turns the domain green and adds HTTPS automatically.
5. Every `git push` to `main` updates the site automatically.
Vercel's free Hobby plan is meant for non-commercial use, which is fine for a demo. For the live clinic site check Vercel's
current terms (Pro plan) or use another host.

Progress and next steps are tracked in `PROGRESS.md`.
