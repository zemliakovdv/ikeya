export default function OutOfStockNotice({ className = '' }) {
  const classes = ['out-of-stock-notice', className].filter(Boolean).join(' ');

  return (
    <p className={classes} role="status">
      временно нет в наличии
    </p>
  );
}
