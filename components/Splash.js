'use client';

import { useEffect, useState } from 'react';

const SHOW_MS = 3000;
const LEAVE_MS = 800;

export default function Splash() {
  const [phase, setPhase] = useState('show'); // show | leave | gone

  useEffect(() => {
    const root = document.documentElement;
    const finish = () => {
      root.classList.add('ready');
      window.dispatchEvent(new Event('splash-done'));
    };
    let seen = false;
    try { seen = sessionStorage.getItem('ejaz-splash') === '1'; } catch (e) { /* ignore */ }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (seen || reduce) {
      setPhase('gone');
      finish();
      return undefined;
    }
    document.body.style.overflow = 'hidden';
    const t1 = setTimeout(() => {
      try { sessionStorage.setItem('ejaz-splash', '1'); } catch (e) { /* ignore */ }
      document.body.style.overflow = '';
      setPhase('leave');
      finish();
    }, SHOW_MS);
    const t2 = setTimeout(() => setPhase('gone'), SHOW_MS + LEAVE_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.style.overflow = '';
    };
  }, []);

  if (phase === 'gone') return null;

  return (
    <div className={phase === 'leave' ? 'splash leave' : 'splash'} aria-hidden="true">
      <div className="splash-inner">
        <div className="splash-mark">
          <img className="q q-tl" src="/images/site/logo-tl.png" alt="" width="260" height="260" />
          <img className="q q-tr" src="/images/site/logo-tr.png" alt="" width="260" height="260" />
          <img className="q q-bl" src="/images/site/logo-bl.png" alt="" width="260" height="260" />
          <img className="q q-br" src="/images/site/logo-br.png" alt="" width="260" height="260" />
        </div>
        <img className="splash-word" src="/images/site/logo-wordmark.png" alt="" width="1000" height="152" />
        <img className="splash-slogan" src="/images/site/logo-slogan.png" alt="" width="804" height="136" />
        <div className="splash-bar"><span /></div>
      </div>
    </div>
  );
}
