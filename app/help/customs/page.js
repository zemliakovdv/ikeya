// app/help/customs/page.js
import HelpLayout from '@/components/help/HelpLayout';
import CustomsContent from '@/components/help/customs/CustomsContent';

export default function CustomsPage() {
  return (
    <HelpLayout breadcrumbs={[{ name: 'Таможенная пошлина', href: null }]}>
      <CustomsContent />
    </HelpLayout>
  );
}