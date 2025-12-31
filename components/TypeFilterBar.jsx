import { useState } from 'react'

const POKEMON_TYPES = [
  'bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting',
  'fire', 'flying', 'ghost', 'grass', 'ground', 'ice',
  'normal', 'poison', 'psychic', 'rock', 'steel', 'water'
]

export default function TypeFilterBar({ selectedTypes, onTypesChange, disabled }) {
  function handleTypeClick(type) {
    if (disabled) return

    if (selectedTypes.includes(type)) {
      // Deselect if already selected
      onTypesChange(selectedTypes.filter(t => t !== type))
    } else if (selectedTypes.length < 2) {
      // Add if under limit
      onTypesChange([...selectedTypes, type])
    } else {
      // Replace oldest selection (first in array)
      onTypesChange([selectedTypes[1], type])
    }
  }

  return (
    <div className="type-filter-bar">
      <h3 className="type-filter-title">Select 1 or 2 Types</h3>
      <div className="type-buttons">
        {POKEMON_TYPES.map(type => (
          <button
            key={type}
            className={`type-filter-button type-${type} ${selectedTypes.includes(type) ? 'selected' : ''}`}
            onClick={() => handleTypeClick(type)}
            disabled={disabled}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
      {selectedTypes.length > 0 && (
        <div className="selected-types-display">
          Showing: {selectedTypes.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(' or ')}
        </div>
      )}
    </div>
  )
}
