import PageHeader from '@/components/PageHeader';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import GalleryGrid from '@/components/GalleryGrid';
import { clinic } from '@/data/clinic';

export const metadata = { title: 'Facilities' };

// Add more facilities here after confirming the list with the clinic.
const facilities = [
  { icon: 'users', name: 'Outpatient department (OPD)', text: `Open ${clinic.opd.replace('OPD ', '')} with doctors from several specialities.` },
  { icon: 'surgery', name: 'Day care surgery', text: 'Planned procedures where the patient can go home the same day.' },
  { icon: 'bed', name: 'In-patient beds', text: `${clinic.beds} beds for patients who need to stay.` },
];

export default function Facilities() {
  return (
    <>
      <PageHeader title="Facilities" intro="What you can expect when you visit." crumbs={[{ href: '/', label: 'Home' }]} />
      <section className="section">
        <div className="container reasons">
          {facilities.map((f, i) => (
            <Reveal key={f.name} delay={i * 80}>
              <div className="reason">
                <span className="reason-icon"><Icon name={f.icon} /></span>
                <h3>{f.name}</h3>
                <p>{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="section alt">
        <div className="container">
          <div className="section-head"><h2>Photos</h2></div>
          <GalleryGrid />
        </div>
      </section>
    </>
  );
}
