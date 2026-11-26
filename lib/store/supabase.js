// Production database: Supabase (Postgres) through its REST API. Run supabase/schema.sql once to create the tables.
import { SlotTakenError } from './common.js';

// Accepts https://xxxx.supabase.co, with or without a trailing slash or /rest/v1/.
const url = () =>
  `${String(process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '').replace(/\/rest\/v1$/, '')}/rest/v1`;
const key = () => String(process.env.SUPABASE_SERVICE_KEY || '').trim();

async function sb(path, { method = 'GET', body, prefer } = {}) {
  const k = key();
  const res = await fetch(`${url()}/${path}`, {
    method,
    headers: {
      apikey: k,
      // Legacy service_role keys are JWTs and go in Authorization too. New sb_secret_ keys are not JWTs: apikey only.
      ...(k.startsWith('sb_') ? {} : { Authorization: `Bearer ${k}` }),
      'Content-Type': 'application/json',
      ...(prefer ? { Prefer: prefer } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
  const text = await res.text();
  if (!res.ok) {
    let code = '';
    try { code = JSON.parse(text).code; } catch (e) { /* not json */ }
    const err = new Error(`Supabase ${res.status}: ${text}`);
    err.code = code;
    throw err;
  }
  return text ? JSON.parse(text) : null;
}

const enc = encodeURIComponent;
const clean = (s) => String(s || '').replace(/[(),*%\\]/g, ' ').trim();

const activeFilter = () =>
  enc(`(status.eq.confirmed,and(status.eq.pending_payment,hold_expires_at.gt.${new Date().toISOString()}))`);

export async function getBookings({ date, doctor, status, q } = {}) {
  let p = 'bookings?select=*&order=date.asc,time.asc';
  if (date) p += `&date=eq.${enc(date)}`;
  if (doctor) p += `&doctor_slug=eq.${enc(doctor)}`;
  if (status) p += `&status=eq.${enc(status)}`;
  const needle = clean(q);
  if (needle) p += `&or=${enc(`(patient_name.ilike.*${needle}*,phone.ilike.*${needle}*,id.ilike.*${needle}*)`)}`;
  return (await sb(p)) || [];
}

export async function getBooking(id) {
  const rows = await sb(`bookings?id=eq.${enc(id)}&select=*`);
  return rows && rows[0] ? rows[0] : null;
}

export async function getBookingByOrder(orderId) {
  const rows = await sb(`bookings?order_id=eq.${enc(orderId)}&select=*`);
  return rows && rows[0] ? rows[0] : null;
}

export async function getTakenSlots(doctor, date) {
  const rows = await sb(`bookings?doctor_slug=eq.${enc(doctor)}&date=eq.${enc(date)}&or=${activeFilter()}&select=time`);
  return (rows || []).map((r) => r.time);
}

export async function createBooking(booking) {
  const taken = await getTakenSlots(booking.doctor_slug, booking.date);
  if (taken.includes(booking.time)) throw new SlotTakenError();
  try {
    const rows = await sb('bookings', { method: 'POST', body: booking, prefer: 'return=representation' });
    return rows[0];
  } catch (e) {
    if (e.code === '23505') throw new SlotTakenError();
    throw e;
  }
}

export async function updateBooking(id, patch) {
  try {
    const rows = await sb(`bookings?id=eq.${enc(id)}`, {
      method: 'PATCH',
      body: { ...patch, updated_at: new Date().toISOString() },
      prefer: 'return=representation',
    });
    return rows && rows[0] ? rows[0] : null;
  } catch (e) {
    if (e.code === '23505') throw new SlotTakenError();
    throw e;
  }
}

export async function getBlocks({ doctor, date, from } = {}) {
  let p = 'blocks?select=*&order=date.asc,time.asc';
  if (doctor) p += `&doctor_slug=eq.${enc(doctor)}`;
  if (date) p += `&date=eq.${enc(date)}`;
  if (from) p += `&date=gte.${enc(from)}`;
  return (await sb(p)) || [];
}

export async function addBlock({ doctor_slug, date, time, reason }) {
  const rows = await sb('blocks', {
    method: 'POST',
    body: { doctor_slug, date, time: time || null, reason: reason || null },
    prefer: 'return=representation',
  });
  return rows[0];
}

export async function removeBlock(id) {
  await sb(`blocks?id=eq.${enc(id)}`, { method: 'DELETE' });
  return true;
}
