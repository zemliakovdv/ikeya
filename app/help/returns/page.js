// app/help/returns/page.js
import HelpLayout from '@/components/help/HelpLayout';
import ReturnsContent from '@/components/help/returns/ReturnsContent';

export default function ReturnsPage() {
  return (
    <HelpLayout breadcrumbs={[{ name: 'Правила возврата', href: null }]}>
      <ReturnsContent />
    </HelpLayout>
  );
}