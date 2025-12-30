import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useAuth } from '../lib/authContext'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect based on auth state
  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/dashboard')
      } else {
        router.replace('/login')
      }
    }
  }, [user, loading, router])

  // Show loading while checking auth and redirecting
  return (
    <>
      <Head>
        <title>Pokemon Selector</title>
        <meta name="description" content="Pokemon 5e character and team management" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LoadingSpinner />
    </>
  )
}
