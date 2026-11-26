'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { dateLabel, timeLabel } from '@/lib/time.js';

const STATUS_LABEL = {
  confirmed: 'Confirmed',
  pending_payment: 'Awaiting payment',
  completed: 'Completed',
  cancelled: 'Cancelled',
  no_show: 'No show',
  refund_needed: 'Refund needed',
};

const csvCell = (v) => {
  let s = String(v ?? '');
  if (/^[=+\-@]/.test(s)) s = `'${s}`; // stop spreadsheet formula injection
  return `"${s.replace(/"/g, '""')}"`;
};

export default function AdminDashboard({ doctors, today }) {
  const router = useRouter();
  const [tab, setTab] = useState('bookings');
  const [filters, setFilters] = useState({ date: today, doctor: '', status: '', q: '' });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [blocks, setBlocks] = useState([]);
  const [blockForm, setBlockForm] = useState({ doctorSlug: '', date: today, time: '', reason: '' });
  const [notice, setNotice] = useState('');

  const unauthorized = useCallback(() => router.push('/admin/login'), [router]);

  const loadRows = useCallback(async () => {
    const qs = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) qs.set(k, v); });
    try {
      const res = await fetch(`/api/admin/bookings?${qs}`);
      if (res.status === 401) return unauthorized();
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRows(data.bookings);
      setError('');
    } catch (e) {
      setError(e.message || 'Could not load bookings.');
    }
    setLoading(false);
    return undefined;
  }, [filters, unauthorized]);

  const loadBlocks = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/blocks');
      if (res.status === 401) return unauthorized();
      const data = await res.json();
      if (res.ok) setBlocks(data.blocks);
    } catch (e) { /* ignore */ }
    return undefined;
  }, [unauthorized]);

  useEffect(() => {
    loadRows();
    const t = setInterval(loadRows, 30000); // refresh every 30 seconds
    return () => clearInterval(t);
  }, [loadRows]);

  useEffect(() => { loadBlocks(); }, [loadBlocks]);

  const setF = (k) => (e) => setFilters((f) => ({ ...f, [k]: e.target.value }));
  const flash = (msg) => { setNotice(msg); setTimeout(() => setNotice(''), 3500); };

  async function patch(b, body, confirmText) {
    if (confirmText && !window.confirm(confirmText)) return;
    const res = await fetch(`/api/admin/bookings/${b.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) return unauthorized();
    if (!res.ok) return flash(data.error || 'Update failed.');
    flash(`${b.id} updated.`);
    return loadRows();
  }

  async function addBlock(e) {
    e.preventDefault();
    const res = await fetch('/api/admin/blocks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(blockForm) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return flash(data.error || 'Could not save.');
    flash('Saved.');
    setBlockForm((f) => ({ ...f, time: '', reason: '' }));
    return loadBlocks();
  }

  async function removeBlock(id) {
    await fetch(`/api/admin/blocks?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    loadBlocks();
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  function exportCsv() {
    const head = ['Booking ID', 'Date', 'Time', 'Doctor', 'Patient', 'Phone', 'Status', 'Payment', 'Amount', 'Notes'];
    const lines = rows.map((b) => [b.id, b.date, b.time, b.doctor_name, b.patient_name, b.phone, b.status, b.payment_status, b.amount, b.notes].map(csvCell).join(','));
    const blob = new Blob([[head.map(csvCell).join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `bookings-${filters.date || 'all'}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const count = (s) => rows.filter((b) => b.status === s).length;
  const paidTotal = rows.filter((b) => b.payment_status === 'paid').reduce((n, b) => n + (b.amount || 0), 0);
  const doctorName = (slug) => (doctors.find((d) => d.slug === slug) || {}).name || slug;

  return (
    <div className="adm">
      <header className="adm-top">
        <span className="adm-brand"><Logo size={34} /> <strong>Ejaz Clinic</strong> <small>Staff</small></span>
        <nav className="adm-tabs" aria-label="Admin sections">
          <button type="button" className={tab === 'bookings' ? 'on' : ''} onClick={() => setTab('bookings')}>Bookings</button>
          <button type="button" className={tab === 'blocks' ? 'on' : ''} onClick={() => setTab('blocks')}>Leave and blocked slots</button>
        </nav>
        <button type="button" className="btn btn-ghost" onClick={logout}>Log out</button>
      </header>

      {notice && <div className="adm-toast" role="status">{notice}</div>}

      {tab === 'bookings' && (
        <section>
          <div className="adm-stats">
            <div><strong>{rows.length}</strong><span>Bookings shown</span></div>
            <div><strong>{count('confirmed')}</strong><span>Confirmed</span></div>
            <div><strong>{count('completed')}</strong><span>Completed</span></div>
            <div><strong>{count('pending_payment')}</strong><span>Awaiting payment</span></div>
            <div><strong>{`\u20B9${paidTotal}`}</strong><span>Paid online</span></div>
          </div>

          <div className="adm-filters">
            <label>Date<input type="date" value={filters.date} onChange={setF('date')} /></label>
            <label>Doctor
              <select value={filters.doctor} onChange={setF('doctor')}>
                <option value="">All doctors</option>
                {doctors.map((d) => <option key={d.slug} value={d.slug}>{d.name}</option>)}
              </select>
            </label>
            <label>Status
              <select value={filters.status} onChange={setF('status')}>
                <option value="">All</option>
                {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
            <label>Search<input type="search" placeholder="Name, phone or ID" value={filters.q} onChange={setF('q')} /></label>
            <button type="button" className="btn btn-ghost" onClick={() => setFilters((f) => ({ ...f, date: '' }))}>All dates</button>
            <button type="button" className="btn btn-ghost" onClick={exportCsv} disabled={!rows.length}>Export CSV</button>
          </div>

          {error && <p className="book-error" role="alert">{error}</p>}
          {loading ? <p>Loading...</p> : rows.length === 0 ? <p className="adm-empty">No bookings for these filters.</p> : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr><th>When</th><th>Patient</th><th>Doctor</th><th>Status</th><th>Payment</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {rows.map((b) => (
                    <tr key={b.id}>
                      <td><strong>{timeLabel(b.time)}</strong><br /><small>{dateLabel(b.date)}</small><br /><small>{b.id}</small></td>
                      <td>
                        {b.patient_name}<br />
                        <a href={`tel:+91${b.phone}`}>{b.phone}</a>
                        {b.notes && <><br /><small className="adm-note">{b.notes}</small></>}
                      </td>
                      <td>{doctorName(b.doctor_slug)}</td>
                      <td><span className={`badge s-${b.status}`}>{STATUS_LABEL[b.status] || b.status}</span></td>
                      <td>{b.payment_status === 'paid' ? `Paid \u20B9${b.amount}` : b.payment_status === 'refunded' ? 'Refunded' : b.payment_status === 'failed' ? 'Failed' : `Unpaid \u20B9${b.amount}`}<br /><small>{b.payment_mode === 'online' ? 'Online' : 'At clinic'}</small></td>
                      <td>
                        <div className="adm-actions">
                          {b.status === 'confirmed' && <button type="button" onClick={() => patch(b, { status: 'completed' })}>Completed</button>}
                          {b.status === 'confirmed' && b.payment_status !== 'paid' && <button type="button" onClick={() => patch(b, { payment_status: 'paid' })}>Mark paid</button>}
                          {b.status === 'confirmed' && <button type="button" onClick={() => patch(b, { status: 'no_show' })}>No show</button>}
                          {['confirmed', 'pending_payment', 'refund_needed'].includes(b.status) && (
                            <button type="button" className="danger" onClick={() => patch(b, { status: 'cancelled' }, b.payment_status === 'paid' ? 'This booking was paid online. Cancel it and refund the money from the Razorpay dashboard. Continue?' : 'Cancel this booking?')}>Cancel</button>
                          )}
                          {b.status === 'refund_needed' && b.payment_status === 'paid' && <button type="button" onClick={() => patch(b, { payment_status: 'refunded', status: 'cancelled' }, 'Mark as refunded? Do this only after refunding in Razorpay.')}>Mark refunded</button>}
                          <a href={`https://wa.me/91${b.phone}?text=${encodeURIComponent(`Hello ${b.patient_name}, this is Ejaz Clinic about your appointment ${b.id} with ${b.doctor_name} on ${dateLabel(b.date)} at ${timeLabel(b.time)}.`)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {tab === 'blocks' && (
        <section className="adm-blocks">
          <form className="adm-filters" onSubmit={addBlock}>
            <label>Doctor
              <select value={blockForm.doctorSlug} onChange={(e) => setBlockForm((f) => ({ ...f, doctorSlug: e.target.value }))} required>
                <option value="">Choose</option>
                {doctors.map((d) => <option key={d.slug} value={d.slug}>{d.name}</option>)}
              </select>
            </label>
            <label>Date<input type="date" value={blockForm.date} min={today} onChange={(e) => setBlockForm((f) => ({ ...f, date: e.target.value }))} required /></label>
            <label>Time (empty = whole day)<input type="time" step="900" value={blockForm.time} onChange={(e) => setBlockForm((f) => ({ ...f, time: e.target.value }))} /></label>
            <label>Reason (optional)<input value={blockForm.reason} maxLength={120} onChange={(e) => setBlockForm((f) => ({ ...f, reason: e.target.value }))} /></label>
            <button className="btn btn-primary" type="submit">Block</button>
          </form>
          <p className="book-hint">Blocked times cannot be booked online. Existing bookings are not cancelled automatically.</p>
          {blocks.length === 0 ? <p className="adm-empty">Nothing blocked.</p> : (
            <ul className="adm-block-list">
              {blocks.map((b) => (
                <li key={b.id}>
                  <span><strong>{doctorName(b.doctor_slug)}</strong>, {dateLabel(b.date)}, {b.time ? timeLabel(b.time) : 'whole day'}{b.reason ? ` (${b.reason})` : ''}</span>
                  <button type="button" className="danger" onClick={() => removeBlock(b.id)}>Remove</button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
