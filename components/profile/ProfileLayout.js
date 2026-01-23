'use client';

import Breadcrumbs from './Breadcrumbs';
import ProfileSidebar from './ProfileSidebar';

export default function ProfileLayout({ children, breadcrumbs }) {
  return (
    <main className="zakazi">
      <Breadcrumbs items={breadcrumbs} />
      
      <section className="orders-page">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="page">
                <div className="profile-layout">
                  <ProfileSidebar />
                  <div className="profile-content">
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
