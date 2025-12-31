import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../lib/authContext'
import LoadingSpinner from './LoadingSpinner'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)

  // Wait for both client mount and router to be ready
  useEffect(() => {
    if (router.isReady) {
      setIsReady(true)
    }
  }, [router.isReady])

  // Handle redirect after everything is ready
  useEffect(() => {
    if (isReady && !loading && !user) {
      router.replace('/login')
    }
  }, [user, loading, router, isReady])

  // Show loading until client is ready and auth check is complete
  if (!isReady || loading) {
    return <LoadingSpinner />
  }

  // Show loading while redirecting (user is null)
  if (!user) {
    return <LoadingSpinner />
  }

  return children
}
