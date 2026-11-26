import PageHeader from '@/components/PageHeader';
import ContactForm from '@/components/ContactForm';
import { clinic, mapSrc } from '@/data/clinic';

export const metadata = { title: 'Contact and appointments' };

export default function Contact() {
  return (
    <>
      <PageHeader title="Contact and appointments" intro={`Call us, send a request, or visit during OPD hours (${clinic.opd.replace('OPD ', '')}).`} />
      <section className="section">
        <div className="container contact-grid">
          <div>
            <h2>Request an appointment</h2>
            <ContactForm />
          </div>
          <div>
            <h2>Find us</h2>
            <dl className="facts">
              <dt>Address</dt>
              <dd>{clinic.address}</dd>
              <dt>Phone</dt>
              <dd><a href={clinic.phoneHref}>{clinic.phone}</a></dd>
              <dt>Email</dt>
              <dd><a href={`mailto:${clinic.email}`}>{clinic.email}</a></dd>
              <dt>OPD</dt>
              <dd>{clinic.opd.replace('OPD ', '')}</dd>
            </dl>
            <iframe className="map" title="Ejaz Clinic on Google Maps" src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </section>
    </>
  );
}
