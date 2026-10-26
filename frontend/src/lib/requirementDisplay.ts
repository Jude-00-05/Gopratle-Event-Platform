import { formatINR } from './utils';

export interface DisplayField {
  label: string;
  value: string;
}

const INTERNAL_FIELDS = new Set(['_id', '__v', 'createdAt', 'updatedAt']);

export function displayLabel(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([a-zA-Z])(\d)/g, '$1 $2')
    .replace(/(\d)([a-zA-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function isEmpty(value: unknown): boolean {
  return value === null || value === undefined ||
    (typeof value === 'string' && value.trim() === '') ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0);
}

function formatValue(value: unknown, key: string): string | null {
  if (isEmpty(value)) return null;
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') return key === 'estimatedBudget' ? formatINR(value) : String(value);
  if (typeof value === 'string') {
    if (/date$/i.test(key)) {
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) {
        return new Intl.DateTimeFormat('en-IN', {
          day: 'numeric', month: 'long', year: 'numeric',
        }).format(date);
      }
    }
    return value.replace(/[-_]+/g, ' ');
  }
  if (Array.isArray(value)) {
    const items = value.map((item) => formatValue(item, key)).filter((item): item is string => item !== null);
    return items.length ? items.join(', ') : null;
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, child]) => !isEmpty(child))
      .map(([childKey, child]) => {
        const formatted = formatValue(child, childKey);
        return formatted === null ? null : `${displayLabel(childKey)}: ${formatted}`;
      })
      .filter((entry): entry is string => entry !== null);
    return entries.length ? entries.join('; ') : null;
  }
  return null;
}

function appendFields(value: unknown, prefix: string, fields: DisplayField[]): void {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return;
  Object.entries(value as Record<string, unknown>).forEach(([key, child]) => {
    if (INTERNAL_FIELDS.has(key) || isEmpty(child)) return;
    const label = prefix ? `${prefix} · ${displayLabel(key)}` : displayLabel(key);
    if (child && typeof child === 'object' && !Array.isArray(child)) {
      appendFields(child, label, fields);
      return;
    }
    const formatted = formatValue(child, key);
    if (formatted !== null) fields.push({ label, value: formatted });
  });
}

/** Converts populated API document fields to readable rows, omitting persistence metadata and empty values. */
export function getRequirementDisplayFields(requirement: Record<string, unknown>): DisplayField[] {
  const fields: DisplayField[] = [];
  Object.entries(requirement).forEach(([key, value]) => {
    if (INTERNAL_FIELDS.has(key) || key === 'details' || isEmpty(value)) return;
    const formatted = formatValue(value, key);
    if (formatted !== null) fields.push({ label: displayLabel(key), value: formatted });
  });
  appendFields(requirement.details, 'Details', fields);
  return fields;
}
