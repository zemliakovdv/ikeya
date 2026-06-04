// components/ui/PageLoader.js

export default function PageLoader({ message = '' }) {
  return (
    <div className="page-loader" role="status" aria-live="polite" aria-busy="true">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div className="page-loader__spinner" />
        {message ? (
          <p style={{ margin: 0, fontSize: 16, lineHeight: '24px', color: '#181818', textAlign: 'center' }}>
            {message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
