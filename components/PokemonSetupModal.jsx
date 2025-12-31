import { useState, useEffect } from 'react'
import MoveSelectionPanel from './MoveSelectionPanel'
import HPCalculationPanel from './HPCalculationPanel'

export default function PokemonSetupModal({
  pokemon,
  level = 1,
  nickname = null,
  onConfirm,
  onCancel,
  isSubmitting = false,
}) {
  const [selectedMoves, setSelectedMoves] = useState([])
  const [hpMethod, setHpMethod] = useState('average')
  const [hpResult, setHpResult] = useState(null)
  const [error, setError] = useState('')

  // Validate that we can confirm
  const canConfirm = selectedMoves.length >= 1 && selectedMoves.length <= 4 && hpResult

  function handleMoveToggle(moveId) {
    setSelectedMoves(prev => {
      if (prev.includes(moveId)) {
        return prev.filter(id => id !== moveId)
      }
      if (prev.length >= 4) {
        return prev // Don't add if already at max
      }
      return [...prev, moveId]
    })
  }

  function handleHpCalculated(result) {
    setHpResult(result)
  }

  function handleConfirm() {
    if (!canConfirm) {
      setError('Please select 1-4 moves and calculate HP before confirming.')
      return
    }

    setError('')
    onConfirm({
      selectedMoves,
      hpMethod,
      hp: hpResult.hp,
      maxHp: hpResult.maxHp,
      hpRolls: hpResult.rolls,
    })
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget && !isSubmitting) {
      onCancel()
    }
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content pokemon-setup-modal">
        <button
          className="modal-close"
          onClick={onCancel}
          disabled={isSubmitting}
          aria-label="Close"
        >
          X
        </button>

        <div className="modal-header">
          <img
            src={pokemon.spriteUrl}
            alt={pokemon.name}
            className="modal-sprite"
          />
          <div className="modal-title">
            <h2>
              {nickname ? `${nickname} (${pokemon.name})` : pokemon.name}
            </h2>
            <div className="modal-types">
              {pokemon.types.map(type => (
                <span key={type} className={`type-badge type-${type}`}>
                  {type}
                </span>
              ))}
            </div>
            <p className="setup-level">Level {level}</p>
          </div>
        </div>

        <div className="modal-body setup-modal-body">
          <div className="setup-section">
            <h3>Select Moves ({selectedMoves.length}/4)</h3>
            <p className="setup-hint">Choose 1-4 moves for your Pokemon</p>
            <MoveSelectionPanel
              pokemon={pokemon}
              level={level}
              selectedMoves={selectedMoves}
              onMoveToggle={handleMoveToggle}
              disabled={isSubmitting}
            />
          </div>

          <div className="setup-section">
            <h3>Calculate HP</h3>
            <p className="setup-hint">Choose how to determine your Pokemon's HP</p>
            <HPCalculationPanel
              pokemon={pokemon}
              level={level}
              hpMethod={hpMethod}
              onMethodChange={setHpMethod}
              onHpCalculated={handleHpCalculated}
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <div className="error-message">{error}</div>
          )}
        </div>

        <div className="modal-footer">
          <button
            className="cancel-button"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            className="confirm-setup-button"
            onClick={handleConfirm}
            disabled={!canConfirm || isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Confirm Setup'}
          </button>
        </div>
      </div>
    </div>
  )
}
