'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getProfile, snoozeEmailPrompt } from '@/lib/api/account';
import {
  EMAIL_PROMPT_SNOOZE_KEY,
  EMAIL_PROMPT_SNOOZE_MS,
  isEmailPromptDue,
  parseSnoozeTime,
} from '@/lib/emailPrompt';
import EmailPromptModal from './modals/EmailPromptModal';

function readLocalSnooze() {
  if (typeof window === 'undefined') return null;
  return parseSnoozeTime(localStorage.getItem(EMAIL_PROMPT_SNOOZE_KEY));
}

function writeLocalSnooze(iso) {
  const previous = localStorage.getItem(EMAIL_PROMPT_SNOOZE_KEY);
  if (previous === iso) return false;
  localStorage.setItem(EMAIL_PROMPT_SNOOZE_KEY, iso);
  return true;
}

function authModalOpen() {
  if (typeof document === 'undefined') return false;
  return Boolean(document.querySelector('#loginModal, #regModal, #codeModal, #succsModal'));
}

export default function EmailPromptHost() {
  const { isAuth, isHydrated, user, setUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [snoozeVersion, setSnoozeVersion] = useState(0);
  const requestRef = useRef(0);
  const suppressedRef = useRef(false);

  const rememberSnooze = useCallback((iso) => {
    if (writeLocalSnooze(iso)) setSnoozeVersion((version) => version + 1);
  }, []);

  const evaluate = useCallback(async () => {
    if (!isHydrated || !isAuth) {
      setOpen(false);
      return;
    }
    if (suppressedRef.current || authModalOpen()) return;

    const requestId = ++requestRef.current;
    try {
      const data = await getProfile();
      if (requestId !== requestRef.current || suppressedRef.current) return;

      setProfile(data);
      const serverSnooze = parseSnoozeTime(data?.email_prompt_snoozed_until);
      if (serverSnooze && serverSnooze > Date.now()) {
        rememberSnooze(data.email_prompt_snoozed_until);
      }

      const due = isEmailPromptDue({
        profile: data,
        localSnoozeUntil: readLocalSnooze(),
        role: user?.role,
        authModalOpen: authModalOpen(),
      });
      if (due) setOpen(true);
    } catch {
      // Профиль недоступен — форму не показываем.
    }
  }, [isAuth, isHydrated, rememberSnooze, user?.role]);

  useEffect(() => {
    evaluate();
  }, [evaluate]);

  useEffect(() => {
    function onVisible() {
      if (document.visibilityState === 'visible') evaluate();
    }
    window.addEventListener('auth-modal-closed', evaluate);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('auth-modal-closed', evaluate);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [evaluate]);

  useEffect(() => {
    const until = readLocalSnooze();
    if (!until || until <= Date.now()) return undefined;

    const timer = window.setTimeout(() => {
      suppressedRef.current = false;
      evaluate();
    }, until - Date.now());

    return () => window.clearTimeout(timer);
  }, [evaluate, snoozeVersion]);

  const persistSnooze = useCallback(async () => {
    suppressedRef.current = true;
    requestRef.current += 1;
    const fallback = new Date(Date.now() + EMAIL_PROMPT_SNOOZE_MS).toISOString();
    rememberSnooze(fallback);
    try {
      const updated = await snoozeEmailPrompt();
      if (updated?.email_prompt_snoozed_until) rememberSnooze(updated.email_prompt_snoozed_until);
      setProfile(updated);
    } catch {
      // Локальный таймер уже записан: форма не всплывёт до следующей недели.
    }
  }, [rememberSnooze]);

  async function handleSnooze() {
    setOpen(false);
    await persistSnooze();
  }

  async function handleSaved(updated) {
    if (updated) {
      setProfile(updated);
      setUser({
        ...(user || {}),
        email: updated.email,
        email_verified: updated.email_verified,
      });
    }
    await persistSnooze();
  }

  if (!open || !profile) return null;

  return (
    <EmailPromptModal
      profile={profile}
      onSnooze={handleSnooze}
      onSaved={handleSaved}
      onDismiss={() => setOpen(false)}
    />
  );
}
