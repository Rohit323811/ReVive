/**
 * Supabase client — null when env vars are missing so the entire app works
 * without any configuration (hackathon demo mode).
 *
 * Where keys come from:
 *   VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in `.env` (copy .env.example).
 * The anon key is safe to expose to browsers (protected by RLS policies).
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null

export function supabaseConfigured(): boolean {
  return supabase !== null
}
