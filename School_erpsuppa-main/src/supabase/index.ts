'use client';

export * from './provider';
export { createMockSupabase } from './client-provider';

export function initializeSupabase() {
  return { supabase: null };
}
