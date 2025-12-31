import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '../lib/authContext'
import ProtectedRoute from '../components/ProtectedRoute'
import LoadingSpinner from '../components/LoadingSpinner'
import CollectionFilterBar from '../components/CollectionFilterBar'
import PokemonCollectionGrid from '../components/PokemonCollectionGrid'
import PokemonDetailModal from '../components/PokemonDetailModal'

export default function CollectionPage() {
  const { session } = useAuth()
  const router = useRouter()
  const [pokemon, setPokemon] = useState([])
  const [types, setTypes] = useState([])
  const [srValues, setSrValues] = useState([])
  const [selectedTypes, setSelectedTypes] = useState([])
  const [selectedSR, setSelectedSR] = useState(null)
  const [selectedPokemon, setSelectedPokemon] = useState(null)
  const [hasStarter, setHasStarter] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (session?.access_token) {
      loadCollection()
    }
  }, [session])

  async function loadCollection() {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/collection', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Failed to load collection')
        return
      }

      setPokemon(data.pokemon)
      setTypes(data.types)
      setSrValues(data.srValues)
      setHasStarter(data.hasStarter)

      // If user doesn't have a starter, redirect to starter selection
      if (!data.hasStarter) {
        router.push('/select-starter')
        return
      }
    } catch (err) {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handlePokemonClick(clickedPokemon) {
    setSelectedPokemon(clickedPokemon)
  }

  function handleCloseModal() {
    setSelectedPokemon(null)
  }

  function handleClearAllFilters() {
    setSelectedTypes([])
    setSelectedSR(null)
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>Pokemon Collection - Pokemon Selector</title>
        <meta name="description" content="Browse all Pokemon" />
      </Head>

      <main className="collection-container">
        <nav className="collection-nav">
          <Link href="/dashboard" className="nav-link">
            Back to Dashboard
          </Link>
        </nav>

        <header className="collection-header">
          <h1>Pokemon Collection</h1>
          <p>Browse all {pokemon.length} Pokemon. Click any Pokemon to view details.</p>
        </header>

        {loading && (
          <div className="loading-container">
            <LoadingSpinner />
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
            <button onClick={loadCollection} className="retry-button">
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="collection-content">
            <CollectionFilterBar
              selectedTypes={selectedTypes}
              onTypesChange={setSelectedTypes}
              selectedSR={selectedSR}
              onSRChange={setSelectedSR}
              srValues={srValues}
              onClearAll={handleClearAllFilters}
            />

            <PokemonCollectionGrid
              pokemon={pokemon}
              selectedTypes={selectedTypes}
              selectedSR={selectedSR}
              onPokemonClick={handlePokemonClick}
            />
          </div>
        )}

        {selectedPokemon && (
          <PokemonDetailModal
            pokemon={selectedPokemon}
            onClose={handleCloseModal}
          />
        )}
      </main>
    </ProtectedRoute>
  )
}
