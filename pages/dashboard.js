import { useRouter } from 'next/router'
import Head from 'next/head'
import { useAuth } from '../lib/authContext'
import ProtectedRoute from '../components/ProtectedRoute'
import PokemonSelector from '../components/PokemonSelector'

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

        <section className="dashboard-content">
          <PokemonSelector />
        </section>
      </main>
    </ProtectedRoute>
  )
}
