import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '../lib/authContext'
import ProtectedRoute from '../components/ProtectedRoute'
import ActiveRoster from '../components/ActiveRoster'

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  async function handleLogout() {
    await signOut()
    router.push('/login')
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>Dashboard - Pokemon Selector</title>
        <meta name="description" content="Your Pokemon Selector Dashboard" />
      </Head>

      <main className="dashboard-container">
        <header className="dashboard-header">
          <h1>Pokemon Selector Dashboard</h1>
          <div className="user-info">
            <span className="user-email">{user?.email}</span>
            <button onClick={handleLogout} className="logout-button">
              Log Out
            </button>
          </div>
        </header>

        <nav className="dashboard-nav">
          <Link href="/select-starter" className="nav-link">
            Select Starter
          </Link>
          <Link href="/storage" className="nav-link">
            Storage
          </Link>
        </nav>

        <section className="dashboard-content">
          <ActiveRoster />
        </section>
      </main>
    </ProtectedRoute>
  )
}
