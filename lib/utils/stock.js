export function isTemporarilyOutOfStock(quantity) {
  if (quantity === null || quantity === undefined || quantity === '') return false;

  const value = Number(quantity);
  return Number.isFinite(value) && value <= 0;
}
