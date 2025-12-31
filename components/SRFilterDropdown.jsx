export default function SRFilterDropdown({ selectedSR, onSRChange, srValues }) {
  function handleChange(e) {
    const value = e.target.value
    if (value === '') {
      onSRChange(null)
    } else {
      onSRChange(parseFloat(value))
    }
  }

  return (
    <div className="sr-filter-dropdown">
      <label htmlFor="sr-filter" className="sr-filter-label">
        Filter by SR (Rarity)
      </label>
      <select
        id="sr-filter"
        value={selectedSR === null ? '' : selectedSR}
        onChange={handleChange}
        className="sr-filter-select"
      >
        <option value="">All Rarities</option>
        <optgroup label="Starters (SR 0.5 or less)">
          {srValues
            .filter(sr => sr <= 0.5)
            .map(sr => (
              <option key={sr} value={sr}>
                SR {sr}
              </option>
            ))}
        </optgroup>
        <optgroup label="Standard">
          {srValues
            .filter(sr => sr > 0.5)
            .map(sr => (
              <option key={sr} value={sr}>
                SR {sr}
              </option>
            ))}
        </optgroup>
      </select>
    </div>
  )
}
