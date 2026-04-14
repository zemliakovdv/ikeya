// components/partner/DesignerClubForm.js
'use client';

import { useState } from 'react';

const CITIES = ['Минск', 'Брест', 'Витебск', 'Гомель', 'Гродно', 'Могилёв'];
const DESIGNER_TYPES = ['Частный дизайнер', 'Дизайнерское агентство'];

export default function DesignerClubForm() {
  const [form, setForm] = useState({
    city: '',
    designerType: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    comment: '',
    consentPersonal: false,
    consentEmail: false,
  });

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: подключить эндпоинт
  };

  return (
    <form className="designer-club-form" onSubmit={handleSubmit} noValidate>

      {/* Город / Тип дизайнера */}
      <div className="designer-form__row">
        <div className="designer-form__group">
          <select className="form-select" value={form.city} onChange={e => set('city', e.target.value)}>
            <option value="" disabled>Минск</option>
            {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>
        <div className="designer-form__group">
          <select className="form-select" value={form.designerType} onChange={e => set('designerType', e.target.value)}>
            <option value="" disabled>Частный дизайнер</option>
            {DESIGNER_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
      </div>

      {/* Имя / Фамилия */}
      <div className="designer-form__row">
        <div className="designer-form__group">
          <input type="text" className="form-control" placeholder="Имя"
            value={form.firstName} onChange={e => set('firstName', e.target.value)} />
        </div>
        <div className="designer-form__group">
          <input type="text" className="form-control" placeholder="Фамилия"
            value={form.lastName} onChange={e => set('lastName', e.target.value)} />
        </div>
      </div>

      {/* Email / Телефон */}
      <div className="designer-form__row">
        <div className="designer-form__group">
          <input type="email" className="form-control" placeholder="Email"
            value={form.email} onChange={e => set('email', e.target.value)} />
        </div>
        <div className="designer-form__group designer-form__phone">
          <div className="phone-prefix">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20Z" fill="#EAEAEA" />
              <path d="M4.13004 9.28012L3.04004 7.31012L4.13004 5.37012L5.22004 7.31012L4.13004 9.28012Z" fill="#A2001D" />
              <path fillRule="evenodd" clipRule="evenodd" d="M0.869995 7.30035L1.96 9.27035L3.05 7.30035L1.96 5.36035L0.869995 7.30035ZM3.04 12.6604L4.13 14.6304L5.22 12.6604L4.13 10.7204L3.04 12.6604Z" fill="#A2001D" />
              <path fillRule="evenodd" clipRule="evenodd" d="M5.22 1.94014L4.91 1.39014C4.36 1.72014 3.84 2.09014 3.36 2.52014L4.13 3.91014L5.22 1.94014ZM1.96 14.6401L0.869995 12.6701L1.96 10.7301L3.05 12.6701L1.96 14.6401ZM3.36 17.4701L4.13 16.0901L5.22 18.0301L4.9 18.6001C4.35 18.2701 3.83 17.8901 3.35 17.4701H3.36Z" fill="#A2001D" />
              <path d="M6.08997 12.6099V19.2099C7.32997 19.7399 8.65997 20.0099 9.99997 19.9999C14.3 19.9999 17.96 17.2899 19.38 13.4799L6.08997 12.6099Z" fill="#6DA544" />
              <path d="M19.38 13.48C19.79 12.37 20 11.19 20 10C20 4.48 15.52 0 9.99997 0C8.60997 0 7.28997 0.28 6.08997 0.79V13.48H19.38Z" fill="#A2001D" />
            </svg>
            <span>+375</span>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M8 10.22C7.25 10.22 5.47 8.19 4.1 6.5C3.95 6.31 3.97 6.03 4.17 5.87C4.36 5.72 4.64 5.75 4.79 5.94C5.99 7.43 7.53 9.1 8 9.32C8.47 9.1 10.01 7.43 11.21 5.94C11.36 5.75 11.64 5.72 11.83 5.87C12.03 6.03 12.05 6.31 11.9 6.5C10.53 8.2 8.74 10.22 8 10.22Z" fill="#757575" />
            </svg>
          </div>
          <input type="tel" className="form-control" placeholder="00 000 00 00" maxLength={9}
            value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g, ''))} />
        </div>
      </div>

      {/* Комментарий */}
      <div className="designer-form__row designer-form__comment" style={{ gridTemplateColumns: '1fr' }}>
        <div className="designer-form__group">
          <textarea className="form-control" placeholder="Комментарий"
            value={form.comment} onChange={e => set('comment', e.target.value)} />
        </div>
      </div>

      {/* Согласия */}
      <div className="designer-form__consents">
        <label className="consent-item">
          <input type="checkbox" checked={form.consentPersonal}
            onChange={e => set('consentPersonal', e.target.checked)} />
          <span>Я ознакомлен(а) и соглашаюсь с <a href="#">условиями политики обработки персональных данных</a></span>
        </label>
        <label className="consent-item">
          <input type="checkbox" checked={form.consentEmail}
            onChange={e => set('consentEmail', e.target.checked)} />
          <span>Даю согласие на получение уведомлений по условиям сотрудничества на указанный E-mail</span>
        </label>
      </div>

      {/* Кнопка */}
      <button type="submit" className="designer-form__submit">Вступить в клуб</button>

    </form>
  );
}