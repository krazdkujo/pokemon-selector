export default function MoveTooltipContent({ move, loading }) {
  if (loading) {
    return <div className="tooltip-loading">Loading...</div>
  }

  if (!move) {
    return <div className="tooltip-error">Details unavailable</div>
  }

  // Format power attributes
  const powerText = Array.isArray(move.power)
    ? move.power.map(p => p.toUpperCase()).join('/')
    : move.power === 'none' ? 'None' : move.power

  return (
    <div className="move-tooltip-content">
      <div className="tooltip-header">
        <span className="tooltip-name">{move.name}</span>
        <span className={`type-badge type-${move.type}`}>{move.type}</span>
      </div>

      <div className="tooltip-stats">
        <span>Power: {powerText}</span>
        <span>PP: {move.pp}</span>
        <span>Time: {move.time}</span>
        <span>Range: {move.range}</span>
        {move.duration !== 'instantaneous' && (
          <span>Duration: {move.duration}</span>
        )}
      </div>

      <p className="tooltip-description">{move.description}</p>

      {move.higherLevels && (
        <p className="tooltip-higher-levels">
          <strong>At Higher Levels:</strong> {move.higherLevels}
        </p>
      )}
    </div>
  )
}
