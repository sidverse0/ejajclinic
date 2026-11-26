'use client';

import Link from 'next/link';
import { useState } from 'react';
import { doctors } from '@/data/doctors';
import { waLink } from '@/data/clinic';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', phone: '', doctor: '', message: '' });
  const [error, setError] = useState('');

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Please enter your name and phone number.');
      return;
    }
    setError('');
    const text =
      `Appointment request\nName: ${form.name.trim()}\nPhone: ${form.phone.trim()}` +
      (form.doctor ? `\nDoctor: ${form.doctor}` : '') +
      (form.message.trim() ? `\nMessage: ${form.message.trim()}` : '');
    window.open(waLink(text), '_blank', 'noopener,noreferrer');
  };

  return (
    <form className="form" onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor="name">Your name</label>
        <input id="name" name="name" value={form.name} onChange={update} autoComplete="name" />
      </div>
      <div className="field">
        <label htmlFor="phone">Phone number</label>
        <input id="phone" name="phone" type="tel" value={form.phone} onChange={update} autoComplete="tel" />
      </div>
      <div className="field">
        <label htmlFor="doctor">Doctor (optional)</label>
        <select id="doctor" name="doctor" value={form.doctor} onChange={update}>
          <option value="">Any available doctor</option>
          {doctors.map((d) => (
            <option key={d.slug} value={d.name}>{d.name} ({d.role})</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="message">Message (optional)</label>
        <textarea id="message" name="message" rows={4} value={form.message} onChange={update} />
      </div>
      {error && <p role="alert" style={{ color: '#a12a1f', fontWeight: 600 }}>{error}</p>}
      <button className="btn btn-primary" type="submit">Send request on WhatsApp</button>
      <p className="hint">
        This opens WhatsApp with your details filled in. Want to choose a time slot yourself? <Link href="/book">Book online</Link>.
      </p>
    </form>
  );
}
