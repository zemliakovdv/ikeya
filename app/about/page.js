// app/about/page.js
import AboutHero from '@/components/about/AboutHero';
import AboutIdea from '@/components/about/AboutIdea';
import AboutMission from '@/components/about/AboutMission';
import AboutAllInOne from '@/components/about/AboutAllInOne';
import AboutPartner from '@/components/about/AboutPartner';
import AboutSecurity from '@/components/about/AboutSecurity';
import AboutSupport from '@/components/about/AboutSupport';
import AboutBridge from '@/components/about/AboutBridge';

export const metadata = {
  title: 'О нас | IKEYA',
  description: 'IKEYA — интернет-магазин мебели и товаров для дома в Беларуси. Узнайте о нашей миссии, ценностях и команде.',
  alternates: { canonical: 'https://ikeya.by/about' },
  openGraph: {
    title: 'О нас | IKEYA',
    description: 'IKEYA — интернет-магазин мебели и товаров для дома в Беларуси. Узнайте о нашей миссии, ценностях и команде.',
    url: 'https://ikeya.by/about',
    siteName: 'IKEYA',
    images: [{ url: 'https://ikeya.by/assets/img/no-image.jpg', width: 1200, height: 630, alt: 'О нас | IKEYA' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'О нас | IKEYA',
    description: 'IKEYA — интернет-магазин мебели и товаров для дома в Беларуси. Узнайте о нашей миссии, ценностях и команде.',
    images: ['https://ikeya.by/assets/img/no-image.jpg'],
    url: 'https://ikeya.by/about',
  },
};

export default function AboutPage() {
  return (
    <main className="partner">
      <div className="partner-wrapper">
        <AboutHero />
        <AboutIdea />
        <AboutMission />
        <AboutAllInOne />
        <AboutPartner />
        <AboutSecurity />
        <AboutSupport />
        <AboutBridge />
      </div>
    </main>
  );
}