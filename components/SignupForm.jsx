import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../lib/authContext'

export default function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: signUpError } = await signUp(email, password)

    if (signUpError) {
      setError(signUpError)
      setLoading(false)
      return
    }

    // Success - redirect to dashboard
    router.push('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="form-group">
        <label htmlFor="signup-email">Email</label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="signup-password">Password</label>
        <input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
          minLength={6}
          required
          disabled={loading}
        />
        <small className="form-hint">Password must be at least 6 characters</small>
      </div>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <button type="submit" className="auth-button" disabled={loading}>
        {loading ? 'Creating account...' : 'Sign Up'}
      </button>
    </form>
  )
}
