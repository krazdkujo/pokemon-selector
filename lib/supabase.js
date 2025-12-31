import { createClient } from '@supabase/supabase-js'

/**
 * API request timeout in milliseconds (10 seconds)
 */
export const API_TIMEOUT_MS = 10000

/**
 * Wraps an API handler with timeout handling
 * @param {Function} handler - The API handler function
 * @param {number} timeoutMs - Timeout in milliseconds (default: 10000)
 * @returns {Function} Wrapped handler with timeout
 */
export function withTimeout(handler, timeoutMs = API_TIMEOUT_MS) {
  return async (req, res) => {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request timeout'))
      }, timeoutMs)
    })

    try {
      await Promise.race([handler(req, res), timeoutPromise])
    } catch (error) {
      if (error.message === 'Request timeout') {
        console.error('API request timed out after', timeoutMs, 'ms')
        if (!res.headersSent) {
          return res.status(504).json({
            success: false,
            error: 'Request timed out. Please try again.',
          })
        }
      } else {
        throw error
      }
    }
  }
}

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

/**
 * Create an authenticated Supabase client using a user's JWT token.
 * This is required for RLS policies to work correctly in API routes.
 * @param {string} token - The user's JWT access token
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
export function createAuthenticatedClient(token) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
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
