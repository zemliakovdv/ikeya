'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { resolvePaymentUrl } from '@/lib/utils/paymentUrl';
import TrackingModal from '@/components/profile/TrackingModal';

const TEXT = {
  delivery: '\u0414\u043e\u0441\u0442\u0430\u0432\u043a\u0430',
  trackNumber: '\u0422\u0440\u0435\u043a-\u043d\u043e\u043c\u0435\u0440',
  copied: '\u0421\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u043d\u043e',
  copyTrack: '\u0421\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0442\u0440\u0435\u043a-\u043d\u043e\u043c\u0435\u0440',
  track: '\u041e\u0442\u0441\u043b\u0435\u0434\u0438\u0442\u044c',
  whereIsOrder: '\u0413\u0434\u0435 \u043c\u043e\u0439 \u0437\u0430\u043a\u0430\u0437',
  trackInfo:
    '\u0412\u044b\u0434\u0430\u0447\u0430 \u0437\u0430\u043a\u0430\u0437\u043e\u0432 \u043e\u0441\u0443\u0449\u0435\u0441\u0442\u0432\u043b\u044f\u0435\u0442\u0441\u044f \u043f\u043e \u0442\u0440\u0435\u043a-\u043d\u043e\u043c\u0435\u0440\u0443 \u0438 \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0443, \u0443\u0434\u043e\u0441\u0442\u043e\u0432\u0435\u0440\u044f\u044e\u0449\u0435\u043c\u0443 \u043b\u0438\u0447\u043d\u043e\u0441\u0442\u044c.',
  orderInfo:
    '\u0412\u044b\u0434\u0430\u0447\u0430 \u0437\u0430\u043a\u0430\u0437\u043e\u0432 \u043e\u0441\u0443\u0449\u0435\u0441\u0442\u0432\u043b\u044f\u0435\u0442\u0441\u044f \u043f\u043e \u043d\u043e\u043c\u0435\u0440\u0443 \u0437\u0430\u043a\u0430\u0437\u0430 \u0438 \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0443, \u0443\u0434\u043e\u0441\u0442\u043e\u0432\u0435\u0440\u044f\u044e\u0449\u0435\u043c\u0443 \u043b\u0438\u0447\u043d\u043e\u0441\u0442\u044c.',
  draftInfo:
    '\u0417\u0430\u043a\u0430\u0437 \u043e\u0436\u0438\u0434\u0430\u0435\u0442 \u043e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u0438\u044f. \u0412\u044b \u043c\u043e\u0436\u0435\u0442\u0435 \u043f\u0440\u043e\u0434\u043e\u043b\u0436\u0438\u0442\u044c \u0432 \u043b\u044e\u0431\u043e\u0439 \u043c\u043e\u043c\u0435\u043d\u0442.',
  continueCheckout: '\u041f\u0440\u043e\u0434\u043e\u043b\u0436\u0438\u0442\u044c \u043e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u0438\u0435',
  awaitingPayment: '\u0417\u0430\u043a\u0430\u0437 \u043e\u0436\u0438\u0434\u0430\u0435\u0442 \u043e\u043f\u043b\u0430\u0442\u044b',
  paymentHint:
    '\u0421\u043a\u043e\u043f\u0438\u0440\u0443\u0439\u0442\u0435 \u043a\u043e\u0434 \u0437\u0430\u043a\u0430\u0437\u0430 \u0434\u043b\u044f \u0443\u0434\u043e\u0431\u0441\u0442\u0432\u0430 \u043e\u043f\u043b\u0430\u0442\u044b. \u0410\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0430\u044f \u043e\u0442\u043c\u0435\u043d\u0430 \u0437\u0430\u043a\u0430\u0437\u0430 \u043f\u0440\u043e\u0438\u0441\u0445\u043e\u0434\u0438\u0442 \u0441\u0440\u0430\u0437\u0443 \u043f\u043e\u0441\u043b\u0435 \u0438\u0441\u0442\u0435\u0447\u0435\u043d\u0438\u044f \u0441\u0440\u043e\u043a\u0430 \u043e\u043f\u043b\u0430\u0442\u044b.',
  payOrder: '\u041e\u043f\u043b\u0430\u0442\u0438\u0442\u044c \u0437\u0430\u043a\u0430\u0437',
  orderPrefix: '\u0417\u0430\u043a\u0430\u0437 \u2116',
  copyOrder: '\u0421\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u043d\u043e\u043c\u0435\u0440 \u0437\u0430\u043a\u0430\u0437\u0430',
  from: '\u043e\u0442',
  plannedDate: '\u041f\u043b\u0430\u043d\u0438\u0440\u0443\u0435\u043c\u0430\u044f \u0434\u0430\u0442\u0430 \u043f\u043e\u043b\u0443\u0447\u0435\u043d\u0438\u044f \u0437\u0430\u043a\u0430\u0437\u0430:',
  rubles: '\u0440.',
  product: '\u0422\u043e\u0432\u0430\u0440',
  pcs: '\u0448\u0442',
  itemsUnavailable: '\u0421\u043f\u0438\u0441\u043e\u043a \u0442\u043e\u0432\u0430\u0440\u043e\u0432 \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u0435\u043d',
};

const serviceStyles = {
  row: {
    display: 'flex',
    gap: '16px',
    padding: '12px 16px',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  leftGroup: {
    display: 'flex',
    gap: '16px',
    flex: '0 1 466px',
    width: '100%',
    maxWidth: '466px',
    minWidth: '280px',
    flexWrap: 'wrap',
    alignItems: 'stretch',
  },
  compactButton: {
    width: '100%',
    maxWidth: 'fit-content',
    minHeight: '48px',
    border: 'none',
    borderRadius: '4px',
    background: '#FAFAFA',
    padding: '12px 8px 12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textAlign: 'left',
    cursor: 'pointer',
  },
  smallCard: {
    flex: '1 1 calc(50% - 8px)',
    minWidth: '220px',
    minHeight: '72px',
    position: 'relative',
    borderRadius: '4px',
    background: '#FAFAFA',
    padding: '12px 8px 12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    boxSizing: 'border-box',
  },
  infoCard: {
    flex: '1 1 320px',
    minWidth: '280px',
    minHeight: '72px',
    borderRadius: '8px',
    background: '#FAFAFA',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    boxSizing: 'border-box',
  },
  fullWidthInfoCard: {
    flex: '1 1 100%',
    minWidth: '100%',
  },
  cardMain: {
    minWidth: 0,
    flex: '1 1 auto',
  },
  title: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 600,
    color: '#181818',
    overflowWrap: 'anywhere',
    wordBreak: 'break-word',
  },
  subtitle: {
    fontSize: '14px',
    lineHeight: '20px',
    color: '#757575',
    overflowWrap: 'anywhere',
    wordBreak: 'break-word',
  },
  infoText: {
    fontSize: '14px',
    lineHeight: '20px',
    color: '#181818',
  },
  iconButton: {
    marginLeft: '8px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0 4px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '0 0 auto',
  },
  linkCard: {
    color: 'inherit',
    textDecoration: 'none',
  },
  cardIcon: {
    flex: '0 0 auto',
  },
  copyFeedback: {
    position: 'absolute',
    top: '8px',
    right: '12px',
    zIndex: 2,
    background: '#FFFFFF',
    color: '#00910A',
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: 600,
    padding: '2px 6px',
    borderRadius: '4px',
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
  },
};

function pad(n) {
  return String(n).padStart(2, '0');
}

function useCountdown(initialSeconds) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds ?? null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (initialSeconds === null || initialSeconds === undefined || initialSeconds <= 0) {
      setTimeLeft(null);
      return undefined;
    }

    setTimeLeft(initialSeconds);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (!prev || prev <= 1) {
          clearInterval(timerRef.current);
          return null;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [initialSeconds]);

  if (!timeLeft) return null;

  return `${pad(Math.floor(timeLeft / 60))}:${pad(timeLeft % 60)}`;
}

function InfoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM12.7 15.72C12.7 16.11 12.39 16.42 12 16.42C11.61 16.42 11.3 16.11 11.3 15.72V11.53C11.3 11.14 11.61 10.83 12 10.83C12.39 10.83 12.7 11.14 12.7 11.53V15.72ZM12 9.12C11.54 9.12 11.16 8.75 11.16 8.29C11.16 7.82 11.53 7.44 12 7.44C12.47 7.44 12.84 7.81 12.84 8.28C12.84 8.75 12.47 9.12 12 9.12Z" fill="#0058A3" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M20.98 9.53C20.18 8.73 19.08 8.56 17.35 8.52C17.34 6.08 17.22 4.68 16.35 3.61C16.17 3.39 15.96 3.18 15.74 3C14.52 2 12.9 2 9.68001 2C6.46001 2 4.84001 2 3.62001 3C3.40001 3.18 3.19001 3.39 3.01001 3.61C2.01001 4.83 2.01001 6.45 2.01001 9.67C2.01001 12.89 2.01001 14.51 3.01001 15.73C3.19001 15.95 3.40001 16.16 3.62001 16.34C4.69001 17.22 6.09001 17.33 8.53001 17.34C8.57001 19.08 8.74001 20.18 9.54001 20.97C10.56 21.99 12.07 21.99 14.8 21.99H15.73C18.46 21.99 19.97 21.99 20.99 20.97C22.01 19.95 22.01 18.44 22.01 15.71V14.78C22.01 12.05 22.01 10.54 20.99 9.52L20.98 9.53ZM4.50001 15.27C4.35001 15.15 4.21001 15 4.08001 14.85C3.39001 14.01 3.39001 12.56 3.39001 9.68C3.39001 6.8 3.39001 5.34 4.08001 4.51C4.21001 4.36 4.35001 4.22 4.50001 4.09C5.34001 3.4 6.79001 3.4 9.67001 3.4C12.55 3.4 14.01 3.4 14.84 4.09C14.99 4.21 15.13 4.36 15.26 4.51C15.85 5.23 15.93 6.42 15.94 8.52C15.86 8.52 15.79 8.52 15.71 8.52H14.78C12.05 8.52 10.54 8.52 9.52001 9.54C8.50001 10.56 8.50001 12.07 8.50001 14.8V15.73C8.50001 15.81 8.50001 15.88 8.50001 15.96C6.24001 15.94 5.18001 15.84 4.49001 15.28L4.50001 15.27ZM20.6 15.72C20.6 18.16 20.6 19.38 19.99 19.99C19.38 20.6 18.15 20.6 15.72 20.6H14.79C12.35 20.6 11.13 20.6 10.52 19.99C9.91001 19.38 9.91001 18.15 9.91001 15.72V14.79C9.91001 12.35 9.91001 11.13 10.52 10.52C11.13 9.91 12.36 9.91 14.79 9.91H15.72C18.15 9.91 19.38 9.91 19.99 10.52C20.6 11.13 20.6 12.36 20.6 14.79V15.72Z" fill="#BDBDBD" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M16.1417 3.83329L13.8751 2.73329C12.4001 2.01663 11.6584 1.66663 10.7751 1.66663C9.89175 1.66663 9.15008 2.02496 7.67508 2.74163L5.40841 3.84163C4.00008 4.52496 3.21675 4.89996 3.21675 5.74163V8.06663C3.21675 8.39163 3.47508 8.64996 3.80008 8.64996C4.12508 8.64996 4.38341 8.39163 4.38341 8.06663V7.12496C4.67508 7.28329 5.01675 7.44996 5.41675 7.64163L7.68341 8.73329C8.83341 9.29163 9.53341 9.62496 10.2001 9.74996V17.075C9.80008 16.9583 9.30008 16.7416 8.55841 16.425C7.18341 15.825 6.10008 15.35 5.37508 14.925C5.28341 14.875 5.18341 14.8416 5.08341 14.8416H2.25008C1.92508 14.8416 1.66675 15.1 1.66675 15.425C1.66675 15.75 1.92508 16.0083 2.25008 16.0083H4.92508C5.70008 16.45 6.76675 16.9166 8.10008 17.4916C9.38341 18.05 10.0251 18.3333 10.7834 18.3333C11.5417 18.3333 12.1834 18.05 13.4667 17.4916C16.7084 16.075 18.3417 15.3666 18.3417 13.875V5.73329C18.3417 4.89163 17.5667 4.51663 16.1501 3.83329H16.1417ZM4.38341 5.76663C4.48341 5.57496 5.21675 5.22496 5.91675 4.88329L8.18341 3.78329C10.8084 2.51663 10.7334 2.50829 13.3667 3.78329L13.4167 3.80829L6.79175 7.01663L5.90841 6.59163C5.20008 6.24996 4.47508 5.89996 4.37508 5.76663H4.38341ZM8.13341 7.65829L14.7584 4.44996L15.6417 4.87496C16.3501 5.21663 17.0917 5.57496 17.1834 5.69996C17.0917 5.87496 16.3584 6.23329 15.6417 6.58329L13.3751 7.67496C10.7417 8.94996 10.8167 8.94996 8.18341 7.67496L8.13341 7.64996V7.65829ZM13.0001 16.425C12.2584 16.75 11.7584 16.9666 11.3584 17.075V9.74996C12.0334 9.62496 12.7334 9.29163 13.8751 8.73329L16.1417 7.64163C16.5417 7.44996 16.8751 7.28329 17.1751 7.12496V13.8833C17.1751 14.6083 15.6001 15.3 13.0001 16.4333V16.425Z" fill="#181818" />
      <path d="M2.25008 11.3583H4.57508C4.90008 11.3583 5.15841 11.1 5.15841 10.775C5.15841 10.45 4.90008 10.1917 4.57508 10.1917H2.25008C1.92508 10.1917 1.66675 10.45 1.66675 10.775C1.66675 11.1 1.92508 11.3583 2.25008 11.3583Z" fill="#181818" />
      <path d="M2.25008 13.6834H4.57508C4.90008 13.6834 5.15841 13.4251 5.15841 13.1001C5.15841 12.7751 4.90008 12.5167 4.57508 12.5167H2.25008C1.92508 12.5167 1.66675 12.7751 1.66675 13.1001C1.66675 13.4251 1.92508 13.6834 2.25008 13.6834Z" fill="#181818" />
    </svg>
  );
}

function DeliveryServiceIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 7.75C3 6.78 3.78 6 4.75 6H13.25C14.22 6 15 6.78 15 7.75V14.25C15 15.22 14.22 16 13.25 16H12.72C12.39 17.16 11.33 18 10.08 18C8.84 18 7.77 17.16 7.44 16H6.75C5.78 16 5 15.22 5 14.25V13.75C5 13.34 5.34 13 5.75 13C6.16 13 6.5 13.34 6.5 13.75V14.25C6.5 14.39 6.61 14.5 6.75 14.5H7.44C7.77 13.34 8.84 12.5 10.08 12.5C11.33 12.5 12.39 13.34 12.72 14.5H13.25C13.39 14.5 13.5 14.39 13.5 14.25V7.75C13.5 7.61 13.39 7.5 13.25 7.5H4.75C4.61 7.5 4.5 7.61 4.5 7.75V9.75C4.5 10.16 4.16 10.5 3.75 10.5C3.34 10.5 3 10.16 3 9.75V7.75Z" fill="#181818"/>
      <path d="M15 9.25C15 8.56 15.56 8 16.25 8H17.77C18.22 8 18.64 8.24 18.86 8.63L20.59 11.67C20.72 11.9 20.79 12.16 20.79 12.42V14.25C20.79 15.22 20.01 16 19.04 16H18.81C18.48 17.16 17.42 18 16.17 18C14.92 18 13.86 17.16 13.53 16H13.25C12.84 16 12.5 15.66 12.5 15.25C12.5 14.84 12.84 14.5 13.25 14.5H13.53C13.86 13.34 14.92 12.5 16.17 12.5C17.42 12.5 18.48 13.34 18.81 14.5H19.04C19.18 14.5 19.29 14.39 19.29 14.25V12.65L17.56 9.62C17.53 9.57 17.47 9.53 17.4 9.53H16.5V10.75C16.5 11.16 16.16 11.5 15.75 11.5C15.34 11.5 15 11.16 15 10.75V9.25Z" fill="#181818"/>
      <path d="M10.08 16.5C10.63 16.5 11.08 16.05 11.08 15.5C11.08 14.95 10.63 14.5 10.08 14.5C9.52 14.5 9.08 14.95 9.08 15.5C9.08 16.05 9.52 16.5 10.08 16.5Z" fill="#181818"/>
      <path d="M16.17 16.5C16.72 16.5 17.17 16.05 17.17 15.5C17.17 14.95 16.72 14.5 16.17 14.5C15.61 14.5 15.17 14.95 15.17 15.5C15.17 16.05 15.61 16.5 16.17 16.5Z" fill="#181818"/>
    </svg>
  );
}

function EvropochtaIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M24 12C24 18.6267 18.6267 24 12 24C5.37333 24 0 18.6267 0 12C0 5.37333 5.37333 0 12 0C18.6267 0 24 5.37333 24 12Z" fill="white"/>
      <path d="M22.8 12C22.8 17.9667 17.9667 22.8 12 22.8C6.03333 22.8 1.2 17.9667 1.2 12C1.2 6.03333 6.03333 1.2 12 1.2C17.9667 1.2 22.8 6.03333 22.8 12Z" fill="#FF0000"/>
      <path d="M16.3933 8.81333L17.1733 8.36667L12.1333 5.45333L7.09333 8.36667L8.56 9.19333L12.1333 7.09333L15.7067 9.2L16.3933 8.81333Z" fill="white"/>
      <path d="M12.7333 11.96V16.2533L14.1867 15.4133V12.52L16.3933 11.26V14.14L17.8533 13.3V9.04667H17.84L12.7333 11.96Z" fill="white"/>
      <path d="M12.7333 17.2267V18.6733H12.74L17.8533 15.7467V14.2867L12.7333 17.2267Z" fill="white"/>
      <path d="M11.54 18.6333V17.24V17.26L7.87333 15.16V13.8533L11.54 15.96V14.6333L7.87333 12.5333V11.1933L11.54 13.2867V11.96L7.87333 9.87333L6.42667 9.04667H6.41333V15.68L11.54 18.6333Z" fill="white"/>
    </svg>
  );
}

function firstImageFromValue(value) {
  if (Array.isArray(value)) return value[0] || null;
  return value || null;
}

function getOrderItemImage(item = {}) {
  return (
    item.image ||
    item.image_url ||
    item.local_image ||
    firstImageFromValue(item.local_images) ||
    firstImageFromValue(item.images?.local_images) ||
    firstImageFromValue(item.images?.images) ||
    item.attributes?.image_url ||
    item.product?.image ||
    item.product?.image_url ||
    firstImageFromValue(item.product?.local_images) ||
    firstImageFromValue(item.product?.images?.local_images) ||
    firstImageFromValue(item.product?.images?.images) ||
    null
  );
}

function ArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M12.78 10C12.78 10.93 10.24 13.17 8.13 14.88C7.88 15.07 7.53 15.03 7.34 14.79C7.15 14.55 7.18 14.2 7.43 14.01C9.28 12.51 11.38 10.59 11.65 10C11.38 9.41 9.28 7.49 7.43 5.99C7.18 5.8 7.15 5.45 7.34 5.21C7.53 4.97 7.88 4.93 8.13 5.12C10.25 6.83 12.78 9.07 12.78 10Z"
        fill="#BDBDBD"
      />
    </svg>
  );
}

function getDeliveryProvider(order = {}) {
  return (
    order.deliveryProvider ||
    order.deliveryName ||
    order.deliveryMethod ||
    order.deliveryType ||
    ''
  );
}

function isEuropochtaDelivery(value) {
  const normalized = String(value || '').toLowerCase();
  return (
    normalized.includes('европочт') ||
    normalized.includes('europost') ||
    normalized.includes('evropochta')
  );
}

function getDeliveryProviderLabel(order = {}) {
  const provider = getDeliveryProvider(order);
  return isEuropochtaDelivery(provider) ? 'Европочта' : (provider || TEXT.delivery);
}

function getTrackingUrl(order = {}) {
  const provider = getDeliveryProvider(order);

  if (isEuropochtaDelivery(provider)) return 'https://evropochta.by/';

  return '';
}

function renderTrackingIcon(order = {}) {
  if (isEuropochtaDelivery(getDeliveryProvider(order))) {
    return <EvropochtaIcon />;
  }

  return <DeliveryServiceIcon />;
}

function shouldShowWhereIsMyOrder(order = {}) {
  return order.statusConfig?.whereIsVisible === true;
}

function shouldShowTrackingBlock(order = {}) {
  return Boolean(
    order.trackNumber &&
    order.statusConfig?.trackingVisible === true
  );
}

function shouldShowOrderNumberInfo(order = {}) {
  return order.statusConfig?.pvzInfoVisible === true;
}

const OrderCard = ({ order }) => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [trackCopied, setTrackCopied] = useState(false);
  const [showTracking, setShowTracking] = useState(false);

  const countdown = useCountdown(order.paymentSecondsLeft);
  const paymentUrl = resolvePaymentUrl(order.paymentUrl) || order.paymentUrl || null;

  const shouldShowPaymentBlock = Boolean(
    !order.isDraft &&
    !order.paymentExpired &&
    paymentUrl &&
      (order.isAwaitingPayment === true ||
        order.status === 'awaiting' ||
        order.rawStatus === 'created' ||
        order.rawStatus === 'processing')
  );

  function handleCopy() {
    const value = order.id || order.publicUid || order.draftId;
    if (!value) return;

    navigator.clipboard.writeText(String(value)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleTrackCopy() {
    if (!shouldShowTrackingBlock(order)) return;

    navigator.clipboard.writeText(String(order.trackNumber)).then(() => {
      setTrackCopied(true);
      setTimeout(() => setTrackCopied(false), 2000);
    });
  }

  function renderTrackNumberCard() {
    if (!shouldShowTrackingBlock(order)) return null;

    return (
      <div style={serviceStyles.smallCard}>
        {trackCopied ? (
          <span style={serviceStyles.copyFeedback}>{TEXT.copied}</span>
        ) : null}

        <div style={serviceStyles.cardMain}>
          <div style={serviceStyles.title}>{order.trackNumber}</div>
          <div style={serviceStyles.subtitle}>{TEXT.trackNumber}</div>
        </div>

        <button
          className="btn-copy-order"
          onClick={handleTrackCopy}
          title={trackCopied ? TEXT.copied : TEXT.copyTrack}
          aria-label={trackCopied ? TEXT.copied : TEXT.copyTrack}
          type="button"
          style={serviceStyles.iconButton}
        >
          <CopyIcon />
        </button>
      </div>
    );
  }

  function renderTrackingCard() {
    if (!shouldShowTrackingBlock(order)) return null;

    const trackingUrl = getTrackingUrl(order);

    const content = (
      <>
        <div style={serviceStyles.cardIcon}>
          {renderTrackingIcon(order)}
        </div>
        <div style={serviceStyles.cardMain}>
          <div style={serviceStyles.title}>{TEXT.track}</div>
          <div style={serviceStyles.subtitle}>{getDeliveryProviderLabel(order)}</div>
        </div>
        <ArrowIcon />
      </>
    );

    if (trackingUrl) {
      return (
        <a
          href={trackingUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...serviceStyles.smallCard, ...serviceStyles.linkCard }}
        >
          {content}
        </a>
      );
    }

    return <div style={serviceStyles.smallCard}>{content}</div>;
  }

  function renderTrackInfoCard() {
    if (!shouldShowTrackingBlock(order)) return null;

    return (
      <div style={serviceStyles.infoCard}>
        <InfoIcon />
        <div style={serviceStyles.infoText}>{TEXT.trackInfo}</div>
      </div>
    );
  }

  function renderOrderNumberInfoCard() {
    if (!shouldShowOrderNumberInfo(order)) return null;

    return (
      <div style={serviceStyles.row}>
        <div style={{ ...serviceStyles.infoCard, ...serviceStyles.fullWidthInfoCard }}>
          <InfoIcon />
          <div style={serviceStyles.infoText}>{TEXT.orderInfo}</div>
        </div>
      </div>
    );
  }

  function renderWhereIsMyOrderCard() {
    if (!shouldShowWhereIsMyOrder(order)) return null;

    return (
      <div style={serviceStyles.row}>
        <button type="button" onClick={() => setShowTracking(true)} style={serviceStyles.compactButton}>
          <PackageIcon />
          <div style={{ ...serviceStyles.title, flex: '1 1 auto' }}>{TEXT.whereIsOrder}</div>
          <ArrowIcon />
        </button>
      </div>
    );
  }

  function renderOrderServiceBlocks() {
    if (shouldShowTrackingBlock(order)) {
      return (
        <>
          <div style={serviceStyles.row}>
            <div style={serviceStyles.leftGroup}>
              {renderTrackNumberCard()}
              {renderTrackingCard()}
            </div>
            {renderTrackInfoCard()}
          </div>
          {shouldShowOrderNumberInfo(order) ? renderOrderNumberInfoCard() : null}
        </>
      );
    }

    if (shouldShowOrderNumberInfo(order)) {
      return renderOrderNumberInfoCard();
    }

    if (shouldShowWhereIsMyOrder(order)) {
      return renderWhereIsMyOrderCard();
    }

    return null;
  }

  function renderDraftStatus() {
    return (
      <div className="order-status">
        <div className="order-status-content">
          <div className="order-status-inner">
            <InfoIcon />
            <div className="status-text">{TEXT.draftInfo}</div>
          </div>

          <div className="order-actions">
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => router.push(`/checkout?draft_id=${order.draftId || order.id}`)}
            >
              {TEXT.continueCheckout}
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderPaymentStatus() {
    return (
      <div className="order-status">
        <div className="order-status-content">
          <div className="order-status-inner">
            <InfoIcon color="#B71C1C" />

            <div className="status-text">
              {TEXT.awaitingPayment}
              {countdown && <> <strong className="timer-value">{countdown}.</strong></>}
              {' '}
              <span>{TEXT.paymentHint}</span>
            </div>
          </div>

          <div className="order-actions">
            <a href={paymentUrl} target="_blank" rel="noopener noreferrer" className="btn btn-danger">
              {TEXT.payOrder}
            </a>
          </div>
        </div>
      </div>
    );
  }

  function renderStatusSection() {
    if (order.isDraft) return renderDraftStatus();
    if (shouldShowPaymentBlock) return renderPaymentStatus();
    return null;
  }

  function getBadgeClass() {
    if (order.isDraft) return 'badge-assembly';
    return order.statusConfig?.badgeClass || '';
  }

  return (
    <div className="order-card">
      <div className="order-header">
        <div className="odrer-header_inner">
          <div className="order-header_top">
            <div className="order-title">
              {TEXT.orderPrefix} {order.id}

              <button
                className="btn-copy-order"
                onClick={handleCopy}
                title={TEXT.copyOrder}
                type="button"
                style={serviceStyles.iconButton}
              >
                {copied ? (
                  <span style={{ color: '#00910A', fontSize: 14 }}>{TEXT.copied}</span>
                ) : (
                  <CopyIcon />
                )}
              </button>

              {' '}{TEXT.from} {order.date}
            </div>

            <div className={`order-badge ${getBadgeClass()}`}>
              {order.statusDescription || order.status}
            </div>
          </div>

          {!order.isDraft && order.dateRange && order.dateRange !== '—' && (
            <div className="order-subtitle">
              {TEXT.plannedDate} <span className="order_the_date">{order.dateRange}</span>
            </div>
          )}
        </div>

        <div className="order-price">{order.price} {TEXT.rubles}</div>
      </div>

      {renderStatusSection()}
      {renderOrderServiceBlocks()}

      <div className="order-items">
        {order.items?.length > 0 ? (
          order.items.map((item, idx) => (
            item.product_sku ? (
              <Link
                key={`${item.product_sku || item.desc || item.name || 'item'}-${idx}`}
                href={`/product/${item.product_sku}`}
                className="order-item"
              >
                <img
                  src={getOrderItemImage(item) || '/assets/img/profile/active_1.png'}
                  alt={item.name || TEXT.product}
                  className="item-image"
                  onError={(event) => {
                    event.currentTarget.src = '/assets/img/profile/active_1.png';
                  }}
                />

                <div className="flex-grow-1">
                  <div className="item-infos">
                    <div className="item-name">{item.name}</div>
                    {item.desc && <div className="item-desc">{item.desc}</div>}
                  </div>

                  <div className="item-meta">
                    <span className="item-quantity">{item.quantity} {TEXT.pcs}</span>
                    <span className="item-price">{item.price} {TEXT.rubles}</span>
                  </div>
                </div>
              </Link>
            ) : (
              <div key={`${item.desc || item.name || 'item'}-${idx}`} className="order-item">
                <img
                  src={getOrderItemImage(item) || '/assets/img/profile/active_1.png'}
                  alt={item.name || TEXT.product}
                  className="item-image"
                  onError={(event) => {
                    event.currentTarget.src = '/assets/img/profile/active_1.png';
                  }}
                />

                <div className="flex-grow-1">
                  <div className="item-infos">
                    <div className="item-name">{item.name}</div>
                    {item.desc && <div className="item-desc">{item.desc}</div>}
                  </div>

                  <div className="item-meta">
                    <span className="item-quantity">{item.quantity} {TEXT.pcs}</span>
                    <span className="item-price">{item.price} {TEXT.rubles}</span>
                  </div>
                </div>
              </div>
            )
          ))
        ) : (
          <div className="order-item-empty" style={{ color: '#9e9e9e', padding: '8px 0' }}>
            {TEXT.itemsUnavailable}
          </div>
        )}
      </div>

      {showTracking && (
        <TrackingModal
          order={order}
          onClose={() => setShowTracking(false)}
        />
      )}
    </div>
  );
};

export default function ActiveOrders({ orders }) {
  if (!orders || orders.length === 0) return null;

  return (
    <>
      {orders.map((order) => (
        <OrderCard key={order.draftId || order.id} order={order} />
      ))}
    </>
  );
}
