'use client';

import { useEffect, useRef } from 'react';

const STEPS = [
  {
    key: 'arrived',
    title: 'Прибыл в ПВЗ Европочта',
    isEuropostStep: true,
  },
  { key: 'in-transit', title: 'В доставке ПВЗ' },
  { key: 'customs-by', title: 'Таможня Беларусь' },
  { key: 'customs-pl', title: 'Таможня Польша' },
  { key: 'assembly', title: 'Подготовка и сборка заказа' },
  { key: 'warehouse', title: 'Получен на склад Польша' },
  { key: 'created', title: 'Оформлен' },
];

function EuropostMarker({ state }) {
  return (
    <span
      className={`tracking-modal__europost tracking-modal__europost--${state}`}
      aria-hidden="true"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill="white" />
        <circle cx="12" cy="12" r="10.8" fill="white" stroke="#E53935" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="7" fill="#E53935" />
        <path d="M14.8 9.1L15.38 8.77L11.6 6.59L7.82 8.77L8.88 9.39L11.6 7.82L14.32 9.4L14.8 9.1Z" fill="white" />
        <path d="M12.05 11.17V14.44L13.11 13.82V11.72L14.8 10.75V12.85L15.88 12.23V9.04H15.87L12.05 11.17Z" fill="white" />
        <path d="M12.05 15.17V16.24H12.06L15.88 14.06V13.0L12.05 15.17Z" fill="white" />
        <path d="M11.15 16.22V15.17L8.46 13.64V12.68L11.15 14.22V13.17L8.46 11.64V10.61L11.15 12.14V11.17L8.46 9.64L7.4 9.04H7.39V13.82L11.15 16.22Z" fill="white" />
      </svg>
    </span>
  );
}

function StepMarker({ step, state }) {
  if (step.isEuropostStep) {
    return (
      <span className="tracking-modal__marker-slot" aria-hidden="true">
        <EuropostMarker state={state} />
      </span>
    );
  }

  return (
    <span className="tracking-modal__marker-slot" aria-hidden="true">
      <span
        className={`tracking-modal__marker tracking-modal__marker--${state}`}
      />
    </span>
  );
}

function getStepState(index, currentStepIndex) {
  if (index < currentStepIndex) return 'future';
  if (index === currentStepIndex) return 'current';
  return 'completed';
}

function getCurrentStepIndex(currentStepKey) {
  const currentStepIndex = STEPS.findIndex((step) => step.key === currentStepKey);
  if (currentStepIndex !== -1) {
    return currentStepIndex;
  }

  return STEPS.findIndex((step) => step.key === 'created');
}

export default function TrackingModal({ order, onClose }) {
  const previousOverflowRef = useRef('');
  const previousActiveElementRef = useRef(null);

  useEffect(() => {
    previousOverflowRef.current = document.body.style.overflow;
    previousActiveElementRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflowRef.current;

      if (previousActiveElementRef.current instanceof HTMLElement) {
        previousActiveElementRef.current.focus();
      }
    };
  }, [onClose]);

  const currentStepKey = order?.statusConfig?.trackingStep || 'created';
  const currentStepIndex = getCurrentStepIndex(currentStepKey);

  return (
    <>
      <div
        className="tracking-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tracking-modal-title"
      >
        <div className="tracking-modal__dialog">
          <div className="tracking-modal__content">
            <div className="tracking-modal__header">
              <h5 id="tracking-modal-title" className="tracking-modal__title">
                Где мой заказ
              </h5>

              <button
                type="button"
                className="tracking-modal__close"
                onClick={onClose}
                aria-label="Закрыть"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <ol className="tracking-modal__steps">
              {STEPS.map((step, index) => {
                const state = getStepState(index, currentStepIndex);
                const isLast = index === STEPS.length - 1;

                return (
                  <li
                    key={step.key}
                    className={`tracking-modal__step tracking-modal__step--${state}`}
                    aria-current={state === 'current' ? 'step' : undefined}
                  >
                    <div className="tracking-modal__marker-column">
                      <StepMarker step={step} state={state} />
                      {!isLast && <span className="tracking-modal__line" aria-hidden="true" />}
                    </div>

                    <div className="tracking-modal__step-body">
                      <span className="tracking-modal__step-title">{step.title}</span>
                      {step.key === 'arrived' && order?.dateRange ? (
                        <div className="tracking-modal__step-caption">
                          Планируемая дата получения заказа:{' '}
                          <strong>{order.dateRange}</strong>
                        </div>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="tracking-modal__backdrop"
        onClick={onClose}
        aria-label="Закрыть модальное окно"
      />
    </>
  );
}
