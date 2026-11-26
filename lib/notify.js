import { clinic } from '../data/clinic.js';
import { dateLabel, timeLabel } from './time.js';

// NOTIFY_PROVIDER = console (default) | webhook | whatsapp
export function patientMessage(b) {
  const state = b.status === 'confirmed' ? 'confirmed' : 'received';
  return (
    `${clinic.name}: your appointment is ${state}. Doctor: ${b.doctor_name}. ` +
    `Date: ${dateLabel(b.date)} at ${timeLabel(b.time)}. Booking ID: ${b.id}. ` +
    `${clinic.address}. For any change call ${clinic.phone}.`
  );
}

export function staffMessage(b) {
  return (
    `New booking ${b.id}: ${b.patient_name} (${b.phone}) with ${b.doctor_name}, ` +
    `${dateLabel(b.date)} ${timeLabel(b.time)}. Payment: ${b.payment_mode}, ${b.payment_status}.`
  );
}

async function deliver(to, text, booking) {
  const provider = process.env.NOTIFY_PROVIDER || 'console';
  if (provider === 'webhook' && process.env.NOTIFY_WEBHOOK_URL) {
    const res = await fetch(process.env.NOTIFY_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, text, bookingId: booking.id }),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    return;
  }
  if (provider === 'whatsapp' && process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_ID) {
    // WhatsApp Cloud API. Free-form text only reaches people who messaged you in the last 24 hours;
    // for everyone else you need an approved message template (see README).
    const version = process.env.WHATSAPP_API_VERSION || 'v20.0';
    const res = await fetch(`https://graph.facebook.com/${version}/${process.env.WHATSAPP_PHONE_ID}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ messaging_product: 'whatsapp', to, type: 'text', text: { body: text } }),
    });
    if (!res.ok) throw new Error(`WhatsApp API responded ${res.status}`);
    return;
  }
  console.log(`[notify:console] to ${to}: ${text}`);
}

// Never throws: a failed message must not break a booking.
export async function notifyConfirmed(b) {
  try {
    await deliver(`91${b.phone}`, patientMessage(b), b);
    if (process.env.NOTIFY_STAFF_PHONE) await deliver(process.env.NOTIFY_STAFF_PHONE, staffMessage(b), b);
  } catch (e) {
    console.error('Notification failed:', e.message);
  }
}

export async function notifyStaff(text, b) {
  try {
    if (process.env.NOTIFY_STAFF_PHONE) await deliver(process.env.NOTIFY_STAFF_PHONE, text, b);
    else console.log(`[notify:staff] ${text}`);
  } catch (e) {
    console.error('Staff notification failed:', e.message);
  }
}
