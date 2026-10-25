'use client';

import { useEffect } from 'react';

const STORAGE_KEY = 'gopratle_form_v1'; // bump suffix when form schema changes

type Setter = (data: unknown) => void;

/**
 * Persists form state to sessionStorage for refresh recovery.
 *
 * Trade-offs:
 * - survives page refresh within the same tab
 * - cleared when the tab is closed (unlike localStorage) — acceptable for transient form data
 * - validated on restore; malformed or schema-mismatched data is discarded silently
 * - cleared explicitly after successful submission via clearPersistedForm()
 */
export function useFormPersist(data: unknown, setData: Setter): void {
  // On mount: attempt to restore from sessionStorage
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      // Sanity check: must be a plain object with a step1 key
      if (parsed && typeof parsed === 'object' && 'step1' in parsed) {
        setData(parsed);
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Malformed JSON or storage access error — discard silently
      sessionStorage.removeItem(STORAGE_KEY);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // On data change: write to sessionStorage
  useEffect(() => {
    if (!data) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore storage errors (e.g., private browsing quota exceeded)
    }
  }, [data]);
}

/**
 * Clears persisted form data after a successful submission.
 * Must be called from the success handler.
 */
export function clearPersistedForm(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}
