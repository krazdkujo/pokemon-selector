import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../lib/authContext'
import LoadingSpinner from './LoadingSpinner'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [user, loading, router])

  // Show loading while checking auth status
  if (loading) {
    return <LoadingSpinner />
  }

  // Don't render children if not authenticated
  if (!user) {
    return null
  }

  return children
}
