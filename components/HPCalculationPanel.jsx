import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../lib/authContext'

export default function HPCalculationPanel({
  pokemon,
  level,
  hpMethod,
  onMethodChange,
  onHpCalculated,
  disabled = false,
}) {
  const { session } = useAuth()
  const [hpResult, setHpResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rerollCounter, setRerollCounter] = useState(0)
  const onHpCalculatedRef = useRef(onHpCalculated)
  const hasCalculatedRef = useRef(false)

  // Keep ref updated
  useEffect(() => {
    onHpCalculatedRef.current = onHpCalculated
  }, [onHpCalculated])

  // Calculate HP when method changes or on mount
  useEffect(() => {
    async function calculateHp() {
      if (!pokemon?.id || !session?.access_token) return

      setLoading(true)
      setError('')

      try {
        const response = await fetch('/api/calculate-hp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            pokemonId: pokemon.id,
            level,
            hpMethod,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to calculate HP')
        }

        setHpResult(data)
        onHpCalculatedRef.current(data)
        hasCalculatedRef.current = true
      } catch (err) {
        console.error('Error calculating HP:', err)
        setError(err.message || 'Failed to calculate HP')
      } finally {
        setLoading(false)
      }
    }

    calculateHp()
  }, [pokemon?.id, level, hpMethod, session?.access_token, rerollCounter])

  function handleMethodChange(method) {
    if (disabled || loading) return
    onMethodChange(method)
    // calculateHp will be triggered by the useEffect
  }

  function handleReroll() {
    if (disabled || loading || hpMethod !== 'roll') return
    setRerollCounter(c => c + 1)
  }

  return (
    <div className="hp-calculation-panel">
      <div className="hp-method-buttons">
        <button
          type="button"
          className={`hp-method-button ${hpMethod === 'average' ? 'selected' : ''}`}
          onClick={() => handleMethodChange('average')}
          disabled={disabled || loading}
        >
          <div className="hp-method-name">Average</div>
          <div className="hp-method-desc">
            Guaranteed HP based on average die rolls
          </div>
        </button>
        <button
          type="button"
          className={`hp-method-button ${hpMethod === 'roll' ? 'selected' : ''}`}
          onClick={() => handleMethodChange('roll')}
          disabled={disabled || loading}
        >
          <div className="hp-method-name">Roll</div>
          <div className="hp-method-desc">
            Roll the dice - risk vs reward!
          </div>
        </button>
      </div>

      {loading && (
        <div className="hp-loading">Calculating HP...</div>
      )}

      {error && (
        <div className="move-selection-error">{error}</div>
      )}

      {!loading && !error && hpResult && (
        <div className="hp-result-display">
          <div className="hp-result-header">
            <div>
              <div className="hp-total">{hpResult.hp} HP</div>
              <div className="hp-total-label">Maximum Hit Points</div>
            </div>
            {hpMethod === 'roll' && (
              <button
                type="button"
                className="hp-reroll-button"
                onClick={handleReroll}
                disabled={disabled}
              >
                Re-roll
              </button>
            )}
          </div>

          <div className="hp-breakdown">
            <div className="hp-breakdown-row">
              <span>Hit Dice:</span>
              <span>{hpResult.breakdown?.hitDice || pokemon.hitDice}</span>
            </div>
            <div className="hp-breakdown-row">
              <span>CON Score:</span>
              <span>{hpResult.breakdown?.conScore} (modifier: {hpResult.breakdown?.conModifier >= 0 ? '+' : ''}{hpResult.breakdown?.conModifier})</span>
            </div>
            <div className="hp-breakdown-row">
              <span>Level:</span>
              <span>{hpResult.breakdown?.level}</span>
            </div>

            {hpResult.breakdown?.perLevelValues && (
              <div className="hp-rolls-display">
                {hpResult.breakdown.perLevelValues.map((value, index) => (
                  <span
                    key={index}
                    className={`hp-roll-badge ${index === 0 ? 'level-1' : ''}`}
                    title={index === 0 ? 'Level 1 (max die)' : `Level ${index + 1}`}
                  >
                    Lv{index + 1}: {value}
                  </span>
                ))}
              </div>
            )}

            <div className="hp-breakdown-row total">
              <span>Total HP:</span>
              <span>
                {hpResult.breakdown?.perLevelValues?.reduce((a, b) => a + b, 0) || 0} +
                ({hpResult.breakdown?.conModifier >= 0 ? '+' : ''}{hpResult.breakdown?.conModifier} x {hpResult.breakdown?.level}) = {hpResult.hp}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
