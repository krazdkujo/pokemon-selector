import { useState, useEffect } from 'react'
import { useAuth } from '../lib/authContext'

export default function MoveSelectionPanel({
  pokemon,
  level,
  selectedMoves,
  onMoveToggle,
  disabled = false,
}) {
  const { session } = useAuth()
  const [moves, setMoves] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchMoves() {
      if (!pokemon?.id || !session?.access_token) return

      setLoading(true)
      setError('')

      try {
        const response = await fetch(
          `/api/pokemon-moves?pokemonId=${pokemon.id}&level=${level}`,
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load moves')
        }

        setMoves(data.moves || [])
      } catch (err) {
        console.error('Error fetching moves:', err)
        setError(err.message || 'Failed to load moves')
      } finally {
        setLoading(false)
      }
    }

    fetchMoves()
  }, [pokemon?.id, level, session?.access_token])

  if (loading) {
    return (
      <div className="move-selection-panel">
        <div className="move-selection-loading">Loading available moves...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="move-selection-panel">
        <div className="move-selection-error">{error}</div>
      </div>
    )
  }

  if (moves.length === 0) {
    return (
      <div className="move-selection-panel">
        <div className="move-selection-error">No moves available for this Pokemon at level {level}</div>
      </div>
    )
  }

  const isAtMax = selectedMoves.length >= 4

  return (
    <div className="move-selection-panel">
      <div className="move-selection-grid">
        {moves.map(move => {
          const isSelected = selectedMoves.includes(move.id)
          const canSelect = !disabled && (isSelected || !isAtMax)

          return (
            <div
              key={move.id}
              className={`move-selection-item ${isSelected ? 'selected' : ''} ${!canSelect ? 'at-max' : ''} ${disabled ? 'disabled' : ''}`}
              onClick={() => canSelect && onMoveToggle(move.id)}
              role="checkbox"
              aria-checked={isSelected}
              tabIndex={canSelect ? 0 : -1}
              onKeyDown={(e) => {
                if (canSelect && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault()
                  onMoveToggle(move.id)
                }
              }}
            >
              <div className="move-checkbox">
                {isSelected && <span>&#10003;</span>}
              </div>
              <div className="move-selection-info">
                <div className="move-selection-name">
                  {move.name}
                  <span className={`type-badge type-${move.type}`}>
                    {move.type}
                  </span>
                </div>
                <div className="move-selection-level">
                  Learned at Lv. {move.levelLearned}
                </div>
                {move.description && (
                  <div className="move-selection-desc">
                    {move.description.length > 80
                      ? move.description.substring(0, 80) + '...'
                      : move.description}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
