// Doctor details come from the current website. `specialities` links to data/specialities.js
// and is only filled where it is obvious. Confirm with the clinic.
export const doctors = [
  { slug: 'dr-shahzad-ali', name: 'Dr Shahzad Ali', degrees: 'MD, DABS, FACS', role: 'General & GI Surgery', days: 'Tue, Thu, Sat', specialities: ['general-surgery', 'gastrointestinal-surgery'] },
  { slug: 'dr-i-akram', name: 'Dr I Akram', degrees: 'DNB (Ortho), D-Ortho, MD', role: 'Orthopaedic Surgeon', days: 'Mon to Sat', specialities: ['orthopaedics'] },
  { slug: 'dr-suraiyya-anjum', name: 'Dr Suraiyya Anjum', degrees: 'MBBS, DGO', role: 'Obs and Gynaecology', days: 'Mon to Sat', specialities: ['gynaecology'] },
  { slug: 'dr-saman-wasi', name: 'Dr Saman Wasi', degrees: 'MBBS, MD (Medicine), DrNB (Gastroenterology), Fellowship in Advanced Endoscopy', role: 'Consultant Gastroenterologist & Interventional Endoscopist', days: 'Mon to Sat', specialities: [] },
  { slug: 'dr-abdul-salik', name: 'Dr Abdul Salik', degrees: 'MBBS, MD-Medicine', role: 'Consultant Physician', days: 'Mon to Sat', specialities: ['general-internal-medicine'] },
  { slug: 'dr-faizul', name: 'Dr Faizul', degrees: 'MBBS, MS, MCh', role: 'Urology', days: 'Mon to Sat', specialities: ['urology'] },
  { slug: 'dr-parwez-ahmed', name: 'Dr Parwez Ahmed', degrees: 'MBBS, MS, DrNB (Urology)', role: 'Urology', days: 'Mon to Sat', specialities: ['urology'] },
];

export const getDoctor = (slug) => doctors.find((d) => d.slug === slug);
export const initials = (name) =>
  name.replace(/^Dr\.?\s+/i, '').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
