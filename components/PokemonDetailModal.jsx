import { useEffect } from 'react'

export default function PokemonDetailModal({ pokemon, onClose }) {
  // Handle Escape key to close modal
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Format ability name from kebab-case to Title Case
  function formatAbilityName(id) {
    return id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }

  // Get starting moves
  const startMoves = pokemon.moves?.start || []

  // Get level-up moves (combine all level entries)
  const levelMoves = Object.entries(pokemon.moves || {})
    .filter(([key]) => key.startsWith('level'))
    .map(([key, moves]) => ({
      level: parseInt(key.replace('level', '')),
      moves: moves || []
    }))
    .sort((a, b) => a.level - b.level)

  // Get TM moves
  const tmMoves = pokemon.moves?.tm || []

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content pokemon-detail-modal">
        <button className="modal-close" onClick={onClose}>
          X
        </button>

        <div className="modal-header">
          <img
            src={pokemon.spriteUrl}
            alt={pokemon.name}
            className="modal-sprite"
            onError={(e) => {
              e.target.src = '/placeholder-pokemon.png'
              e.target.onerror = null
            }}
          />
          <div className="modal-title">
            <h2>#{pokemon.number} {pokemon.name}</h2>
            <div className="modal-types">
              {pokemon.types.map(type => (
                <span key={type} className={`type-badge type-${type}`}>
                  {type}
                </span>
              ))}
            </div>
            <div className="modal-sr">SR: {pokemon.sr}</div>
          </div>
        </div>

        <div className="modal-body">
          {pokemon.description && (
            <p className="pokemon-description">{pokemon.description}</p>
          )}

          <div className="detail-section">
            <h3>Basic Info</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Size</span>
                <span className="info-value">{pokemon.size || 'Unknown'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Min Level</span>
                <span className="info-value">{pokemon.minLevel || 1}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Hit Dice</span>
                <span className="info-value">{pokemon.hitDice || 'd6'}</span>
              </div>
              {pokemon.evolution && (
                <div className="info-item">
                  <span className="info-label">Evolution</span>
                  <span className="info-value">{pokemon.evolution}</span>
                </div>
              )}
            </div>
          </div>

          <div className="stats-section">
            <h3>Stats</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">HP</span>
                <span className="stat-value">{pokemon.hp || 10}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">AC</span>
                <span className="stat-value">{pokemon.ac || 10}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">STR</span>
                <span className="stat-value">{pokemon.attributes?.str || 10}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">DEX</span>
                <span className="stat-value">{pokemon.attributes?.dex || 10}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">CON</span>
                <span className="stat-value">{pokemon.attributes?.con || 10}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">INT</span>
                <span className="stat-value">{pokemon.attributes?.int || 10}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">WIS</span>
                <span className="stat-value">{pokemon.attributes?.wis || 10}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">CHA</span>
                <span className="stat-value">{pokemon.attributes?.cha || 10}</span>
              </div>
            </div>
          </div>

          {pokemon.abilities && pokemon.abilities.length > 0 && (
            <div className="abilities-section">
              <h3>Abilities</h3>
              <ul className="abilities-list">
                {pokemon.abilities.map(ability => (
                  <li key={ability.id} className="ability-item">
                    <span className="ability-name">
                      {formatAbilityName(ability.id)}
                    </span>
                    {ability.hidden && <span className="hidden-badge">Hidden</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {startMoves.length > 0 && (
            <div className="moves-section">
              <h3>Starting Moves</h3>
              <div className="moves-list-compact">
                {startMoves.map(move => (
                  <span key={move} className="move-tag">
                    {move.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {levelMoves.length > 0 && (
            <div className="moves-section">
              <h3>Level-Up Moves</h3>
              <div className="level-moves-list">
                {levelMoves.map(({ level, moves }) => (
                  <div key={level} className="level-move-group">
                    <span className="level-label">Lv.{level}:</span>
                    <div className="moves-list-compact">
                      {moves.map(move => (
                        <span key={move} className="move-tag">
                          {move.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tmMoves.length > 0 && (
            <div className="moves-section">
              <h3>TM Moves</h3>
              <div className="tm-list">
                {tmMoves.slice(0, 20).map(tm => (
                  <span key={tm} className="tm-tag">TM{tm}</span>
                ))}
                {tmMoves.length > 20 && (
                  <span className="tm-more">+{tmMoves.length - 20} more</span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="close-modal-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
