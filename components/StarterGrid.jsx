import StarterCard from './StarterCard'

export default function StarterGrid({ starters, selectedTypes, onPokemonClick, disabled }) {
  // Filter starters based on selected types (exact match - must have ALL selected types)
  const filteredStarters = selectedTypes.length === 0
    ? []
    : starters.filter(pokemon =>
        selectedTypes.every(type => pokemon.types.includes(type))
      )

  if (selectedTypes.length === 0) {
    return (
      <div className="starter-grid-empty">
        <p>Select 1 or 2 types above to see available starter Pokemon</p>
      </div>
    )
  }

  if (filteredStarters.length === 0) {
    return (
      <div className="starter-grid-empty">
        <p>No Pokemon match these types</p>
      </div>
    )
  }

  return (
    <div className="starter-grid">
      <div className="starter-count">
        Showing {filteredStarters.length} Pokemon
      </div>
      <div className="starter-cards">
        {filteredStarters.map(pokemon => (
          <StarterCard
            key={pokemon.id}
            pokemon={pokemon}
            onClick={onPokemonClick}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  )
}
