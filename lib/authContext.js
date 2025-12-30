import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from './supabase'

const AuthContext = createContext({})

/**
 * Map Supabase errors to user-friendly, secure messages
 * Per FR-006: Must not reveal whether an email exists
 */
function getAuthErrorMessage(error) {
  const message = error?.message?.toLowerCase() || ''

  if (message.includes('invalid login credentials')) {
    return 'Invalid email or password'
  }
  if (message.includes('user already registered')) {
    return 'Unable to create account. Please try again or use a different email.'
  }
  if (message.includes('email not confirmed')) {
    return 'Invalid email or password'
  }
  if (message.includes('network') || message.includes('fetch')) {
    return 'Connection error. Please check your internet and try again.'
  }
  if (message.includes('password') && message.includes('6')) {
    return 'Password must be at least 6 characters'
  }
  return 'An error occurred. Please try again.'
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  /**
   * Sign in with email and password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{error: string|null}>}
   */
  async function signIn(email, password) {
    if (!isSupabaseConfigured()) {
      return { error: 'Authentication service not configured' }
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error: getAuthErrorMessage(error) }
      }

      return { error: null }
    } catch (err) {
      return { error: getAuthErrorMessage(err) }
    }
  }

  /**
   * Sign up with email and password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{error: string|null}>}
   */
  async function signUp(email, password) {
    if (!isSupabaseConfigured()) {
      return { error: 'Authentication service not configured' }
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        return { error: getAuthErrorMessage(error) }
      }

      return { error: null }
    } catch (err) {
      return { error: getAuthErrorMessage(err) }
    }
  }

  /**
   * Sign out the current user
   * @returns {Promise<void>}
   */
  async function signOut() {
    if (!isSupabaseConfigured()) {
      return
    }
    await supabase.auth.signOut()
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
