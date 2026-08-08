/**
 * Format date string into human readable string (e.g. "Sat, Aug 15")
 */
export const formatDate = (dateStr: string, options?: Intl.DateTimeFormatOptions): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', options || {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format price currency ($25 or FREE)
 */
export const formatCurrency = (price: number): string => {
  if (price === 0) return 'FREE';
  return `$${price.toFixed(0)}`;
};

/**
 * Capitalize category name (e.g. "rice_ceremony" -> "Rice ceremony")
 */
export const formatCategoryLabel = (category: string): string => {
  return category.replace('_', ' ');
};
