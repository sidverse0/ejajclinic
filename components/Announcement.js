'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Icon from '@/components/Icon';
import { announcement } from '@/data/announcements';

const KEY = `ejaz-ann-${announcement.id}`;

export default function Announcement() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!announcement.enabled) return undefined;
    let dismissed = false;
    try { dismissed = sessionStorage.getItem(KEY) === '1'; } catch (e) { /* ignore */ }
    if (dismissed) return undefined;
    let timer;
    const start = () => { timer = setTimeout(() => setOpen(true), 900); };
    if (document.documentElement.classList.contains('ready')) start();
    else window.addEventListener('splash-done', start, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('splash-done', start);
    };
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  function close() {
    setOpen(false);
    try { sessionStorage.setItem(KEY, '1'); } catch (e) { /* ignore */ }
  }

  if (!announcement.enabled) return null;

  return (
    <aside className={open ? 'announce show' : 'announce'} role="dialog" aria-label="Announcement" aria-hidden={!open}>
      <div className="announce-icon"><Icon name="calendar" size={26} /></div>
      <div className="announce-body">
        <p className="announce-tag">{announcement.tag}</p>
        <h2>{announcement.title}</h2>
        <p>{announcement.text}</p>
        {announcement.href && (
          <Link className="btn btn-primary" href={announcement.href} onClick={close}>{announcement.ctaLabel}</Link>
        )}
      </div>
      <button type="button" className="announce-close" onClick={close} aria-label="Close announcement" tabIndex={open ? 0 : -1}>
        <Icon name="close" size={20} />
      </button>
    </aside>
  );
}
