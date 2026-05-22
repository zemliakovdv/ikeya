// components/help/HelpLayout.js

import Breadcrumbs from '@/components/catalog/Breadcrumbs';
import HelpSidebar from '@/components/help/HelpSidebar';
import { getLegalPages } from '@/lib/api/content';

export default async function HelpLayout({ children, breadcrumbs = [] }) {
  const defaultBreadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: 'Помощь', href: '/help' },
    ...breadcrumbs,
  ];

  const legalPages = await getLegalPages();

  return (
    <main className="help-page">
      <Breadcrumbs items={defaultBreadcrumbs} />
      <section className="help-section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="help-inner">
                <HelpSidebar legalPages={legalPages} />
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