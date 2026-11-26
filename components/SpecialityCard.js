import Link from 'next/link';
import Icon from '@/components/Icon';
import { imageSrc } from '@/data/images';

export default function SpecialityCard({ speciality }) {
  return (
    <Link className="spec-card" href={`/specialities/${speciality.slug}`}>
      <span className="spec-media">
        <img src={imageSrc('specialities', speciality.slug)} alt="" width="800" height="500" loading="lazy" />
        <span className="spec-icon"><Icon name={speciality.icon} size={24} /></span>
      </span>
      <span className="spec-body">
        <h3>{speciality.name}</h3>
        <p>{speciality.summary}</p>
        <span className="spec-more">Learn more <Icon name="arrow" size={16} /></span>
      </span>
    </Link>
  );
}
