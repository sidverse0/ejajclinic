import Link from 'next/link';
import { imageSrc } from '@/data/images';

export default function DoctorCard({ doctor }) {
  return (
    <Link className="doc-card" href={`/doctors/${doctor.slug}`}>
      <span className="doc-photo">
        <img src={imageSrc('doctors', doctor.slug)} alt={`Portrait of ${doctor.name}`} width="600" height="700" loading="lazy" />
        <span className="doc-days">{doctor.days}</span>
      </span>
      <span className="doc-info">
        <h3>{doctor.name}</h3>
        <span className="role">{doctor.role}</span>
        <span className="degrees">{doctor.degrees}</span>
        <span className="doc-link">View profile</span>
      </span>
    </Link>
  );
}
