export const clinic = {
  name: 'Ejaz Clinic',
  slogan: 'healthcare for all...',
  founded: 1987,
  phone: '+91 6203 770 070',
  phoneHref: 'tel:+916203770070',
  whatsapp: '916203770070',
  email: 'drejazclinic@gmail.com',
  address: 'Shareef Colony, Chak Musallahpur, Koiritola, Patna, Bihar 800004',
  opd: 'OPD 9 AM to 9 PM',
  bookHref: '/book',
  social: {
    facebook: 'https://www.facebook.com/ejazclinic.hospital.1/',
    youtube: 'https://www.youtube.com/@ejazclinic8380',
  },
  beds: 35,
  stats: [
    { to: 200000, suffix: '+', label: 'OPD patients seen' },
    { to: 20000, suffix: '+', label: 'Patients treated successfully' },
    { to: 35, suffix: '', label: 'Beds' },
    { to: 7, suffix: '', label: 'Doctors' },
  ],
};

export function waLink(text) {
  const base = `https://wa.me/${clinic.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
  clinic.name + ', ' + clinic.address
)}&output=embed`;
