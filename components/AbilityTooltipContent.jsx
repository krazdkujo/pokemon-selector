export default function AbilityTooltipContent({ ability, isHidden, loading }) {
  if (loading) {
    return <div className="tooltip-loading">Loading...</div>
  }

  if (!ability) {
    return <div className="tooltip-error">Details unavailable</div>
  }

  return (
    <div className="ability-tooltip-content">
      <div className="tooltip-header">
        <span className="tooltip-name">{ability.name}</span>
        {isHidden && (
          <span className="tooltip-hidden-badge">Hidden</span>
        )}
      </div>

      <p className="tooltip-description">{ability.description}</p>
    </div>
  )
}
