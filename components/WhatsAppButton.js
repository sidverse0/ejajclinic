import { waLink } from '@/data/clinic';

export default function WhatsAppButton() {
  return (
    <a
      className="wa-float"
      href={waLink('Hello, I would like to know about an appointment at Ejaz Clinic.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Ejaz Clinic on WhatsApp"
    >
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path
          fill="currentColor"
          d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
        />
      </svg>
      <span>WhatsApp</span>
    </a>
  );
}
