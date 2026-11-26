'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Could not sign in.');
        setBusy(false);
        return;
      }
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError('Network problem. Please try again.');
      setBusy(false);
    }
  }

  return (
    <form className="login-card form" onSubmit={submit}>
      <Logo size={56} />
      <h1>Staff login</h1>
      <p>Ejaz Clinic appointments</p>
      <div className="field">
        <label htmlFor="pw">Password</label>
        <input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" autoFocus />
      </div>
      {error && <p role="alert" className="book-error">{error}</p>}
      <button className="btn btn-primary btn-lg" type="submit" disabled={busy || !password}>{busy ? 'Signing in...' : 'Sign in'}</button>
    </form>
  );
}
