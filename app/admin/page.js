import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth.js';
import { doctors } from '@/data/doctors';
import { istNow } from '@/lib/time.js';
import AdminDashboard from '@/components/admin/AdminDashboard';

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  if (!isAdmin()) redirect('/admin/login');
  return (
    <AdminDashboard
      doctors={doctors.map((d) => ({ slug: d.slug, name: d.name }))}
      today={istNow().date}
    />
  );
}
