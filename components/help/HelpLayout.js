// components/help/HelpLayout.js
import Breadcrumbs from '@/components/catalog/Breadcrumbs';
import HelpSidebar from '@/components/help/HelpSidebar';

export default function HelpLayout({ children, breadcrumbs = [] }) {
  const defaultBreadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: 'Помощь', href: '/help' },
    ...breadcrumbs,
  ];

  return (
    <main className="help-page">
      <Breadcrumbs items={defaultBreadcrumbs} />
      <section className="help-section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="help-inner">
                <HelpSidebar />
                <div className="help-content">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}