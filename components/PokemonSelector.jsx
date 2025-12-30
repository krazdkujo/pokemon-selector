import { useState, useEffect, useRef } from 'react'
import LoadingSpinner from './LoadingSpinner'

export default function PokemonSelector() {
  const [pokemon, setPokemon] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [allPokemonNames, setAllPokemonNames] = useState([])
  const searchRef = useRef(null)

  // Load Pokemon names for autocomplete on mount
  useEffect(() => {
    async function loadPokemonNames() {
      try {
        // Generate a random pokemon just to get the data structure
        // In a real app, we'd have a separate endpoint for this
        const response = await fetch('/api/generate-pokemon', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ random: true }),
        })
        // For now, we'll populate suggestions as user types
      } catch (err) {
        console.error('Failed to load Pokemon names')
      }
    }
    loadPokemonNames()
  }, [])

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function generatePokemon(pokemonId = null) {
    setLoading(true)
    setError(null)
    setShowSuggestions(false)

    try {
      const body = pokemonId
        ? { pokemonId: pokemonId.toLowerCase() }
        : { random: true }

      const response = await fetch('/api/generate-pokemon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Failed to generate Pokemon')
        return
      }

      setPokemon(data.pokemon)
      setSearchQuery('')
    } catch (err) {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleGenerateRandom() {
    generatePokemon(null)
  }

  function handleSearchSubmit(e) {
    e.preventDefault()
    if (searchQuery.trim()) {
      generatePokemon(searchQuery.trim())
    }
  }

  function handleSuggestionClick(name) {
    setSearchQuery(name)
    generatePokemon(name)
  }

  function handleSearchChange(e) {
    const value = e.target.value
    setSearchQuery(value)

    // Show some common Pokemon as suggestions when typing
    if (value.length >= 2) {
      const commonPokemon = [
        'bulbasaur', 'charmander', 'squirtle', 'pikachu', 'eevee',
        'mewtwo', 'mew', 'gengar', 'dragonite', 'snorlax',
        'jigglypuff', 'psyduck', 'machop', 'geodude', 'abra',
        'gastly', 'onix', 'voltorb', 'magikarp', 'ditto'
      ]
      const filtered = commonPokemon.filter(name =>
        name.toLowerCase().startsWith(value.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 5))
      setShowSuggestions(filtered.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  return (
    <div className="pokemon-selector">
      <div className="generator-controls">
        <button
          onClick={handleGenerateRandom}
          disabled={loading}
          className="generate-button"
        >
          {loading ? 'Generating...' : 'Generate Random Pokemon'}
        </button>

        <div className="search-divider">or</div>

        <form onSubmit={handleSearchSubmit} className="search-form" ref={searchRef}>
          <div className="search-input-wrapper">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery.length >= 2 && setSuggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Search Pokemon by name..."
              className="search-input"
              disabled={loading}
            />
            <button type="submit" disabled={loading || !searchQuery.trim()} className="search-button">
              Generate
            </button>
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map(name => (
                <li
                  key={name}
                  onClick={() => handleSuggestionClick(name)}
                  className="suggestion-item"
                >
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </li>
              ))}
            </ul>
          )}
        </form>
      </div>

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

      {pokemon && !loading && (
        <div className="pokemon-card">
          <div className="pokemon-header">
            <img
              src={pokemon.spriteUrl}
              alt={pokemon.name}
              className="pokemon-sprite"
            />
            <div className="pokemon-info">
              <h2 className="pokemon-name">
                #{pokemon.number} {pokemon.name}
              </h2>
              <div className="pokemon-types">
                {pokemon.types.map(type => (
                  <span key={type} className={`type-badge type-${type}`}>
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pokemon-details">
            <div className="detail-section">
              <h3>Stats</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">STR</span>
                  <span className="stat-value">{pokemon.modifiedStats.str}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">DEX</span>
                  <span className="stat-value">{pokemon.modifiedStats.dex}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">CON</span>
                  <span className="stat-value">{pokemon.modifiedStats.con}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">INT</span>
                  <span className="stat-value">{pokemon.modifiedStats.int}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">WIS</span>
                  <span className="stat-value">{pokemon.modifiedStats.wis}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">CHA</span>
                  <span className="stat-value">{pokemon.modifiedStats.cha}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">HP</span>
                  <span className="stat-value">{pokemon.modifiedStats.hp}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">AC</span>
                  <span className="stat-value">{pokemon.modifiedStats.ac}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Moves</h3>
              <ul className="moves-list">
                {pokemon.moves.map(move => (
                  <li key={move.id} className="move-item">
                    <span className="move-name">{move.name}</span>
                    <span className={`move-type type-badge type-${move.type}`}>{move.type}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="detail-section">
              <h3>Ability</h3>
              <div className="ability-display">
                <span className="ability-name">
                  {pokemon.ability.name}
                  {pokemon.ability.isHidden && <span className="hidden-badge">Hidden</span>}
                </span>
                <p className="ability-description">{pokemon.ability.description}</p>
              </div>
            </div>

            <div className="detail-section">
              <h3>Nature</h3>
              <div className="nature-display">
                <span className="nature-name">{pokemon.nature.name}</span>
                <span className="nature-effect">{pokemon.nature.effect}</span>
              </div>
            </div>

            {pokemon.evolution && (
              <div className="detail-section">
                <h3>Evolution</h3>
                <div className="evolution-display">
                  {pokemon.evolution.evolvesFrom && (
                    <div className="evolution-item">
                      Evolves from: {pokemon.evolution.evolvesFromName}
                    </div>
                  )}
                  {pokemon.evolution.evolvesTo && (
                    <div className="evolution-item">
                      Evolves to: {pokemon.evolution.evolvesToName}
                      {pokemon.evolution.condition && ` (${pokemon.evolution.condition})`}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
