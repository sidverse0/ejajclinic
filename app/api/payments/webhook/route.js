import { markPaid, markPaymentFailed } from '@/lib/bookings.js';
import { getBookingByOrder } from '@/lib/store/index.js';
import { verifyWebhook } from '@/lib/razorpay.js';
import { json } from '@/lib/http.js';

export const dynamic = 'force-dynamic';

// Razorpay Dashboard > Webhooks: URL https://YOUR-DOMAIN/api/payments/webhook, events payment.captured, order.paid, payment.failed
export async function POST(request) {
  const raw = await request.text(); // the signature is computed on the exact raw body
  if (!verifyWebhook(raw, request.headers.get('x-razorpay-signature'))) return json({ error: 'Invalid signature.' }, 400);

  let event;
  try {
    event = JSON.parse(raw);
  } catch (e) {
    return json({ error: 'Invalid body.' }, 400);
  }
  const payment = event.payload && event.payload.payment && event.payload.payment.entity;
  const orderId = (payment && payment.order_id) || (event.payload && event.payload.order && event.payload.order.entity.id);

  try {
    if (orderId && (event.event === 'payment.captured' || event.event === 'order.paid')) {
      const b = await getBookingByOrder(orderId);
      if (b) await markPaid(b.id, { orderId, paymentId: payment && payment.id });
    } else if (orderId && event.event === 'payment.failed') {
      await markPaymentFailed(orderId);
    }
  } catch (e) {
    console.error(e);
    return json({ error: 'Processing failed.' }, 500); // non-2xx makes Razorpay retry later
  }
  return json({ ok: true });
}
