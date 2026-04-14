// app/partner/page.js
import PartnerHero from '@/components/partner/PartnerHero';
import PartnerUnique from '@/components/partner/PartnerUnique';
import PartnerCreativity from '@/components/partner/PartnerCreativity';
import PartnerBenefits from '@/components/partner/PartnerBenefits';
import PartnerJoinClub from '@/components/partner/PartnerJoinClub';
import PartnerSteps from '@/components/partner/PartnerSteps';
import PartnerForm from '@/components/partner/PartnerForm';

export default function PartnerPage() {
  return (
    <main className="partner">
      <div className="partner-wrapper">
        <PartnerHero />
        <PartnerUnique />
        <PartnerCreativity />
        <PartnerBenefits />
        <PartnerJoinClub />
        <PartnerSteps />
        <PartnerForm />
      </div>
    </main>
  );
}