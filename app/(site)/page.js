import Link from 'next/link';
import { clinic } from '@/data/clinic';
import { doctors } from '@/data/doctors';
import { specialities } from '@/data/specialities';
import { imageSrc } from '@/data/images';
import DoctorCard from '@/components/DoctorCard';
import SpecialityCard from '@/components/SpecialityCard';
import GalleryGrid from '@/components/GalleryGrid';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import Counter from '@/components/Counter';

const hours = clinic.opd.replace('OPD ', '');
const years = new Date().getFullYear() - clinic.founded;

const reasons = [
  { icon: 'shield', title: 'Affordable by design', text: 'Quality surgical and primary care that families can afford has been our mission since day one.' },
  { icon: 'users', title: 'Experienced doctors', text: `${doctors.length} doctors across surgery, medicine, urology, orthopaedics and gynaecology.` },
  { icon: 'bed', title: 'Day care and in-patient care', text: `Same-day procedures when possible, and ${clinic.beds} beds when a stay is needed.` },
  { icon: 'clock', title: 'Long OPD hours', text: `The OPD is open ${hours}, so you can see a doctor around your day.` },
];

const steps = [
  { icon: 'calendar', title: 'Book your visit', text: 'Send a request online, call us, or message us on WhatsApp.' },
  { icon: 'users', title: 'Meet your doctor', text: 'Get examined and understand your options in plain language.' },
  { icon: 'heart', title: 'Treatment and follow-up', text: 'Receive treatment with our team and come back for follow-up care.' },
];

const faqs = [
  { q: 'What are the OPD timings?', a: `The OPD is open ${hours}. Each doctor sees patients on set days, so check the doctors page before you visit.` },
  { q: 'How do I book an appointment?', a: `Send a request on the contact page, call ${clinic.phone}, or message us on WhatsApp. You can also pick a doctor, date and time yourself on the booking page.` },
  { q: 'Where is the clinic?', a: clinic.address },
  { q: 'Which specialities are available?', a: `We offer ${specialities.length} specialities, including general surgery, urology, orthopaedics and gynaecology. See the specialities page for the full list.` },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-bg" aria-hidden="true"><span className="blob b1" /><span className="blob b2" /></div>
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="pill"><span className="live-dot" /> Open today, {hours}</p>
            <h1>Trusted surgical and primary care in <span className="grad">Patna</span>.</h1>
            <p className="lead">
              Since {clinic.founded}, Ejaz Clinic has given the families of Koiritola and beyond affordable,
              honest treatment, from a day care surgery centre that grew into a {clinic.beds}-bed hospital.
            </p>
            <div className="actions">
              <Link className="btn btn-primary btn-lg" href={clinic.bookHref}>Book appointment</Link>
              <a className="btn btn-ghost btn-lg" href={clinic.phoneHref}>Call {clinic.phone}</a>
            </div>
            <ul className="trust">
              <li><strong>{clinic.founded}</strong><span>Serving Patna since</span></li>
              <li><strong>{clinic.beds}</strong><span>Beds</span></li>
              <li><strong>{doctors.length}</strong><span>Doctors</span></li>
            </ul>
          </div>

          <div className="hero-art">
            <div className="art-frame">
              <img src={imageSrc('site', 'hero')} alt="Illustration of the Ejaz Clinic building" width="1100" height="1000" />
            </div>
            <div className="float-card fc-a">
              <span className="fc-icon"><Icon name="shield" size={22} /></span>
              <span><strong>Since {clinic.founded}</strong><small>Trusted in Koiritola</small></span>
            </div>
            <div className="float-card fc-b">
              <span className="fc-icon aqua"><Icon name="clock" size={22} /></span>
              <span><strong>OPD {hours}</strong><small>Mon to Sat</small></span>
            </div>
            <div className="float-card fc-c">
              <svg viewBox="0 0 120 40" className="mini-pulse" aria-hidden="true">
                <path d="M0 20H34L42 6L54 34L62 14L68 20H120" pathLength="100" />
              </svg>
              <span><strong>{doctors.length} doctors</strong><small>{specialities.length} specialities</small></span>
            </div>
          </div>
        </div>
      </section>

      <section className="quick" aria-label="Quick actions">
        <div className="container quick-grid">
          <Link className="quick-item" href={clinic.bookHref}>
            <span className="quick-icon"><Icon name="calendar" /></span>
            <span><strong>Book appointment</strong><small>Pick a doctor and time</small></span>
          </Link>
          <a className="quick-item" href={clinic.phoneHref}>
            <span className="quick-icon"><Icon name="phone" /></span>
            <span><strong>Call us</strong><small>{clinic.phone}</small></span>
          </a>
          <Link className="quick-item" href="/contact">
            <span className="quick-icon"><Icon name="pin" /></span>
            <span><strong>Find the clinic</strong><small>Koiritola, Patna</small></span>
          </Link>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...specialities, ...specialities].map((s, i) => (
            <span key={`${s.slug}-${i}`}><Icon name={s.icon} size={18} /> {s.name}</span>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="container split">
          <Reveal>
            <div className="split-media">
              <img src={imageSrc('site', 'about')} alt="Doctor consulting a patient at Ejaz Clinic" width="800" height="600" loading="lazy" />
              <div className="badge-exp"><strong>{years}+</strong><span>years of care</span></div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div>
              <h2>Caring for patients is our religion.</h2>
              <p>
                What began as an outpatient clinic and day care surgery centre has grown into a hospital that families in
                Patna trust for affordable surgical and primary care.
              </p>
              <ul className="check-list">
                <li><Icon name="check" size={20} /> Affordable surgical and primary care for every family</li>
                <li><Icon name="check" size={20} /> Day care surgery and {clinic.beds} in-patient beds</li>
                <li><Icon name="check" size={20} /> {doctors.length} experienced doctors in {specialities.length} specialities</li>
              </ul>
              <Link className="btn btn-primary" href="/about">Read our story</Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <h2>Our specialities</h2>
              <p>Choose a speciality to see what we treat and which doctors to meet.</p>
            </div>
          </Reveal>
          <div className="grid grid-4">
            {specialities.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 4) * 70}>
                <SpecialityCard speciality={s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="stats" aria-label="Ejaz Clinic in numbers">
        <div className="container">
          <dl>
            {clinic.stats.map((s) => (
              <div key={s.label}>
                <dt><Counter to={s.to} suffix={s.suffix} /></dt>
                <dd>{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <h2>Meet our doctors</h2>
              <p>Every doctor sees patients in the OPD, {hours}, on their listed days.</p>
            </div>
          </Reveal>
          <div className="grid grid-4">
            {doctors.map((d, i) => (
              <Reveal key={d.slug} delay={(i % 4) * 80}>
                <DoctorCard doctor={d} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <h2>A look inside the clinic</h2>
              <p>Click any photo to view it larger.</p>
            </div>
          </Reveal>
          <Reveal><GalleryGrid /></Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <h2>Why families choose Ejaz Clinic</h2>
              <p>Care built around what patients actually need: skilled doctors, fair costs and time that suits them.</p>
            </div>
          </Reveal>
          <div className="reasons">
            {reasons.map((r, i) => (
              <Reveal key={r.title} delay={i * 80}>
                <div className="reason">
                  <span className="reason-icon"><Icon name={r.icon} /></span>
                  <h3>{r.title}</h3>
                  <p>{r.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <Reveal>
            <div className="section-head"><h2>How your visit works</h2></div>
          </Reveal>
          <div className="steps">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 90}>
                <div className="step">
                  <span className="step-n">{i + 1}</span>
                  <span className="step-icon"><Icon name={s.icon} size={26} /></span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container faq-wrap">
          <Reveal>
            <div className="section-head">
              <h2>Common questions</h2>
              <p>Cannot find your answer? Call us on {clinic.phone}.</p>
            </div>
          </Reveal>
          <div className="faq">
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container cta-inner">
          <div>
            <h2>Need to see a doctor?</h2>
            <p>{clinic.address}. {clinic.opd}.</p>
          </div>
          <div className="actions">
            <Link className="btn btn-light btn-lg" href={clinic.bookHref}>Book appointment</Link>
            <a className="btn btn-outline-light btn-lg" href={clinic.phoneHref}>Call now</a>
          </div>
        </div>
      </section>
    </>
  );
}
