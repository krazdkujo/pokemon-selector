import { useState, useEffect } from 'react'
import { useAuth } from '../lib/authContext'
import RosterSlot from './RosterSlot'
import LoadingSpinner from './LoadingSpinner'
import Link from 'next/link'

export default function ActiveRoster() {
  const { session } = useAuth()
  const [roster, setRoster] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (session?.access_token) {
      loadRoster()
    }
  }, [session])

  async function loadRoster() {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/roster', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Failed to load roster')
        return
      }

      setRoster(data.roster)
    } catch (err) {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleMoveToStorage(pokemonDbId) {
    try {
      setUpdating(true)
      setError(null)

      const response = await fetch('/api/roster', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          pokemonDbId,
          action: 'moveToStorage',
        }),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Failed to move Pokemon')
        return
      }

      setRoster(data.roster)
    } catch (err) {
      setError('Connection error. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  const hasAnyPokemon = roster.some(slot => slot.pokemon !== null)

  if (loading) {
    return (
      <div className="active-roster loading">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="active-roster">
      <div className="roster-header">
        <h2>Active Roster</h2>
        <span className="roster-count">
          {roster.filter(s => s.pokemon).length}/6
        </span>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!hasAnyPokemon && (
        <div className="no-pokemon-message">
          <p>You don't have any Pokemon yet!</p>
          <Link href="/select-starter" className="select-starter-link">
            Select Your Starter
          </Link>
        </div>
      )}

      <div className="roster-grid">
        {roster.map(slot => (
          <RosterSlot
            key={slot.slotNumber}
            slot={slot.slotNumber}
            pokemon={slot.pokemon}
            onMoveToStorage={hasAnyPokemon ? handleMoveToStorage : null}
            disabled={updating}
          />
        ))}
      </div>
    </div>
  )
}
