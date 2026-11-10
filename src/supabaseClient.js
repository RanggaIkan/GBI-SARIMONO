import { createClient } from '@supabase/supabase-js'

const rawUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || ''
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || ''

const isValidHttpUrl = /^https?:\/\/.+/i.test(rawUrl)

export const isSupabaseConfigured = Boolean(isValidHttpUrl && rawAnonKey)

export const supabase = createClient(
  isValidHttpUrl ? rawUrl : 'https://placeholder.supabase.co',
  rawAnonKey || 'placeholder-anon-key'
)
