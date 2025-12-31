import TypeFilterBar from './TypeFilterBar'
import SRFilterDropdown from './SRFilterDropdown'

export default function CollectionFilterBar({
  selectedTypes,
  onTypesChange,
  selectedSR,
  onSRChange,
  srValues,
  onClearAll,
}) {
  const hasFilters = selectedTypes.length > 0 || selectedSR !== null

  return (
    <div className="collection-filter-bar">
      <TypeFilterBar
        selectedTypes={selectedTypes}
        onTypesChange={onTypesChange}
        disabled={false}
      />

      <SRFilterDropdown
        selectedSR={selectedSR}
        onSRChange={onSRChange}
        srValues={srValues}
      />

      {hasFilters && (
        <div className="filter-actions">
          <button
            className="clear-filters-button"
            onClick={onClearAll}
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  )
}
