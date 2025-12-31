import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useAuth } from '../lib/authContext'
import ProtectedRoute from '../components/ProtectedRoute'
import LoadingSpinner from '../components/LoadingSpinner'
import TypeFilterBar from '../components/TypeFilterBar'
import StarterGrid from '../components/StarterGrid'
import StarterDetailModal from '../components/StarterDetailModal'

export default function SelectStarterPage() {
  const { session } = useAuth()
  const router = useRouter()
  const [starters, setStarters] = useState([])
  const [types, setTypes] = useState([])
  const [selectedTypes, setSelectedTypes] = useState([])
  const [hasStarter, setHasStarter] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPokemon, setSelectedPokemon] = useState(null)
  const [selecting, setSelecting] = useState(false)

  useEffect(() => {
    if (session?.access_token) {
      loadStarters()
    }
  }, [session])

  async function loadStarters() {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/starters', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Failed to load starters')
        return
      }

      setStarters(data.starters)
      setTypes(data.types)
      setHasStarter(data.hasStarter)
    } catch (err) {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handlePokemonClick(pokemon) {
    setSelectedPokemon(pokemon)
  }

  function handleCloseModal() {
    setSelectedPokemon(null)
  }

  async function handleSelectStarter(pokemonId, nickname) {
    try {
      setSelecting(true)
      setError(null)

      const response = await fetch('/api/starters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ pokemonId, nickname }),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Failed to select starter')
        return
      }

      // Success - redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      setError('Connection error. Please try again.')
    } finally {
      setSelecting(false)
    }
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>Select Your Starter - Pokemon Selector</title>
        <meta name="description" content="Choose your starter Pokemon" />
      </Head>

      <main className="select-starter-container">
        <header className="select-starter-header">
          <h1>Choose Your Starter Pokemon</h1>
          <p>Select 1 or 2 types to filter available starters, then click a Pokemon to choose it.</p>
        </header>

        {loading && (
          <div className="loading-container">
            <LoadingSpinner />
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!loading && hasStarter && (
          <div className="has-starter-message">
            <h2>You already have a starter!</h2>
            <p>Visit your dashboard to see your Pokemon roster.</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="go-to-dashboard-button"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {!loading && !hasStarter && !error && (
          <>
            <TypeFilterBar
              selectedTypes={selectedTypes}
              onTypesChange={setSelectedTypes}
              disabled={selecting}
            />

            <StarterGrid
              starters={starters}
              selectedTypes={selectedTypes}
              onPokemonClick={handlePokemonClick}
              disabled={selecting}
            />
          </>
        )}

        {selectedPokemon && (
          <StarterDetailModal
            pokemon={selectedPokemon}
            onClose={handleCloseModal}
            onSelect={handleSelectStarter}
            selecting={selecting}
          />
        )}
      </main>
    </ProtectedRoute>
  )
}
