'use client';

import { getSessionCache } from '../../utils/sessionCache';

const MEM_ROLES = ['teacher', 'student', 'parent', 'principal', 'admin', 'staff'];

/** Fresh conversation id for memory run-linking. */
export function newRunId() {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  } catch { /* fallback below */ }
  return `run_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Role for memory identity, server-validated (chat route re-checks).
 * Reads the dashboard profile when present, else the caller fallback.
 */
export function sessionRole(fallback = 'staff') {
  try {
    const cfg = getSessionCache('dashboardContext') || {};
    const t = String(
      cfg.profile?.type || cfg.profile?.role || cfg.user?.type || ''
    ).toLowerCase();
    if (MEM_ROLES.includes(t)) return t;
  } catch { /* fall through */ }
  return MEM_ROLES.includes(String(fallback).toLowerCase()) ? fallback.toLowerCase() : 'staff';
}
