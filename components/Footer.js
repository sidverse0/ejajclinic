import Link from 'next/link';
import Logo from '@/components/Logo';
import { clinic } from '@/data/clinic';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="foot-brand">
            <Logo size={48} />
            <div>
              <h2>{clinic.name}</h2>
              <p className="foot-slogan">{clinic.slogan}</p>
            </div>
          </div>
          <p>{clinic.address}</p>
          <p>{clinic.opd}</p>
          <Link className="btn btn-light" href={clinic.bookHref}>Book appointment</Link>
        </div>
        <div>
          <h2>Pages</h2>
          <ul>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/doctors">Doctors</Link></li>
            <li><Link href="/specialities">Specialities</Link></li>
            <li><Link href="/facilities">Facilities</Link></li>
          </ul>
        </div>
        <div>
          <h2>Contact</h2>
          <ul>
            <li><a href={clinic.phoneHref}>{clinic.phone}</a></li>
            <li><a href={`mailto:${clinic.email}`}>{clinic.email}</a></li>
            <li><a href={clinic.social.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href={clinic.social.youtube} target="_blank" rel="noopener noreferrer">YouTube</a></li>
          </ul>
        </div>
      </div>
      <div className="container copy">
        &copy; {new Date().getFullYear()} {clinic.name}. All rights reserved.
      </div>
    </footer>
  );
}
