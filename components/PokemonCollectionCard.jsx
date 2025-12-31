export default function PokemonCollectionCard({ pokemon, onClick }) {
  return (
    <div
      className="collection-card"
      onClick={() => onClick(pokemon)}
    >
      <img
        src={pokemon.spriteUrl}
        alt={pokemon.name}
        className="collection-sprite"
        onError={(e) => {
          e.target.src = '/placeholder-pokemon.png'
          e.target.onerror = null
        }}
      />
      <div className="collection-card-info">
        <h4>#{pokemon.number} {pokemon.name}</h4>
        <div className="collection-types">
          {pokemon.types.map(type => (
            <span key={type} className={`type-badge type-${type}`}>
              {type}
            </span>
          ))}
        </div>
        <div className="collection-sr-badge">
          SR: {pokemon.sr}
        </div>
      </div>
    </div>
  )
}
