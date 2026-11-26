import { booking } from '../data/booking.js';
import { doctorConfig, allSlotTimes } from './schedule.js';
import { addDays, isValidDate, istNow, timeLabel, timeToMinutes, weekdayOf } from './time.js';
import * as store from './store/index.js';

export async function getAvailability(slug, date) {
  const cfg = doctorConfig(slug);
  if (!cfg) return { error: 'Unknown doctor.' };
  const now = istNow();
  const last = addDays(now.date, booking.advanceDays - 1);
  if (!isValidDate(date) || date < now.date || date > last) return { error: 'That date is not available for booking.' };
  if (!cfg.days.includes(weekdayOf(date))) return { date, closed: true, slots: [] };

  const [taken, blocks] = await Promise.all([store.getTakenSlots(slug, date), store.getBlocks({ doctor: slug, date })]);
  const dayBlocked = blocks.some((b) => !b.time);
  const takenSet = new Set(taken);
  const blockedTimes = new Set(blocks.filter((b) => b.time).map((b) => b.time));

  const slots = allSlotTimes(cfg.sessions, booking.slotMinutes).map((time) => {
    let available = !dayBlocked && !takenSet.has(time) && !blockedTimes.has(time);
    if (date === now.date && timeToMinutes(time) < now.minutes + booking.minLeadMinutes) available = false;
    return { time, label: timeLabel(time), available };
  });
  return { date, closed: false, dayBlocked, slots };
}

export async function isSlotBookable(slug, date, time) {
  const r = await getAvailability(slug, date);
  if (r.error || r.closed) return false;
  const s = r.slots.find((x) => x.time === time);
  return !!(s && s.available);
}
