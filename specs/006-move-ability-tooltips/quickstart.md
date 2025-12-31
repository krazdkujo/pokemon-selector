# Quickstart: Move and Ability Hover Tooltips

**Feature**: 006-move-ability-tooltips
**Date**: 2025-12-31

## Overview

This feature adds hover tooltips to all move and ability names in the Pokemon detail modal. Users can hover (or tap/focus) to see complete information without leaving the modal.

## Prerequisites

- Node.js 18+
- Existing Pokemon Selector codebase with:
  - `Source/moves/moves.json` - Move data
  - `Source/abilities/abilities.json` - Ability data
  - `components/PokemonDetailModal.jsx` - Target component
  - `lib/pokemonData.js` - Data utilities

## Key Files

| File | Purpose |
|------|---------|
| `pages/api/tooltip-data.js` | API endpoint for move/ability lookup |
| `components/Tooltip.jsx` | Reusable tooltip component |
| `components/MoveTooltipContent.jsx` | Move-specific tooltip layout |
| `components/AbilityTooltipContent.jsx` | Ability-specific tooltip layout |
| `components/PokemonDetailModal.jsx` | Updated to wrap moves/abilities with tooltips |
| `styles/globals.css` | Tooltip styles |

## Implementation Steps

### Step 1: Create API Endpoint

Create `pages/api/tooltip-data.js`:

```javascript
import { getMoveById, getAbilityById } from '../../lib/pokemonData'

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { type, id } = req.query

  if (!type || !id) {
    return res.status(400).json({ success: false, error: 'Missing required parameters' })
  }

  if (type === 'move') {
    const move = getMoveById(id)
    if (!move) {
      return res.status(404).json({ success: false, error: `Move not found: ${id}` })
    }
    return res.json({ success: true, type: 'move', data: move })
  }

  if (type === 'ability') {
    const ability = getAbilityById(id)
    if (!ability) {
      return res.status(404).json({ success: false, error: `Ability not found: ${id}` })
    }
    return res.json({ success: true, type: 'ability', data: ability })
  }

  return res.status(400).json({ success: false, error: 'Invalid type parameter' })
}
```

### Step 2: Create Tooltip Component

Create `components/Tooltip.jsx`:

```javascript
import { useState, useEffect, useRef } from 'react'

export default function Tooltip({ children, content, isVisible, onClose }) {
  const tooltipRef = useRef(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  // Position calculation and viewport boundary detection
  // ...implementation details in tasks

  if (!isVisible) return null

  return (
    <div
      ref={tooltipRef}
      className="tooltip"
      role="tooltip"
      style={{ top: position.top, left: position.left }}
    >
      {content}
    </div>
  )
}
```

### Step 3: Create Content Components

Create `components/MoveTooltipContent.jsx`:

```javascript
export default function MoveTooltipContent({ move }) {
  if (!move) {
    return <div className="tooltip-error">Details unavailable</div>
  }

  return (
    <div className="move-tooltip">
      <div className="tooltip-header">
        <span className="move-name">{move.name}</span>
        <span className={`type-badge type-${move.type}`}>{move.type}</span>
      </div>
      <div className="tooltip-stats">
        <span>PP: {move.pp}</span>
        <span>Time: {move.time}</span>
        <span>Range: {move.range}</span>
      </div>
      <p className="tooltip-description">{move.description}</p>
      {move.higherLevels && (
        <p className="tooltip-higher-levels">{move.higherLevels}</p>
      )}
    </div>
  )
}
```

### Step 4: Update PokemonDetailModal

Wrap move/ability names with tooltip triggers:

```javascript
// In moves section
{startMoves.map(move => (
  <TooltipTrigger
    key={move}
    type="move"
    id={move}
    onHover={handleTooltipShow}
  >
    <span className="move-tag hoverable">
      {formatMoveName(move)}
    </span>
  </TooltipTrigger>
))}
```

### Step 5: Add Styles

Add to `styles/globals.css`:

```css
.tooltip {
  position: fixed;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  padding: 12px;
  max-width: 300px;
  z-index: 1000;
}

.hoverable {
  cursor: help;
  text-decoration: underline dotted;
}
```

## Testing

1. Start dev server: `npm run dev`
2. Navigate to dashboard and click a Pokemon to open modal
3. Hover over any move name in Starting/Level-Up/TM moves
4. Verify tooltip appears with move details
5. Hover over ability names and verify tooltip appears
6. Test keyboard navigation (Tab to focus)
7. Test on mobile (tap to show)

## API Reference

### GET /api/tooltip-data

Query parameters:
- `type`: "move" or "ability"
- `id`: Move/ability ID (kebab-case)

Response:
```json
{
  "success": true,
  "type": "move",
  "data": { /* move object */ }
}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Tooltip not appearing | Check console for API errors, verify move ID format |
| Tooltip cut off | Check viewport boundary detection logic |
| "Details unavailable" | Move/ability ID not found in Source data |
| Multiple tooltips | Verify single-tooltip state management |
