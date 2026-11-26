import PageHeader from '@/components/PageHeader';
import DoctorCard from '@/components/DoctorCard';
import { doctors } from '@/data/doctors';

export const metadata = { title: 'Doctors' };

export default function Doctors() {
  return (
    <>
      <PageHeader title="Our doctors" intro="Experienced doctors across surgery, medicine, urology, orthopaedics and gynaecology." />
      <section className="section">
        <div className="container grid grid-4">
          {doctors.map((d) => (
            <DoctorCard key={d.slug} doctor={d} />
          ))}
        </div>
      </section>
    </>
  );
}
