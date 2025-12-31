import { supabase, withTimeout } from '../../lib/supabase'
import { getPokemonById, calculateHP } from '../../lib/pokemonData'

/**
 * POST /api/calculate-hp - Calculate HP preview for a Pokemon
 * Does not save to database - used for UI preview before confirming
 */
async function handler(req, res) {
  if (req.method !== 'POST') {
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

    const { pokemonId, level, hpMethod } = req.body || {}

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

    // Validate hpMethod
    if (!hpMethod || (hpMethod !== 'average' && hpMethod !== 'roll')) {
      return res.status(400).json({
        success: false,
        error: "HP method must be 'average' or 'roll'",
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

    // Get CON score from Pokemon attributes
    const conScore = pokemon.attributes?.con || 10
    const hitDice = pokemon.hitDice || 'd6'

    // Calculate HP
    const result = calculateHP(hitDice, conScore, parsedLevel, hpMethod)

    return res.status(200).json({
      success: true,
      hp: result.hp,
      maxHp: result.maxHp,
      rolls: result.rolls,
      breakdown: result.breakdown,
    })
  } catch (error) {
    console.error('Error calculating HP:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to calculate HP. Please try again.',
    })
  }
}

export default withTimeout(handler)
