import PageHeader from '@/components/PageHeader';
import BookingFlow from '@/components/BookingFlow';
import { doctors } from '@/data/doctors';
import { booking } from '@/data/booking';
import { doctorConfig } from '@/lib/schedule.js';
import { istNow } from '@/lib/time.js';
import { isEnabled } from '@/lib/razorpay.js';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Book an appointment' };

export default function BookPage({ searchParams }) {
  const list = doctors.map((d) => {
    const c = doctorConfig(d.slug);
    return { slug: c.slug, name: c.name, role: c.role, fee: c.fee, workingDays: c.days, days: d.days };
  });
  const initial = list.some((d) => d.slug === searchParams?.doctor) ? searchParams.doctor : '';

  return (
    <>
      <PageHeader
        title="Book an appointment"
        intro="Choose your doctor, pick a time that suits you, and confirm in a minute."
        crumbs={[{ href: '/', label: 'Home' }]}
      />
      <section className="section">
        <div className="container">
          <BookingFlow
            doctors={list}
            initialDoctor={initial}
            today={istNow().date}
            advanceDays={booking.advanceDays}
            holdMinutes={booking.holdMinutes}
            onlinePayment={isEnabled()}
          />
        </div>
      </section>
    </>
  );
}
