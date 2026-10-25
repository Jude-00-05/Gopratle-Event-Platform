/**
 * Format a number as Indian Rupees (INR).
 * Budget values are stored as plain numbers; this is display-only formatting.
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style:    'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a YYYY-MM-DD date string for display.
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-IN', {
    day:   'numeric',
    month: 'long',
    year:  'numeric',
  });
}

/**
 * Convert a YYYY-MM-DD date string to ISO 8601 datetime string (midnight UTC).
 */
export function toISODateTime(dateStr: string): string {
  return `${dateStr}T00:00:00.000Z`;
}

/**
 * Return a human-readable label for a category slug.
 */
export function categoryLabel(category: string): string {
  const map: Record<string, string> = {
    planner:  'Event Planner',
    performer: 'Performer',
    crew:     'Crew',
  };
  return map[category] ?? category;
}
