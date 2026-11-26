// Local file database for development. Data is saved in .data/db.json.
// Do NOT use on Vercel (its file system is read-only). Use the Supabase store in production.
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { SlotTakenError, isActive } from './common.js';

// On Vercel only /tmp is writable and it is NOT permanent (use Supabase for a real demo or production).
const FILE = process.env.VERCEL
  ? path.join(os.tmpdir(), 'ejaz-clinic-db.json')
  : path.join(process.cwd(), '.data', 'db.json');
let queue = Promise.resolve();

async function read() {
  try {
    const db = JSON.parse(await fs.readFile(FILE, 'utf8'));
    return { bookings: db.bookings || [], blocks: db.blocks || [], seq: db.seq || 0 };
  } catch (e) {
    return { bookings: [], blocks: [], seq: 0 };
  }
}

async function write(db) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(db, null, 2));
}

function withLock(fn) {
  const run = queue.then(() => fn());
  queue = run.catch(() => {});
  return run;
}

const sameSlot = (a, b) => a.doctor_slug === b.doctor_slug && a.date === b.date && a.time === b.time;

export async function getBookings({ date, doctor, status, q } = {}) {
  const { bookings } = await read();
  const needle = (q || '').trim().toLowerCase();
  return bookings
    .filter((b) => (!date || b.date === date) && (!doctor || b.doctor_slug === doctor) && (!status || b.status === status))
    .filter((b) => !needle || [b.patient_name, b.phone, b.id].some((v) => String(v).toLowerCase().includes(needle)))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}

export async function getBooking(id) {
  const { bookings } = await read();
  return bookings.find((b) => b.id === id) || null;
}

export async function getBookingByOrder(orderId) {
  const { bookings } = await read();
  return bookings.find((b) => b.order_id === orderId) || null;
}

export async function getTakenSlots(doctor, date) {
  const { bookings } = await read();
  return bookings.filter((b) => b.doctor_slug === doctor && b.date === date && isActive(b)).map((b) => b.time);
}

export function createBooking(booking) {
  return withLock(async () => {
    const db = await read();
    if (db.bookings.some((b) => isActive(b) && sameSlot(b, booking))) throw new SlotTakenError();
    db.bookings.push(booking);
    await write(db);
    return booking;
  });
}

export function updateBooking(id, patch) {
  return withLock(async () => {
    const db = await read();
    const i = db.bookings.findIndex((b) => b.id === id);
    if (i === -1) return null;
    const current = db.bookings[i];
    if (patch.status === 'confirmed' && current.status !== 'confirmed') {
      if (db.bookings.some((b) => b.id !== id && isActive(b) && sameSlot(b, current))) throw new SlotTakenError();
    }
    db.bookings[i] = { ...current, ...patch, updated_at: new Date().toISOString() };
    await write(db);
    return db.bookings[i];
  });
}

export async function getBlocks({ doctor, date, from } = {}) {
  const { blocks } = await read();
  return blocks
    .filter((b) => (!doctor || b.doctor_slug === doctor) && (!date || b.date === date) && (!from || b.date >= from))
    .sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')));
}

export function addBlock({ doctor_slug, date, time, reason }) {
  return withLock(async () => {
    const db = await read();
    db.seq += 1;
    const block = { id: db.seq, doctor_slug, date, time: time || null, reason: reason || null, created_at: new Date().toISOString() };
    db.blocks.push(block);
    await write(db);
    return block;
  });
}

export function removeBlock(id) {
  return withLock(async () => {
    const db = await read();
    db.blocks = db.blocks.filter((b) => String(b.id) !== String(id));
    await write(db);
    return true;
  });
}
