import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import DoctorCard from '@/components/DoctorCard';
import { specialities, getSpeciality } from '@/data/specialities';
import { doctors } from '@/data/doctors';
import { clinic } from '@/data/clinic';
import { imageSrc } from '@/data/images';

export function generateStaticParams() {
  return specialities.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }) {
  const s = getSpeciality(params.slug);
  return s ? { title: s.name, description: s.summary } : {};
}

export default function SpecialityPage({ params }) {
  const s = getSpeciality(params.slug);
  if (!s) notFound();

  const team = doctors.filter((d) => d.specialities.includes(s.slug));

  return (
    <>
      <PageHeader
        title={s.name}
        intro={s.summary}
        crumbs={[{ href: '/', label: 'Home' }, { href: '/specialities', label: 'Specialities' }]}
      />
      <section className="section">
        <div className="container">
          <div className="banner">
            <img src={imageSrc('specialities', s.slug)} alt="" width="800" height="500" />
          </div>
          {team.length > 0 && (
            <>
              <h2>Doctors</h2>
              <div className="grid grid-4">
                {team.map((d) => (
                  <DoctorCard key={d.slug} doctor={d} />
                ))}
              </div>
            </>
          )}
          <div className="actions">
            <Link className="btn btn-primary" href={clinic.bookHref}>Book appointment</Link>
            <a className="btn btn-ghost" href={clinic.phoneHref}>Call {clinic.phone}</a>
          </div>
        </div>
      </section>
    </>
  );
}
