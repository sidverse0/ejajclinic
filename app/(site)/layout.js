import Splash from '@/components/Splash';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import MobileBar from '@/components/MobileBar';
import ScrollUI from '@/components/ScrollUI';
import Announcement from '@/components/Announcement';

export default function SiteLayout({ children }) {
  return (
    <>
      <Splash />
      <ScrollUI />
      <a className="skip" href="#main">Skip to content</a>
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
      <WhatsAppButton />
      <MobileBar />
      <Announcement />
    </>
  );
}
