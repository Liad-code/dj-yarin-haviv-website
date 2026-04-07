import { Hero } from './components/Hero';
import { ExperienceBadge } from './components/ExperienceBadge';
import { ContactForm } from './components/ContactForm';
import { Services } from './components/Services';
import { About } from './components/About';
import { SpecialOffer } from './components/SpecialOffer';
import { Gallery } from './components/Gallery';
import { VideoGallery } from './components/VideoGallery';
import { Testimonials } from './components/Testimonials';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ExperienceBadge />
      <ContactForm />
      <About />
      <Services />
      <Testimonials />
      <SpecialOffer />
      <Gallery />
      <VideoGallery />
      <FinalCTA />
      <Footer />
    </main>
  );
}
