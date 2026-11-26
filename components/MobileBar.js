import Link from 'next/link';
import Icon from '@/components/Icon';
import { clinic, waLink } from '@/data/clinic';

export default function MobileBar() {
  return (
    <nav className="mobile-bar" aria-label="Quick contact">
      <a href={clinic.phoneHref}><Icon name="phone" size={20} /><span>Call</span></a>
      <a href={waLink('Hello, I would like to know about an appointment at Ejaz Clinic.')} target="_blank" rel="noopener noreferrer">
        <Icon name="chat" size={20} /><span>WhatsApp</span>
      </a>
      <Link className="primary" href={clinic.bookHref}><Icon name="calendar" size={20} /><span>Book</span></Link>
    </nav>
  );
}
