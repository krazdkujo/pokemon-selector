import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useAuth } from '../lib/authContext'
import AuthTabs from '../components/AuthTabs'
import LoginForm from '../components/LoginForm'
import SignupForm from '../components/SignupForm'
import LoadingSpinner from '../components/LoadingSpinner'

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('login')
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard')
    }
  }, [user, loading, router])

  // Show loading while checking auth
  if (loading) {
    return <LoadingSpinner />
  }

  // Don't render login page if user is authenticated
  if (user) {
    return null
  }

  return (
    <>
      <Head>
        <title>Login - Pokemon Selector</title>
        <meta name="description" content="Login or sign up for Pokemon Selector" />
      </Head>

      <main className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Pokemon Selector</h1>

          <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === 'login' ? (
            <LoginForm />
          ) : (
            <SignupForm />
          )}
        </div>
      </main>
    </>
  )
}
