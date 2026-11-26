import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import { clinic } from '@/data/clinic';
import { imageSrc } from '@/data/images';

export const metadata = { title: 'About' };

const values = [
  { icon: 'heart', title: 'Care first', text: 'Caring for patients is not a duty for us, it is our religion.' },
  { icon: 'shield', title: 'Affordable', text: 'Surgical and primary care within reach of the underprivileged.' },
  { icon: 'users', title: 'Together', text: 'Doctors, nurses and staff working as one team for each patient.' },
];

export default function About() {
  return (
    <>
      <PageHeader title="About Ejaz Clinic" intro="A humble beginning with a boundless dream." crumbs={[{ href: '/', label: 'Home' }]} />
      <section className="section">
        <div className="container split">
          <Reveal>
            <div className="split-media">
              <img src={imageSrc('site', 'about')} alt="Doctor consulting a patient" width="800" height="600" />
              <div className="badge-exp"><strong>{clinic.founded}</strong><span>our foundation</span></div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="prose">
              <h2>Our story</h2>
              <p>
                The foundation stone of our hospital was laid in {clinic.founded}. It began mainly as an outpatient
                clinic and a day care surgery centre.
              </p>
              <p>
                From the outset our mission was one: to bring affordable surgical and primary care to the
                underprivileged sections of society. With the blessing and financial support of Mr Ghulam Sarwar,
                the idea became a reality, and a practice led by Dr Ejaz Ali began.
              </p>
              <div className="actions">
                <Link className="btn btn-primary" href="/doctors">Meet our doctors</Link>
                <Link className="btn btn-ghost" href="/facilities">See our facilities</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="section alt">
        <div className="container">
          <div className="reasons">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <div className="reason">
                  <span className="reason-icon"><Icon name={v.icon} /></span>
                  <h3>{v.title}</h3>
                  <p>{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
