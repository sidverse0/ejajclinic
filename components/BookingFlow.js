'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import Icon from '@/components/Icon';
import { addDays, weekdayOf, dateLabel, timeLabel } from '@/lib/time.js';
import { imageSrc } from '@/data/images';
import { clinic } from '@/data/clinic';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const groupOf = (t) => (Number(t.slice(0, 2)) < 12 ? 'Morning' : Number(t.slice(0, 2)) < 17 ? 'Afternoon' : 'Evening');

export default function BookingFlow({ doctors, initialDoctor, today, advanceDays, holdMinutes, onlinePayment }) {
  const router = useRouter();
  const [doctorSlug, setDoctorSlug] = useState(initialDoctor || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [slots, setSlots] = useState({ loading: false, list: [], error: '', closed: false });
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '', website: '' });
  const [payMode, setPayMode] = useState(onlinePayment ? 'online' : 'clinic');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(null); // an unpaid online booking waiting for payment
  const [reload, setReload] = useState(0);

  const doctor = doctors.find((d) => d.slug === doctorSlug) || null;
  const dates = Array.from({ length: advanceDays }, (_, i) => addDays(today, i));

  useEffect(() => {
    if (!doctorSlug || !date) return undefined;
    const ctrl = new AbortController();
    setSlots({ loading: true, list: [], error: '', closed: false });
    fetch(`/api/availability?doctor=${encodeURIComponent(doctorSlug)}&date=${date}`, { signal: ctrl.signal })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Could not load time slots.');
        setSlots({ loading: false, list: data.slots || [], error: '', closed: !!data.closed });
      })
      .catch((e) => {
        if (e.name !== 'AbortError') setSlots({ loading: false, list: [], error: e.message, closed: false });
      });
    return () => ctrl.abort();
  }, [doctorSlug, date, reload]);

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const pickDoctor = (slug) => { setDoctorSlug(slug); setDate(''); setTime(''); setError(''); };
  const pickDate = (d) => { setDate(d); setTime(''); setError(''); };

  function finish(id) {
    router.push(`/book/confirmation?id=${encodeURIComponent(id)}`);
  }

  function openCheckout(booking, p) {
    if (typeof window === 'undefined' || !window.Razorpay) {
      setError('The payment window could not load. Please refresh the page or choose pay at clinic.');
      setSubmitting(false);
      return;
    }
    const rzp = new window.Razorpay({
      key: p.keyId,
      amount: p.amount,
      currency: p.currency,
      order_id: p.orderId,
      name: clinic.name,
      description: `Consultation with ${booking.doctor_name}`,
      prefill: { name: form.name, contact: form.phone, email: form.email || undefined },
      theme: { color: '#114b8f' },
      modal: {
        ondismiss: () => {
          setSubmitting(false);
          setError(`Payment not completed. Your slot is held for ${holdMinutes} minutes. Press "Complete payment" to try again.`);
        },
      },
      handler: async (resp) => {
        setSubmitting(true);
        setError('');
        try {
          const res = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookingId: booking.id, ...resp }),
          });
          if (res.ok) return finish(booking.id);
          setError('We could not confirm your payment yet. If money was deducted, your booking will be confirmed automatically. Please call the clinic.');
        } catch (e) {
          setError('Network problem while confirming payment. If money was deducted, your booking will be confirmed automatically.');
        }
        setSubmitting(false);
        return undefined;
      },
    });
    rzp.on('payment.failed', () => setError('Payment failed. You can try again.'));
    rzp.open();
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (pending) {
      setSubmitting(true);
      openCheckout(pending.booking, pending.payment);
      return;
    }
    if (!doctor || !date || !time) return setError('Please choose a doctor, a date and a time.');
    if (form.name.trim().length < 2) return setError('Please enter your full name.');
    if (form.phone.replace(/\D/g, '').length < 10) return setError('Please enter a valid 10-digit mobile number.');
    setSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorSlug, date, time, paymentMode: payMode, ...form }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        if (res.status === 409) { setTime(''); setReload((n) => n + 1); }
        setSubmitting(false);
        return undefined;
      }
      if (data.payment) {
        setPending({ booking: data.booking, payment: data.payment });
        openCheckout(data.booking, data.payment);
        return undefined;
      }
      return finish(data.booking.id);
    } catch (err) {
      setError('Network problem. Please check your connection and try again.');
      setSubmitting(false);
      return undefined;
    }
  }

  const groups = ['Morning', 'Afternoon', 'Evening'].map((g) => ({ name: g, items: slots.list.filter((s) => groupOf(s.time) === g) })).filter((g) => g.items.length);
  const hasFreeSlot = slots.list.some((s) => s.available);
  const locked = !!pending;

  return (
    <form className="book-grid" onSubmit={submit} noValidate>
      {onlinePayment && <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />}

      <div className="book-main">
        <fieldset className="book-step" disabled={locked}>
          <legend><span className="step-badge">1</span> Choose a doctor</legend>
          <div className="doc-pick">
            {doctors.map((d) => (
              <button key={d.slug} type="button" className={d.slug === doctorSlug ? 'doc-pick-item on' : 'doc-pick-item'} aria-pressed={d.slug === doctorSlug} onClick={() => pickDoctor(d.slug)}>
                <img src={imageSrc('doctors', d.slug)} alt="" width="56" height="56" />
                <span><strong>{d.name}</strong><small>{d.role}</small><small>OPD: {d.days}</small></span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className={doctor ? 'book-step' : 'book-step is-locked'} disabled={!doctor || locked}>
          <legend><span className="step-badge">2</span> Pick a date</legend>
          <div className="date-row" role="group" aria-label="Dates">
            {dates.map((d) => {
              const ok = doctor ? doctor.workingDays.includes(weekdayOf(d)) : false;
              return (
                <button key={d} type="button" disabled={!ok} className={d === date ? 'date-chip on' : 'date-chip'} aria-pressed={d === date} onClick={() => pickDate(d)}>
                  <small>{d === today ? 'Today' : WEEKDAYS[weekdayOf(d)]}</small>
                  <strong>{Number(d.slice(8))}</strong>
                  <small>{MONTHS[Number(d.slice(5, 7)) - 1]}</small>
                </button>
              );
            })}
          </div>
          {doctor && <p className="book-hint">{doctor.name} sees patients on {doctor.days}.</p>}
        </fieldset>

        <fieldset className={date ? 'book-step' : 'book-step is-locked'} disabled={!date || locked}>
          <legend><span className="step-badge">3</span> Pick a time</legend>
          {slots.loading && <p className="book-hint">Loading time slots...</p>}
          {slots.error && <p className="book-error" role="alert">{slots.error}</p>}
          {!slots.loading && !slots.error && date && slots.list.length > 0 && !hasFreeSlot && <p className="book-hint">No free slots on this day. Please pick another date.</p>}
          {groups.map((g) => (
            <div key={g.name} className="slot-group">
              <h3>{g.name}</h3>
              <div className="slot-grid">
                {g.items.map((s) => (
                  <button key={s.time} type="button" disabled={!s.available} className={s.time === time ? 'slot on' : 'slot'} aria-pressed={s.time === time} onClick={() => setTime(s.time)}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </fieldset>

        <fieldset className={time ? 'book-step' : 'book-step is-locked'} disabled={!time || locked}>
          <legend><span className="step-badge">4</span> Your details</legend>
          <div className="form">
            <div className="field"><label htmlFor="b-name">Full name</label><input id="b-name" name="name" value={form.name} onChange={update} autoComplete="name" maxLength={80} /></div>
            <div className="field"><label htmlFor="b-phone">Mobile number</label><input id="b-phone" name="phone" type="tel" inputMode="numeric" value={form.phone} onChange={update} autoComplete="tel" placeholder="10-digit mobile number" /></div>
            <div className="field"><label htmlFor="b-email">Email (optional)</label><input id="b-email" name="email" type="email" value={form.email} onChange={update} autoComplete="email" /></div>
            <div className="field"><label htmlFor="b-notes">Note for the clinic (optional)</label><textarea id="b-notes" name="notes" rows={3} maxLength={300} value={form.notes} onChange={update} placeholder="Reason for the visit. Please avoid sharing sensitive medical details here." /></div>
            <div className="hp" aria-hidden="true"><label htmlFor="b-web">Website</label><input id="b-web" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={update} /></div>
          </div>
        </fieldset>

        {onlinePayment && (
          <fieldset className={time ? 'book-step' : 'book-step is-locked'} disabled={!time || locked}>
            <legend><span className="step-badge">5</span> Payment</legend>
            <div className="pay-options">
              <label className={payMode === 'online' ? 'pay-opt on' : 'pay-opt'}>
                <input type="radio" name="pay" checked={payMode === 'online'} onChange={() => setPayMode('online')} />
                <span><strong>Pay now (UPI, card, netbanking)</strong><small>Secure payment by Razorpay. Your slot is confirmed right away.</small></span>
              </label>
              <label className={payMode === 'clinic' ? 'pay-opt on' : 'pay-opt'}>
                <input type="radio" name="pay" checked={payMode === 'clinic'} onChange={() => setPayMode('clinic')} />
                <span><strong>Pay at the clinic</strong><small>Pay when you visit. Your slot is confirmed right away.</small></span>
              </label>
            </div>
          </fieldset>
        )}
      </div>

      <aside className="book-summary" aria-live="polite">
        <h2>Your appointment</h2>
        <dl>
          <div><dt>Doctor</dt><dd>{doctor ? doctor.name : 'Not chosen yet'}</dd></div>
          <div><dt>Date</dt><dd>{date ? dateLabel(date) : 'Not chosen yet'}</dd></div>
          <div><dt>Time</dt><dd>{time ? timeLabel(time) : 'Not chosen yet'}</dd></div>
          <div><dt>Consultation fee</dt><dd>{doctor ? `\u20B9${doctor.fee}` : '-'}</dd></div>
        </dl>
        {error && <p className="book-error" role="alert">{error}</p>}
        <button className="btn btn-primary btn-lg book-submit" type="submit" disabled={submitting || (!pending && !time)}>
          <Icon name="calendar" size={20} />
          {submitting ? 'Please wait...' : pending ? 'Complete payment' : payMode === 'online' && onlinePayment ? `Pay \u20B9${doctor ? doctor.fee : ''} and confirm` : 'Confirm appointment'}
        </button>
        {pending && <button type="button" className="book-reset" onClick={() => { setPending(null); setError(''); setTime(''); setReload((n) => n + 1); }}>Start over</button>}
        <p className="book-hint">Need help? Call <a href={clinic.phoneHref}>{clinic.phone}</a>.</p>
      </aside>
    </form>
  );
}
