import { isValidDate } from './time.js';

export function normalizePhone(raw) {
  let d = String(raw || '').replace(/\D/g, '');
  if (d.length === 12 && d.startsWith('91')) d = d.slice(2);
  if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? d : null;
}

export function validateBookingInput(b = {}) {
  const errors = [];
  const name = String(b.name || '').trim().replace(/\s+/g, ' ');
  if (name.length < 2 || name.length > 80) errors.push('Please enter your full name.');
  const phone = normalizePhone(b.phone);
  if (!phone) errors.push('Please enter a valid 10-digit mobile number.');
  const email = String(b.email || '').trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Please enter a valid email, or leave it empty.');
  const notes = String(b.notes || '').trim().slice(0, 300);
  const doctorSlug = String(b.doctorSlug || '');
  const date = String(b.date || '');
  const time = String(b.time || '');
  if (!doctorSlug) errors.push('Please choose a doctor.');
  if (!isValidDate(date)) errors.push('Please choose a date.');
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) errors.push('Please choose a time slot.');
  const paymentMode = b.paymentMode === 'online' ? 'online' : 'clinic';
  return { ok: errors.length === 0, errors, value: { name, phone, email, notes, doctorSlug, date, time, paymentMode } };
}
