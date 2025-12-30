import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Check if URL looks valid (starts with http:// or https://)
const isValidUrl = supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://')

// Create Supabase client singleton (or null if not configured)
export const supabase = isValidUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Helper to check if Supabase is configured
export function isSupabaseConfigured() {
  return supabase !== null
}

// Helper function to check Supabase connection with latency measurement
export async function checkSupabaseConnection() {
  if (!supabase) {
    return {
      connected: false,
      error: 'Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
      latency: 0
    }
  }

  const startTime = Date.now()

  try {
    // Simple health check - just verify we can make a request
    const { error } = await supabase.from('_health_check_').select('*').limit(1)

    const latency = Date.now() - startTime

    // Even if table doesn't exist, connection succeeded if we got a proper error response
    // (not a network/auth error)
    if (error && error.code === 'PGRST116') {
      // Table doesn't exist - that's fine, connection works
      return { connected: true, latency }
    }

    if (error && (error.code === 'PGRST301' || error.message?.includes('JWT'))) {
      // Auth error - credentials might be invalid but connection works
      return { connected: true, latency, warning: 'Authentication may need configuration' }
    }

    if (error) {
      return { connected: false, error: error.message, latency }
    }

    return { connected: true, latency }
  } catch (err) {
    const latency = Date.now() - startTime
    return {
      connected: false,
      error: err.message || 'Unknown connection error',
      latency
    }
  }
}
