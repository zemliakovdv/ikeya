'use client';

const STEPS = [
  { key: 'arrived', label: 'Прибыл в ПВЗ Европочта' },
  { key: 'in-transit', label: 'В доставке ПВЗ' },
  { key: 'customs-by', label: 'Таможня Беларусь' },
  { key: 'customs-pl', label: 'Таможня Польша' },
  { key: 'warehouse', label: 'Получен на склад Польша' },
  { key: 'assembly', label: 'Подготовка и сборка заказа' },
  { key: 'created', label: 'Оформлен' },
];

const STEP_INDEX_BY_KEY = STEPS.reduce((acc, step, index) => {
  acc[step.key] = index;
  return acc;
}, {});

const EuropostCircle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="12" fill="white" />
    <circle cx="12" cy="12" r="10.8" fill="white" stroke="#E53935" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="7" fill="#E53935" />
    <path d="M14.8 9.1L15.38 8.77L11.6 6.59L7.82 8.77L8.88 9.39L11.6 7.82L14.32 9.4L14.8 9.1Z" fill="white" />
    <path d="M12.05 11.17V14.44L13.11 13.82V11.72L14.8 10.75V12.85L15.88 12.23V9.04H15.87L12.05 11.17Z" fill="white" />
    <path d="M12.05 15.17V16.24H12.06L15.88 14.06V13.0L12.05 15.17Z" fill="white" />
    <path d="M11.15 16.22V15.17L8.46 13.64V12.68L11.15 14.22V13.17L8.46 11.64V10.61L11.15 12.14V11.17L8.46 9.64L7.4 9.04H7.39V13.82L11.15 16.22Z" fill="white" />
  </svg>
);

const CurrentDot = () => (
  <div
    style={{
      width: 20,
      height: 20,
      borderRadius: '50%',
      backgroundColor: '#0058A3',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}
  >
    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#fff' }} />
  </div>
);

const PastDot = () => (
  <div
    style={{
      width: 12,
      height: 12,
      borderRadius: '50%',
      backgroundColor: '#C7C7C7',
      flexShrink: 0,
      marginTop: 4,
    }}
  />
);

export default function TrackingModal({ order, onClose }) {
  const trackingStep = order?.statusConfig?.trackingStep || 'created';
  const currentStepIndex = STEP_INDEX_BY_KEY[trackingStep] ?? STEP_INDEX_BY_KEY.created;
  const visibleSteps = STEPS.slice(currentStepIndex);

  return (
    <>
      <div
        className="modal fade show d-block"
        style={{ zIndex: 1055 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tracking-modal-title"
      >
        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 480 }}>
          <div
            className="modal-content"
            style={{
              padding: '24px 24px 32px 24px',
              borderRadius: 12,
              border: 'none',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 24,
              }}
            >
              <h5
                id="tracking-modal-title"
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                Где мой заказ
              </h5>

              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Закрыть"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {visibleSteps.map((step, idx) => {
                const isCurrent = idx === 0;
                const isLast = idx === visibleSteps.length - 1;
                const isArrived = step.key === 'arrived';

                return (
                  <div key={step.key} style={{ display: 'flex', gap: 12 }}>
                    <div
                      style={{
                        width: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {isCurrent && isArrived && <EuropostCircle />}
                      {isCurrent && !isArrived && <CurrentDot />}
                      {!isCurrent && <PastDot />}

                      {!isLast && (
                        <div
                          style={{
                            width: 1,
                            flex: 1,
                            minHeight: 20,
                            borderLeft: '2px dotted #C7C7C7',
                            margin: '4px 0',
                          }}
                        />
                      )}
                    </div>

                    <div style={{ paddingBottom: isLast ? 0 : 12, paddingTop: 1 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: isCurrent ? 600 : 400,
                          color: isCurrent ? '#0058A3' : '#6F6F6F',
                          lineHeight: '20px',
                        }}
                      >
                        {step.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1054 }}
        onClick={onClose}
      />
    </>
  );
}
