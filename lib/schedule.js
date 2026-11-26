import { doctors } from '../data/doctors.js';
import { booking } from '../data/booking.js';
import { minutesToTime, timeToMinutes } from './time.js';

const DAY = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };

// 'Tue, Thu, Sat' -> [2, 4, 6]   |   'Mon to Sat' -> [1, 2, 3, 4, 5, 6]
export function parseDays(text) {
  const t = String(text || '').toLowerCase();
  const num = (w) => DAY[w.trim().slice(0, 3)];
  if (t.includes(' to ')) {
    const [a, b] = t.split(' to ').map(num);
    if (a === undefined || b === undefined) return [];
    const out = [];
    let d = a;
    for (let i = 0; i < 7; i += 1) {
      out.push(d);
      if (d === b) break;
      d = (d + 1) % 7;
    }
    return out;
  }
  return t.split(',').map(num).filter((n) => n !== undefined);
}

export function doctorConfig(slug) {
  const d = doctors.find((x) => x.slug === slug);
  if (!d) return null;
  const o = booking.doctorOverrides[slug] || {};
  return {
    slug: d.slug,
    name: d.name,
    role: d.role,
    days: parseDays(d.days),
    fee: o.fee ?? booking.defaultFee,
    sessions: o.sessions || booking.sessions,
  };
}

export function allSlotTimes(sessions, step) {
  const out = [];
  for (const s of sessions) {
    for (let m = timeToMinutes(s.start); m + step <= timeToMinutes(s.end); m += step) out.push(minutesToTime(m));
  }
  return out;
}
