import PageHeader from '@/components/PageHeader';
import SpecialityCard from '@/components/SpecialityCard';
import { specialities } from '@/data/specialities';

export const metadata = { title: 'Specialities' };

export default function Specialities() {
  return (
    <>
      <PageHeader title="Specialities" intro="Surgical and medical care under one roof." />
      <section className="section">
        <div className="container grid grid-4">
          {specialities.map((s) => (
            <SpecialityCard key={s.slug} speciality={s} />
          ))}
        </div>
      </section>
    </>
  );
}
