/**
 * Static phone-call verification code from API when Asterisk is disabled.
 * Backend returns { mode: 'static', code: '5806' } only in that case.
 */
export function extractStaticVerificationCode(resp) {
  if (resp?.mode === 'static' && /^\d{4}$/.test(String(resp?.code || ''))) {
    return String(resp.code);
  }
  return null;
}
