// app/pvz/page.js

import Breadcrumbs from '@/components/catalog/Breadcrumbs';
import PvzClient from '@/components/pvz/PvzClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Пункты выдачи | IKEYA',
  description: 'Пункты выдачи заказов IKEYA в Беларуси — Автолайт, Европочта и склад IKEYA.',
};

const BREADCRUMBS = [
  { label: 'Главная', url: '/' },
  { label: 'Пункты выдачи' },
];

export default function PvzPage() {
  return (
    <main>
      <Breadcrumbs items={BREADCRUMBS} />
      <section className="pvz">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="pvz-map">
                <h1>Пункты выдачи</h1>
                <PvzClient />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}