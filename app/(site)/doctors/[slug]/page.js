import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import Icon from '@/components/Icon';
import { doctors, getDoctor } from '@/data/doctors';
import { getSpeciality } from '@/data/specialities';
import { clinic } from '@/data/clinic';
import { imageSrc } from '@/data/images';

export function generateStaticParams() {
  return doctors.map((d) => ({ slug: d.slug }));
}

export function generateMetadata({ params }) {
  const doctor = getDoctor(params.slug);
  return doctor ? { title: `${doctor.name}, ${doctor.role}` } : {};
}

export default function DoctorPage({ params }) {
  const doctor = getDoctor(params.slug);
  if (!doctor) notFound();

  const specs = doctor.specialities.map(getSpeciality).filter(Boolean);

  return (
    <>
      <PageHeader
        title={doctor.name}
        intro={doctor.role}
        crumbs={[{ href: '/', label: 'Home' }, { href: '/doctors', label: 'Doctors' }]}
      />
      <section className="section">
        <div className="container detail">
          <div className="detail-photo">
            <img src={imageSrc('doctors', doctor.slug)} alt={`Portrait of ${doctor.name}`} width="600" height="700" />
          </div>
          <div>
            <dl className="facts">
              <dt>Qualifications</dt>
              <dd>{doctor.degrees}</dd>
              <dt>OPD days</dt>
              <dd>{doctor.days}</dd>
              <dt>OPD timing</dt>
              <dd>{clinic.opd.replace('OPD ', '')}</dd>
              <dt>Location</dt>
              <dd>{clinic.address}</dd>
            </dl>
            {specs.length > 0 && (
              <>
                <h2>Specialities</h2>
                <ul className="chips">
                  {specs.map((s) => (
                    <li key={s.slug}><Link href={`/specialities/${s.slug}`}><Icon name={s.icon} size={16} /> {s.name}</Link></li>
                  ))}
                </ul>
              </>
            )}
            <div className="actions">
              <Link className="btn btn-primary" href={`/book?doctor=${doctor.slug}`}>Book appointment</Link>
              <a className="btn btn-ghost" href={clinic.phoneHref}>Call {clinic.phone}</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
