import { useState } from 'react'

export default function StarterDetailModal({ pokemon, onClose, onSelect, selecting }) {
  const [nickname, setNickname] = useState('')

  function handleSelect() {
    onSelect(pokemon.id, nickname.trim() || null)
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content starter-detail-modal">
        <button className="modal-close" onClick={onClose} disabled={selecting}>
          X
        </button>

        <div className="modal-header">
          <img
            src={pokemon.spriteUrl}
            alt={pokemon.name}
            className="modal-sprite"
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
          </div>
        </div>

        <div className="modal-body">
          <p className="pokemon-description">{pokemon.description}</p>

          <div className="stats-section">
            <h3>Stats</h3>
            <div className="stats-grid">
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
              <div className="stat-item">
                <span className="stat-label">HP</span>
                <span className="stat-value">{pokemon.hp || 10}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">AC</span>
                <span className="stat-value">{pokemon.ac || 10}</span>
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
                      {ability.id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </span>
                    {ability.hidden && <span className="hidden-badge">Hidden</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="nickname-section">
            <label htmlFor="nickname">Give your Pokemon a nickname (optional)</label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter nickname..."
              maxLength={20}
              disabled={selecting}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="cancel-button"
            onClick={onClose}
            disabled={selecting}
          >
            Cancel
          </button>
          <button
            className="select-starter-button"
            onClick={handleSelect}
            disabled={selecting}
          >
            {selecting ? 'Selecting...' : 'Choose as Starter'}
          </button>
        </div>
      </div>
    </div>
  )
}
