import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '../lib/authContext'
import ProtectedRoute from '../components/ProtectedRoute'
import ActiveRoster from '../components/ActiveRoster'
import PokemonDetailModal from '../components/PokemonDetailModal'

export default function DashboardPage() {
  const { user, session, signOut } = useAuth()
  const router = useRouter()
  const [hasStarter, setHasStarter] = useState(null)
  const [selectedPokemon, setSelectedPokemon] = useState(null)

  useEffect(() => {
    if (session?.access_token) {
      checkStarterStatus()
    }
  }, [session])

  async function checkStarterStatus() {
    try {
      const response = await fetch('/api/starters', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setHasStarter(data.hasStarter)
      }
    } catch (err) {
      console.error('Failed to check starter status:', err)
    }
  }

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
          {hasStarter === false && (
            <Link href="/select-starter" className="nav-link">
              Select Starter
            </Link>
          )}
          {hasStarter === true && (
            <Link href="/collection" className="nav-link">
              Pokemon Collection
            </Link>
          )}
          <Link href="/storage" className="nav-link">
            Storage
          </Link>
        </nav>

        <section className="dashboard-content">
          <ActiveRoster onPokemonClick={setSelectedPokemon} />
        </section>

        {selectedPokemon && (
          <PokemonDetailModal
            pokemon={selectedPokemon}
            onClose={() => setSelectedPokemon(null)}
          />
        )}
      </main>
    </ProtectedRoute>
  )
}
