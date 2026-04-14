// app/about/page.js
import AboutHero from '@/components/about/AboutHero';
import AboutIdea from '@/components/about/AboutIdea';
import AboutMission from '@/components/about/AboutMission';
import AboutAllInOne from '@/components/about/AboutAllInOne';
import AboutPartner from '@/components/about/AboutPartner';
import AboutSecurity from '@/components/about/AboutSecurity';
import AboutSupport from '@/components/about/AboutSupport';
import AboutBridge from '@/components/about/AboutBridge';

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