import { atom, computed } from 'nanostores';
import type { Brief } from '@xentri/ts-schema';

/**
 * Brief state store for Strategy category.
 *
 * Manages:
 * - Current org's Brief
 * - Loading/error states
 * - API operations
 */

// ===================
// State Atoms
// ===================

/** Current Brief data (null if no Brief exists) */
export const $brief = atom<Brief | null>(null);

/** Loading state */
export const $briefLoading = atom<boolean>(false);

/** Error state */
export const $briefError = atom<string | null>(null);

// ===================
// Computed Values
// ===================

/** Whether a Brief exists for the current org */
export const $hasBrief = computed($brief, (brief) => brief !== null);

/** Brief completion percentage (0-100) */
export const $briefCompletionPercent = computed($brief, (brief) => {
  if (!brief?.sectionStatus) return 0;
  const sections = Object.values(brief.sectionStatus);
  if (sections.length === 0) return 0;
  const ready = sections.filter((s) => s === 'ready').length;
  return Math.round((ready / 7) * 100);
});

/** List of populated section names */
export const $populatedSections = computed($brief, (brief) => {
  if (!brief?.sectionStatus) return [];
  return Object.entries(brief.sectionStatus)
    .filter(([_, status]) => status === 'ready')
    .map(([name]) => name);
});

// ===================
// Actions
// ===================

/** Set Brief data */
export function setBrief(brief: Brief | null): void {
  $brief.set(brief);
  $briefError.set(null);
}

/** Set loading state */
export function setBriefLoading(loading: boolean): void {
  $briefLoading.set(loading);
}

/** Set error state */
export function setBriefError(error: string | null): void {
  $briefError.set(error);
  $briefLoading.set(false);
}

/** Clear Brief state */
export function clearBrief(): void {
  $brief.set(null);
  $briefLoading.set(false);
  $briefError.set(null);
}

// ===================
// API Configuration
// ===================

/** Get API base URL from environment or default */
export function getApiUrl(): string {
  // In browser, check for runtime config
  if (typeof window !== 'undefined') {
    return (window as { __XENTRI_API_URL__?: string }).__XENTRI_API_URL__ || 'http://localhost:3000';
  }
  return 'http://localhost:3000';
}
