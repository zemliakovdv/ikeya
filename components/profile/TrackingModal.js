'use client';

// components/profile/TrackingModal.js

const STEPS = [
  { key: 'created',      label: 'Оформлен' },
  { key: 'assembly',     label: 'Подготовка и сборка заказа' },
  { key: 'warehouse',    label: 'Получен на склад Польша' },
  { key: 'customs-pl',   label: 'Таможня Польша' },
  { key: 'customs-by',   label: 'Таможня Беларусь' },
  { key: 'in-transit',   label: 'В доставке ПВЗ' },
  { key: 'arrived',      label: 'Прибыл в ПВЗ Европочта' },
];

// Маппинг статуса заказа → индекс текущего шага
const STATUS_TO_STEP = {
  'awaiting':        1,
  'assembly':        1,
  'transit':         2,
  'customs-belarus': 4,
  'in-transit-pvz':  5,
  'arrived-pvz':     6,
};

function StepIcon({ state }) {
  // state: 'done' | 'current' | 'future'
  if (state === 'current') {
    return (
      <div style={{
        width: 20, height: 20, borderRadius: '50%',
        backgroundColor: '#0058A3',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#fff' }} />
      </div>
    );
  }
  if (state === 'done') {
    return (
      <div style={{
        width: 20, height: 20, borderRadius: '50%',
        backgroundColor: '#fff',
        border: '2px solid #E53935',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
          <path d="M16.3933 8.81333L17.1733 8.36667L12.1333 5.45333L7.09333 8.36667L8.56 9.19333L12.1333 7.09333L15.7067 9.2L16.3933 8.81333Z" fill="#E53935" />
          <path d="M12.7333 11.96V16.2533L14.1867 15.4133V12.52L16.3933 11.26V14.14L17.8533 13.3V9.04667H17.84L12.7333 11.96Z" fill="#E53935" />
          <path d="M12.7333 17.2267V18.6733H12.74L17.8533 15.7467V14.2867L12.7333 17.2267Z" fill="#E53935" />
          <path d="M11.54 18.6333V17.24L7.87333 15.16V13.8533L11.54 15.96V14.6333L7.87333 12.5333V11.1933L11.54 13.2867V11.96L7.87333 9.87333L6.42667 9.04667H6.41333V15.68L11.54 18.6333Z" fill="#E53935" />
        </svg>
      </div>
    );
  }
  // future
  return (
    <div style={{
      width: 20, height: 20, borderRadius: '50%',
      backgroundColor: '#E0E0E0',
      flexShrink: 0,
    }} />
  );
}

export default function TrackingModal({ order, onClose }) {
  const currentStepIndex = STATUS_TO_STEP[order.status] ?? 0;
  const deliveryDate = order.dateRange;

  return (
    <>
      <div
        className="modal fade show d-block"
        style={{ zIndex: 1055 }}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          style={{ maxWidth: 480 }}
        >
          <div className="modal-content" style={{ padding: '24px 24px 32px 24px', borderRadius: 12 }}>

            {/* Заголовок */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h5 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Где мой заказ</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Закрыть"
              />
            </div>

            {/* Дата получения */}
            {deliveryDate && (
              <div style={{
                backgroundColor: '#E3F2FD',
                borderRadius: 8,
                padding: '10px 14px',
                marginBottom: 24,
                fontSize: 14,
                color: '#0058A3',
              }}>
                Планируемая дата получения заказа: <strong>{deliveryDate}</strong>
              </div>
            )}

            {/* Шаги */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {STEPS.map((step, idx) => {
                const state = idx < currentStepIndex
                  ? 'done'
                  : idx === currentStepIndex
                    ? 'current'
                    : 'future';

                const isLast = idx === STEPS.length - 1;

                return (
                  <div key={step.key} style={{ display: 'flex', gap: 12 }}>
                    {/* Иконка + линия */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <StepIcon state={state} />
                      {!isLast && (
                        <div style={{
                          width: 2,
                          flex: 1,
                          minHeight: 24,
                          backgroundColor: idx < currentStepIndex ? '#E53935' : '#E0E0E0',
                          margin: '4px 0',
                          borderRadius: 1,
                        }} />
                      )}
                    </div>

                    {/* Текст */}
                    <div style={{ paddingBottom: isLast ? 0 : 16, paddingTop: 1 }}>
                      <div style={{
                        fontSize: 14,
                        fontWeight: state === 'current' ? 600 : 400,
                        color: state === 'current'
                          ? '#0058A3'
                          : state === 'done'
                            ? '#181818'
                            : '#9E9E9E',
                        lineHeight: '20px',
                      }}>
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