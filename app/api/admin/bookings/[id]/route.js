import { isAdmin } from '@/lib/auth.js';
import { updateBooking, SlotTakenError } from '@/lib/store/index.js';
import { json } from '@/lib/http.js';

export const dynamic = 'force-dynamic';

const STATUSES = ['confirmed', 'completed', 'cancelled', 'no_show', 'refund_needed'];
const PAYMENTS = ['unpaid', 'paid', 'refunded'];

export async function PATCH(request, { params }) {
  if (!isAdmin()) return json({ error: 'Unauthorized' }, 401);
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ error: 'Invalid request.' }, 400);
  }
  const patch = {};
  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status)) return json({ error: 'Invalid status.' }, 400);
    patch.status = body.status;
    if (body.status !== 'confirmed') patch.hold_expires_at = null;
  }
  if (body.payment_status !== undefined) {
    if (!PAYMENTS.includes(body.payment_status)) return json({ error: 'Invalid payment status.' }, 400);
    patch.payment_status = body.payment_status;
  }
  if (!Object.keys(patch).length) return json({ error: 'Nothing to update.' }, 400);
  try {
    const updated = await updateBooking(params.id, patch);
    if (!updated) return json({ error: 'Booking not found.' }, 404);
    return json({ booking: updated });
  } catch (e) {
    if (e instanceof SlotTakenError) return json({ error: 'That slot is already booked by someone else.' }, 409);
    console.error(e);
    return json({ error: 'Could not update the booking.' }, 500);
  }
}
