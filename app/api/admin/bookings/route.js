import { isAdmin } from '@/lib/auth.js';
import { getBookings } from '@/lib/store/index.js';
import { isValidDate } from '@/lib/time.js';
import { json } from '@/lib/http.js';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  if (!isAdmin()) return json({ error: 'Unauthorized' }, 401);
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || '';
  if (date && !isValidDate(date)) return json({ error: 'Invalid date.' }, 400);
  try {
    const rows = await getBookings({
      date,
      doctor: searchParams.get('doctor') || '',
      status: searchParams.get('status') || '',
      q: searchParams.get('q') || '',
    });
    return json({ bookings: rows });
  } catch (e) {
    console.error(e);
    return json({ error: 'Could not load bookings.' }, 500);
  }
}
