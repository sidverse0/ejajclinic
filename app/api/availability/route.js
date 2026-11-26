import { getAvailability } from '@/lib/slots.js';
import { json } from '@/lib/http.js';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  try {
    const result = await getAvailability(searchParams.get('doctor') || '', searchParams.get('date') || '');
    if (result.error) return json({ error: result.error }, 400);
    return json(result);
  } catch (e) {
    console.error(e);
    return json({ error: 'Could not load time slots. Please try again.' }, 500);
  }
}
