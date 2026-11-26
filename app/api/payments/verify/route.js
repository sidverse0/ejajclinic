import { markPaid } from '@/lib/bookings.js';
import { verifySignature } from '@/lib/razorpay.js';
import { rateLimit } from '@/lib/rateLimit.js';
import { json, clientIp } from '@/lib/http.js';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  if (!rateLimit(`verify:${clientIp(request)}`, 20, 10 * 60 * 1000)) return json({ error: 'Too many attempts.' }, 429);
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ error: 'Invalid request.' }, 400);
  }
  const { bookingId, razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = body || {};
  if (!verifySignature(orderId, paymentId, signature)) return json({ error: 'Payment could not be verified.' }, 400);
  try {
    const b = await markPaid(String(bookingId || ''), { orderId, paymentId });
    if (!b) return json({ error: 'Booking not found.' }, 404);
    return json({ ok: true, status: b.status, id: b.id });
  } catch (e) {
    console.error(e);
    return json({ error: 'Could not update the booking.' }, 500);
  }
}
