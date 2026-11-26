import PageHeader from '@/components/PageHeader';
import GalleryGrid from '@/components/GalleryGrid';

export const metadata = { title: 'Gallery' };

export default function Gallery() {
  return (
    <>
      <PageHeader title="Gallery" intro="A look around the clinic. Click a photo to view it larger." crumbs={[{ href: '/', label: 'Home' }]} />
      <section className="section">
        <div className="container"><GalleryGrid /></div>
      </section>
    </>
  );
}
