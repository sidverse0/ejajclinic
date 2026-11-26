import crypto from 'crypto';
import { booking as rules } from '../data/booking.js';
import { doctorConfig } from './schedule.js';
import { isSlotBookable } from './slots.js';
import * as store from './store/index.js';
import * as razorpay from './razorpay.js';
import { notifyConfirmed, notifyStaff } from './notify.js';

export const SlotTakenError = store.SlotTakenError;
export class PaymentSetupError extends Error {}
export class UnknownDoctorError extends Error {}

const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export function newBookingId() {
  let s = '';
  for (let i = 0; i < 6; i += 1) s += ALPHABET[crypto.randomInt(0, ALPHABET.length)];
  return `EJ-${s}`;
}

// `input` must already be validated (see lib/validate.js).
export async function createBooking(input) {
  const cfg = doctorConfig(input.doctorSlug);
  if (!cfg) throw new UnknownDoctorError();
  if (!(await isSlotBookable(cfg.slug, input.date, input.time))) throw new SlotTakenError();

  const online = input.paymentMode === 'online' && razorpay.isEnabled();
  const now = new Date();
  const record = {
    id: newBookingId(),
    doctor_slug: cfg.slug,
    doctor_name: cfg.name,
    date: input.date,
    time: input.time,
    patient_name: input.name,
    phone: input.phone,
    email: input.email || null,
    notes: input.notes || null,
    status: online ? 'pending_payment' : 'confirmed',
    payment_mode: online ? 'online' : 'clinic',
    payment_status: 'unpaid',
    amount: cfg.fee,
    order_id: null,
    payment_id: null,
    hold_expires_at: online ? new Date(now.getTime() + rules.holdMinutes * 60000).toISOString() : null,
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
  };

  const saved = await store.createBooking(record);

  if (!online) {
    await notifyConfirmed(saved);
    return { booking: saved, payment: null };
  }
  try {
    const order = await razorpay.createOrder({
      amountPaise: cfg.fee * 100,
      receipt: saved.id,
      notes: { bookingId: saved.id },
    });
    const updated = await store.updateBooking(saved.id, { order_id: order.id });
    return {
      booking: updated || { ...saved, order_id: order.id },
      payment: { keyId: razorpay.keyId(), orderId: order.id, amount: order.amount, currency: order.currency },
    };
  } catch (e) {
    console.error(e);
    await store.updateBooking(saved.id, { status: 'cancelled', hold_expires_at: null });
    throw new PaymentSetupError();
  }
}

// Called after a verified payment (checkout verify route or Razorpay webhook). Safe to call twice.
export async function markPaid(bookingId, { orderId, paymentId }) {
  const b = await store.getBooking(bookingId);
  if (!b || (orderId && b.order_id !== orderId)) return null;
  if (b.payment_status === 'paid') return b;
  try {
    const updated = await store.updateBooking(b.id, {
      status: 'confirmed',
      payment_status: 'paid',
      payment_id: paymentId || null,
      hold_expires_at: null,
    });
    await notifyConfirmed(updated);
    return updated;
  } catch (e) {
    if (!(e instanceof SlotTakenError)) throw e;
    // Paid after the hold expired and someone else took the slot: keep the money record, flag for a refund.
    const updated = await store.updateBooking(b.id, {
      status: 'refund_needed',
      payment_status: 'paid',
      payment_id: paymentId || null,
      hold_expires_at: null,
    });
    await notifyStaff(`Refund needed: ${b.id} (${b.patient_name}, ${b.phone}) paid but the slot was taken.`, b);
    return updated;
  }
}

export async function markPaymentFailed(orderId) {
  const b = await store.getBookingByOrder(orderId);
  if (b && b.payment_status === 'unpaid') return store.updateBooking(b.id, { payment_status: 'failed' });
  return b;
}
