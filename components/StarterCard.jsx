export default function StarterCard({ pokemon, onClick, disabled }) {
  return (
    <div
      className={`starter-card ${disabled ? 'disabled' : ''}`}
      onClick={() => !disabled && onClick(pokemon)}
    >
      <img
        src={pokemon.spriteUrl}
        alt={pokemon.name}
        className="starter-sprite"
      />
      <div className="starter-info">
        <h4 className="starter-name">
          #{pokemon.number} {pokemon.name}
        </h4>
        <div className="starter-types">
          {pokemon.types.map(type => (
            <span key={type} className={`type-badge type-${type}`}>
              {type}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
