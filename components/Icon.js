const shapes = {
  surgery: (<><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></>),
  pulse: (<path d="M3 12h4l2.5-6 4 12 2.5-6H21" />),
  heart: (<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z" />),
  drop: (<path d="M12 3.5s6 6.2 6 10.5a6 6 0 0 1-12 0c0-4.3 6-10.5 6-10.5z" />),
  bone: (<><path d="M8.5 15.5l7-7" /><circle cx="6.8" cy="17.2" r="2" /><circle cx="17.2" cy="6.8" r="2" /></>),
  person: (<><circle cx="12" cy="7" r="3.2" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></>),
  scope: (<><path d="M4 20l8-8" /><circle cx="15" cy="9" r="4.5" /></>),
  shield: (<><path d="M12 3l7.5 3v5.5c0 4.6-3.2 8-7.5 9.5-4.3-1.5-7.5-4.9-7.5-9.5V6L12 3z" /><path d="M9 12l2.2 2.2L15.5 10" /></>),
  calendar: (<><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>),
  phone: (<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1.5 1.5 0 0 1-1.6 1.5C10.7 20 4 13.3 3.5 5.6A1.5 1.5 0 0 1 5 4z" />),
  pin: (<><path d="M12 21s-6.5-5.7-6.5-11a6.5 6.5 0 0 1 13 0c0 5.3-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></>),
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>),
  users: (<><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><circle cx="17" cy="9" r="2.4" /><path d="M17 14.5a5 5 0 0 1 4 5.5" /></>),
  bed: (<path d="M3 18V7M3 13h18v5M21 13v-2a3 3 0 0 0-3-3h-7v5" />),
  arrowUp: (<path d="M12 19V5M6 11l6-6 6 6" />),
  check: (<path d="M5 12.5l4.5 4.5L19 7" />),
  chat: (<path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-5 4V6a1 1 0 0 1 1-1z" />),
  close: (<path d="M6 6l12 12M18 6L6 18" />),
  mail: (<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>),
  chevronL: (<path d="M15 5l-7 7 7 7" />),
  chevronR: (<path d="M9 5l7 7-7 7" />),
  star: (<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9l-5.2 2.8 1-5.9L3.5 9.7l5.9-.8L12 3.5z" />),
  arrow: (<path d="M5 12h14M13 6l6 6-6 6" />),
};

export default function Icon({ name, size = 28 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {shapes[name] || shapes.surgery}
    </svg>
  );
}
