import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth.js';
import LoginForm from '@/components/admin/LoginForm';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  if (isAdmin()) redirect('/admin');
  return (
    <div className="login-wrap">
      <LoginForm />
    </div>
  );
}
