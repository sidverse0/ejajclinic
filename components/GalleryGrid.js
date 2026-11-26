'use client';

import { useCallback, useEffect, useState } from 'react';
import Icon from '@/components/Icon';
import { gallery } from '@/data/gallery';
import { imageSrc } from '@/data/images';

export default function GalleryGrid() {
  const [active, setActive] = useState(null);
  const count = gallery.length;

  const prev = useCallback(() => setActive((i) => (i === null ? i : (i + count - 1) % count)), [count]);
  const next = useCallback(() => setActive((i) => (i === null ? i : (i + 1) % count)), [count]);

  useEffect(() => {
    if (active === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setActive(null);
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [active, prev, next]);

  return (
    <>
      <div className="mosaic">
        {gallery.map((g, i) => (
          <button key={g.name} type="button" className="mosaic-item" onClick={() => setActive(i)} aria-label={`Open photo: ${g.caption}`}>
            <img src={imageSrc('gallery', g.name)} alt={g.caption} width="800" height="600" loading="lazy" />
            <span className="mosaic-cap">{g.caption}</span>
          </button>
        ))}
      </div>

      {active !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={() => setActive(null)}>
          <button type="button" className="lb-btn lb-close" onClick={() => setActive(null)} aria-label="Close"><Icon name="close" /></button>
          <button type="button" className="lb-btn lb-prev" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous photo"><Icon name="chevronL" /></button>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={imageSrc('gallery', gallery[active].name)} alt={gallery[active].caption} />
            <figcaption>{gallery[active].caption}</figcaption>
          </figure>
          <button type="button" className="lb-btn lb-next" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next photo"><Icon name="chevronR" /></button>
        </div>
      )}
    </>
  );
}
