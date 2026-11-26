'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Icon from '@/components/Icon';
import Logo from '@/components/Logo';
import { clinic } from '@/data/clinic';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/doctors', label: 'Doctors' },
  { href: '/specialities', label: 'Specialities' },
  { href: '/facilities', label: 'Facilities' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={scrolled ? 'site-header scrolled' : 'site-header'}>
      <nav className="container nav" aria-label="Main">
        <Link className="brand" href="/" onClick={() => setOpen(false)}>
          <Logo size={40} />
          <span className="brand-text">
            <span className="brand-name">{clinic.name}</span>
            <span className="brand-sub">{clinic.slogan}</span>
          </span>
        </Link>
        <button
          type="button"
          className="menu-btn"
          aria-expanded={open}
          aria-controls="nav-links"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
        <ul id="nav-links" className={open ? 'nav-links open' : 'nav-links'}>
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={isActive(l.href) ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li className="mobile-only">
            <Link className="btn btn-primary" href={clinic.bookHref} onClick={() => setOpen(false)}>
              <Icon name="calendar" size={18} /> Book appointment
            </Link>
          </li>
        </ul>
        <Link className="btn btn-primary nav-cta" href={clinic.bookHref}>
          <Icon name="calendar" size={18} /> Book appointment
        </Link>
      </nav>
    </header>
  );
}
