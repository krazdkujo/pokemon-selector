import { supabase, withTimeout } from '../../lib/supabase'
import {
  getPokemonById,
  getAvailableMovesForLevel,
  getMovesWithDetails,
} from '../../lib/pokemonData'

/**
 * GET /api/pokemon-moves - Get available moves for a Pokemon at a given level
 */
async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    // Authentication check
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    const { pokemonId, level } = req.query

    // Validate pokemonId
    if (!pokemonId) {
      return res.status(400).json({
        success: false,
        error: 'Pokemon ID is required',
      })
    }

    // Validate level
    const parsedLevel = parseInt(level, 10)
    if (isNaN(parsedLevel) || parsedLevel < 1 || parsedLevel > 20) {
      return res.status(400).json({
        success: false,
        error: 'Level must be between 1 and 20',
      })
    }

    // Get Pokemon data
    const pokemon = getPokemonById(pokemonId.toLowerCase())
    if (!pokemon) {
      return res.status(404).json({
        success: false,
        error: 'Pokemon not found',
      })
    }

    // Get available move IDs for this level
    const availableMoveIds = getAvailableMovesForLevel(pokemon, parsedLevel)

    // Get full move details
    const moves = getMovesWithDetails(availableMoveIds, parsedLevel, pokemon)

    // Organize moves by level for display
    const movesByLevel = {}
    if (pokemon.moves) {
      for (const [key, moveList] of Object.entries(pokemon.moves)) {
        if (key === 'tm' || key === 'egg') continue
        if (!Array.isArray(moveList)) continue

        let levelKey = 1
        if (key === 'start') {
          levelKey = 1
        } else if (key.startsWith('level')) {
          levelKey = parseInt(key.replace('level', ''), 10)
        } else {
          continue
        }

        // Only include moves up to the current level
        if (levelKey <= parsedLevel) {
          movesByLevel[levelKey] = moveList
        }
      }
    }

    return res.status(200).json({
      success: true,
      pokemonId: pokemon.id,
      level: parsedLevel,
      moves,
      movesByLevel,
    })
  } catch (error) {
    console.error('Error fetching Pokemon moves:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to load moves. Please try again.',
    })
  }
}

export default withTimeout(handler)
