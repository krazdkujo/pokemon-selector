import PokemonCollectionCard from './PokemonCollectionCard'

export default function PokemonCollectionGrid({
  pokemon,
  selectedTypes,
  selectedSR,
  onPokemonClick,
}) {
  // Apply filters
  const filteredPokemon = pokemon.filter(p => {
    // Type filter: show Pokemon that have ANY of the selected types
    const passesTypeFilter = selectedTypes.length === 0 ||
      selectedTypes.some(type => p.types.includes(type))

    // SR filter: exact match
    const passesSRFilter = selectedSR === null ||
      p.sr === selectedSR

    return passesTypeFilter && passesSRFilter
  })

  // Sort by Pokedex number
  const sortedPokemon = [...filteredPokemon].sort((a, b) => a.number - b.number)

  if (sortedPokemon.length === 0) {
    return (
      <div className="collection-empty">
        <h3>No Pokemon Found</h3>
        <p>No Pokemon match the current filters. Try adjusting your selection.</p>
      </div>
    )
  }

  return (
    <div className="collection-grid-container">
      <p className="collection-count">
        Showing {sortedPokemon.length} of {pokemon.length} Pokemon
      </p>
      <div className="collection-grid">
        {sortedPokemon.map(p => (
          <PokemonCollectionCard
            key={p.id}
            pokemon={p}
            onClick={onPokemonClick}
          />
        ))}
      </div>
    </div>
  )
}
