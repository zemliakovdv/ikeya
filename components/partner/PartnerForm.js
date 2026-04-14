// components/partner/PartnerForm.js
import DesignerClubForm from '@/components/partner/DesignerClubForm';

export default function PartnerForm() {
  return (
    <section className="indaclub" id="vstupit_v_klub">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="indaclub_inner">
              <div className="indaclub-order">
                <h2 className="the_blues">
                  <span>Присоединиться</span> к Дизайн-клубу IKEYA
                </h2>
                <DesignerClubForm />
              </div>
              <div className="indaclub-banner">
                <img src="/assets/img/partner/form-banner.png" alt="Вступить в клуб" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}