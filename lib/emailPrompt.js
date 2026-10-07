export const EMAIL_PROMPT_SNOOZE_MS = 7 * 24 * 60 * 60 * 1000;
export const EMAIL_PROMPT_SNOOZE_KEY = 'email_prompt_snoozed_until';

export function parseSnoozeTime(value) {
  const ts = Date.parse(value || '');
  return Number.isFinite(ts) ? ts : null;
}

export function isEmailPromptDue({
  profile,
  now = Date.now(),
  localSnoozeUntil = null,
  role = 'user',
  authModalOpen = false,
} = {}) {
  if (authModalOpen) return false;
  if (role && role !== 'user') return false;
  if (localSnoozeUntil != null && localSnoozeUntil > now) return false;
  return profile?.email_prompt_due === true;
}
