import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import Icon from '@/components/Icon';
import { getBooking } from '@/lib/store/index.js';
import { dateLabel, timeLabel } from '@/lib/time.js';
import { clinic, waLink } from '@/data/clinic';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Appointment status', robots: { index: false, follow: false } };

export default async function Confirmation({ searchParams }) {
  const id = String(searchParams?.id || '');
  const b = id ? await getBooking(id).catch(() => null) : null;

  if (!b) {
    return (
      <>
        <PageHeader title="Appointment not found" intro="We could not find that booking." />
        <section className="section"><div className="container">
          <p>Please check the link, or call us on <a href={clinic.phoneHref}>{clinic.phone}</a>.</p>
          <div className="actions"><Link className="btn btn-primary" href="/book">Book an appointment</Link></div>
        </div></section>
      </>
    );
  }

  const confirmed = b.status === 'confirmed' || b.status === 'completed';
  const waving = `Hello Ejaz Clinic, my booking ID is ${b.id} (${b.doctor_name}, ${dateLabel(b.date)}, ${timeLabel(b.time)}).`;
  const masked = `+91 ${'*'.repeat(6)}${String(b.phone).slice(-4)}`;

  return (
    <>
      <PageHeader
        title={confirmed ? 'Appointment confirmed' : b.status === 'pending_payment' ? 'Waiting for payment' : 'Appointment status'}
        intro={confirmed ? 'Thank you. Please arrive 10 minutes early.' : undefined}
      />
      <section className="section">
        <div className="container confirm">
          <div className="confirm-card">
            <div className={confirmed ? 'confirm-mark ok' : 'confirm-mark'} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                {confirmed ? <path d="M5 12.5l4.5 4.5L19 7" /> : <path d="M12 7v5l3.5 2" />}
              </svg>
            </div>
            <p className="confirm-id">Booking ID <strong>{b.id}</strong></p>
            <dl className="facts">
              <dt>Patient</dt><dd>{b.patient_name.split(' ')[0]} ({masked})</dd>
              <dt>Doctor</dt><dd>{b.doctor_name}</dd>
              <dt>Date</dt><dd>{dateLabel(b.date)}</dd>
              <dt>Time</dt><dd>{timeLabel(b.time)}</dd>
              <dt>Where</dt><dd>{clinic.name}, {clinic.address}</dd>
              <dt>Payment</dt>
              <dd>{b.payment_status === 'paid' ? `Paid online (\u20B9${b.amount})` : b.status === 'pending_payment' ? 'Waiting for payment' : `Pay at clinic (\u20B9${b.amount})`}</dd>
            </dl>
            {b.status === 'pending_payment' && (
              <p className="book-hint">If you have already paid, this page will update within a minute. Otherwise <Link href={`/book?doctor=${b.doctor_slug}`}>book again</Link>.</p>
            )}
            {b.status === 'cancelled' && <p className="book-error">This booking was cancelled.</p>}
            {b.status === 'refund_needed' && <p className="book-error">We received your payment but the slot was taken. Please call us and we will refund you or rebook you.</p>}
            {confirmed && (
              <div className="actions">
                <a className="btn btn-primary" href={`/api/bookings/${b.id}/ics`}><Icon name="calendar" size={18} /> Add to calendar</a>
                <a className="btn btn-ghost" href={waLink(waving)} target="_blank" rel="noopener noreferrer"><Icon name="chat" size={18} /> Message us</a>
              </div>
            )}
            <p className="book-hint">To change or cancel, call <a href={clinic.phoneHref}>{clinic.phone}</a> and share your booking ID.</p>
          </div>
        </div>
      </section>
    </>
  );
}
