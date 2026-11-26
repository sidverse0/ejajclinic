import { createBooking, SlotTakenError, PaymentSetupError, UnknownDoctorError } from '@/lib/bookings.js';
import { validateBookingInput } from '@/lib/validate.js';
import { rateLimit } from '@/lib/rateLimit.js';
import { json, clientIp } from '@/lib/http.js';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  if (!rateLimit(`book:${clientIp(request)}`, 8, 10 * 60 * 1000)) {
    return json({ error: 'Too many attempts. Please try again in a few minutes.' }, 429);
  }
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ error: 'Invalid request.' }, 400);
  }
  if (body && body.website) return json({ error: 'Invalid request.' }, 400); // honeypot field, humans never fill it

  const v = validateBookingInput(body);
  if (!v.ok) return json({ error: v.errors[0], errors: v.errors }, 400);

  try {
    return json(await createBooking(v.value), 201);
  } catch (e) {
    if (e instanceof SlotTakenError) return json({ error: 'Sorry, that slot was just taken. Please choose another time.' }, 409);
    if (e instanceof UnknownDoctorError) return json({ error: 'Please choose a doctor.' }, 400);
    if (e instanceof PaymentSetupError) return json({ error: 'Online payment is not available right now. Please choose pay at clinic.' }, 502);
    console.error(e);
    return json({ error: 'Something went wrong. Please call the clinic to book.' }, 500);
  }
}
