export function formatCurrency(value, currency = 'USD') {
  try {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency }).format(Number(value) || 0);
  } catch {
    return `$${value}`;
  }
}

export function formatShortNumber(n) {
  const num = Number(n) || 0;
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return String(num);
}
