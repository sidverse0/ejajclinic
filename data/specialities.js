// Summaries are short placeholders. Confirm wording with the clinic before launch.
export const specialities = [
  { slug: 'laparoscopic-surgery', icon: 'scope', name: 'Laparoscopic Surgery', summary: 'Minimally invasive (keyhole) surgery done through small incisions.' },
  { slug: 'urology', icon: 'drop', name: 'Urology', summary: 'Care for the kidneys, urinary tract and related conditions.' },
  { slug: 'gastrointestinal-surgery', icon: 'surgery', name: 'Gastrointestinal Surgery', summary: 'Surgical care for conditions of the digestive system.' },
  { slug: 'hernia-surgery', icon: 'surgery', name: 'Hernia Surgery', summary: 'Surgical repair of hernias.' },
  { slug: 'gynaecology', icon: 'heart', name: 'Gynaecology', summary: "Women's health, pregnancy and related care." },
  { slug: 'plastic-surgery', icon: 'person', name: 'Plastic Surgery', summary: 'Reconstructive and corrective surgery.' },
  { slug: 'general-surgery', icon: 'surgery', name: 'General Surgery', summary: 'Surgical care for a wide range of common conditions.' },
  { slug: 'orthopaedics', icon: 'bone', name: 'Orthopaedics', summary: 'Care for bones, joints and muscles.' },
  { slug: 'physiotherapist', icon: 'person', name: 'Physiotherapy', summary: 'Rehabilitation and movement therapy after injury or surgery.' },
  { slug: 'cancer-surgery', icon: 'shield', name: 'Cancer Surgery', summary: 'Surgical treatment of cancer.' },
  { slug: 'general-internal-medicine', icon: 'pulse', name: 'General Internal Medicine', summary: 'Diagnosis and ongoing care of adult medical conditions.' },
  { slug: 'anaesthesia', icon: 'pulse', name: 'Anaesthesia', summary: 'Anaesthesia and pain management for surgery.' },
];

export const getSpeciality = (slug) => specialities.find((s) => s.slug === slug);
