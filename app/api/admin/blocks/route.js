import { isAdmin } from '@/lib/auth.js';
import { getBlocks, addBlock, removeBlock } from '@/lib/store/index.js';
import { doctorConfig } from '@/lib/schedule.js';
import { isValidDate, istNow } from '@/lib/time.js';
import { json } from '@/lib/http.js';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isAdmin()) return json({ error: 'Unauthorized' }, 401);
  try {
    return json({ blocks: await getBlocks({ from: istNow().date }) });
  } catch (e) {
    console.error(e);
    return json({ error: 'Could not load blocked slots.' }, 500);
  }
}

export async function POST(request) {
  if (!isAdmin()) return json({ error: 'Unauthorized' }, 401);
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ error: 'Invalid request.' }, 400);
  }
  const time = body.time ? String(body.time) : null;
  if (!doctorConfig(String(body.doctorSlug || ''))) return json({ error: 'Choose a doctor.' }, 400);
  if (!isValidDate(String(body.date || ''))) return json({ error: 'Choose a date.' }, 400);
  if (time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return json({ error: 'Invalid time.' }, 400);
  try {
    const block = await addBlock({
      doctor_slug: body.doctorSlug,
      date: body.date,
      time,
      reason: String(body.reason || '').slice(0, 120),
    });
    return json({ block }, 201);
  } catch (e) {
    console.error(e);
    return json({ error: 'Could not save.' }, 500);
  }
}

export async function DELETE(request) {
  if (!isAdmin()) return json({ error: 'Unauthorized' }, 401);
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return json({ error: 'Missing id.' }, 400);
  try {
    await removeBlock(id);
    return json({ ok: true });
  } catch (e) {
    console.error(e);
    return json({ error: 'Could not remove.' }, 500);
  }
}
