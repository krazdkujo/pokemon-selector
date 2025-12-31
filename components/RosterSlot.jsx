export default function RosterSlot({ slot, pokemon, onMoveToStorage, onPokemonClick, disabled }) {
  if (!pokemon) {
    return (
      <div className="roster-slot empty">
        <div className="empty-slot-icon">?</div>
        <span className="empty-slot-text">Empty Slot {slot}</span>
      </div>
    )
  }

  function handleClick() {
    if (onPokemonClick && !disabled) {
      onPokemonClick(pokemon)
    }
  }

  return (
    <div className={`roster-slot filled ${onPokemonClick ? 'clickable' : ''}`} onClick={handleClick}>
      <img
        src={pokemon.spriteUrl}
        alt={pokemon.name}
        className="roster-sprite"
      />
      <div className="roster-pokemon-info">
        <h4 className="roster-pokemon-name">
          {pokemon.nickname || pokemon.name}
        </h4>
        <span className="roster-pokemon-level">Lv. {pokemon.level}</span>
        <div className="roster-pokemon-types">
          {pokemon.types.map(type => (
            <span key={type} className={`type-badge type-${type}`}>
              {type}
            </span>
          ))}
        </div>
      </div>
      {onMoveToStorage && (
        <button
          className="move-to-storage-button"
          onClick={(e) => {
            e.stopPropagation()
            onMoveToStorage(pokemon.id)
          }}
          disabled={disabled}
          title="Move to Storage"
        >
          Store
        </button>
      )}
    </div>
  )
}
