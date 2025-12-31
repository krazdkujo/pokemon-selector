import { useState, useEffect } from 'react'
import { useAuth } from '../lib/authContext'
import LoadingSpinner from './LoadingSpinner'

export default function StorageView() {
  const { session } = useAuth()
  const [storage, setStorage] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [moving, setMoving] = useState(null) // ID of Pokemon being moved

  useEffect(() => {
    if (session?.access_token) {
      loadStorage(1)
    }
  }, [session])

  async function loadStorage(page) {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/storage?page=${page}&limit=20`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Failed to load storage')
        return
      }

      setStorage(data.storage)
      setPagination(data.pagination)
    } catch (err) {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleMoveToActive(pokemonDbId) {
    try {
      setMoving(pokemonDbId)
      setError(null)

      const response = await fetch('/api/storage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ pokemonDbId }),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Failed to move Pokemon')
        return
      }

      // Remove from storage list
      setStorage(storage.filter(p => p.id !== pokemonDbId))
      setPagination(prev => ({ ...prev, total: prev.total - 1 }))
    } catch (err) {
      setError('Connection error. Please try again.')
    } finally {
      setMoving(null)
    }
  }

  function handlePageChange(newPage) {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadStorage(newPage)
    }
  }

  if (loading) {
    return (
      <div className="storage-view loading">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="storage-view">
      <div className="storage-header">
        <h2>Pokemon Storage</h2>
        <span className="storage-count">{pagination.total} stored</span>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {storage.length === 0 ? (
        <div className="storage-empty">
          <p>No Pokemon in storage</p>
          <p className="storage-hint">
            Pokemon beyond your 6 active slots will appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="storage-grid">
            {storage.map(pokemon => (
              <div key={pokemon.id} className="storage-card">
                <img
                  src={pokemon.spriteUrl}
                  alt={pokemon.name}
                  className="storage-sprite"
                />
                <div className="storage-pokemon-info">
                  <h4>{pokemon.nickname || pokemon.name}</h4>
                  <span className="storage-level">Lv. {pokemon.level}</span>
                  <div className="storage-types">
                    {pokemon.types.map(type => (
                      <span key={type} className={`type-badge type-${type}`}>
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  className="move-to-active-button"
                  onClick={() => handleMoveToActive(pokemon.id)}
                  disabled={moving === pokemon.id}
                >
                  {moving === pokemon.id ? 'Moving...' : 'Move to Active'}
                </button>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="pagination-button"
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
