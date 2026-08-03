// lib/analytics.js

const YANDEX_METRIKA_ID = 111125185;

function trackGoal(eventName, gaParams = {}) {
  if (typeof window === 'undefined') return;

  try {
    if (typeof window.ym === 'function') {
      window.ym(YANDEX_METRIKA_ID, 'reachGoal', eventName);
    }
  } catch {}

  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, gaParams);
    }
  } catch {}
}

export function trackRegistrationCodeSent() {
  trackGoal('registration_code_sent', { form_name: 'registration' });
}

export function trackLoginCodeSent() {
  trackGoal('login_code_sent', { form_name: 'login' });
}

export function trackBeginCheckout() {
  trackGoal('begin_checkout');
}

export function trackAddToCart() {
  trackGoal('add_to_cart');
}
