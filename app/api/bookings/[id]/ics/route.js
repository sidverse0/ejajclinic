import { getBooking } from '@/lib/store/index.js';
import { clinic } from '@/data/clinic.js';
import { istToUtcCompact, timeToMinutes, minutesToTime } from '@/lib/time.js';

export const dynamic = 'force-dynamic';

const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

export async function GET(request, { params }) {
  const b = await getBooking(params.id);
  if (!b || b.status === 'cancelled') return new Response('Not found', { status: 404 });
  const end = minutesToTime(Math.min(timeToMinutes(b.time) + 15, 23 * 60 + 59));
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ejaz Clinic//Booking//EN',
    'BEGIN:VEVENT',
    `UID:${b.id}@ejazclinic`,
    `DTSTAMP:${istToUtcCompact(b.date, b.time)}`,
    `DTSTART:${istToUtcCompact(b.date, b.time)}`,
    `DTEND:${istToUtcCompact(b.date, end)}`,
    `SUMMARY:${esc(`Appointment with ${b.doctor_name}`)}`,
    `LOCATION:${esc(`${clinic.name}, ${clinic.address}`)}`,
    `DESCRIPTION:${esc(`Booking ID ${b.id}. Call ${clinic.phone} for any change.`)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return new Response(lines.join('\r\n'), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${b.id}.ics"`,
      'Cache-Control': 'no-store',
    },
  });
}
