import { supabase, withTimeout, createAuthenticatedClient } from '../../lib/supabase'
import { buildPlayerPokemonResponse } from '../../lib/pokemonData'

/**
 * GET /api/roster - Get user's active Pokemon roster (6 slots)
 * PUT /api/roster - Update roster (move to storage)
 */
async function handler(req, res) {
  if (req.method === 'GET') {
    return handleGetRoster(req, res)
  } else if (req.method === 'PUT') {
    return handleUpdateRoster(req, res)
  } else {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }
}

export default withTimeout(handler)

/**
 * GET handler - Returns user's active roster as 6 slots
 */
async function handleGetRoster(req, res) {
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

    // Create authenticated client for RLS
    const authClient = createAuthenticatedClient(token)

    // Get user's active Pokemon
    const { data: activePokemon, error: dbError } = await authClient
      .from('player_pokemon')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('slot_number', { ascending: true })

    if (dbError) {
      console.error('Database error fetching roster:', dbError)
      return res.status(500).json({
        success: false,
        error: 'Failed to load roster. Please try again.',
      })
    }

    // Build 6-slot roster response
    const roster = []
    for (let slot = 1; slot <= 6; slot++) {
      const pokemonInSlot = activePokemon?.find(p => p.slot_number === slot)
      roster.push({
        slotNumber: slot,
        pokemon: pokemonInSlot ? buildPlayerPokemonResponse(pokemonInSlot) : null,
      })
    }

    return res.status(200).json({
      success: true,
      roster,
      activeCount: activePokemon?.length || 0,
    })
  } catch (error) {
    console.error('Error fetching roster:', error)
    return res.status(500).json({
      success: false,
      error: 'An error occurred. Please try again.',
    })
  }
}

/**
 * PUT handler - Move Pokemon to storage
 */
async function handleUpdateRoster(req, res) {
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

    // Create authenticated client for RLS
    const authClient = createAuthenticatedClient(token)

    const { pokemonDbId, action, targetSlot } = req.body || {}

    if (!pokemonDbId || !action) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      })
    }

    // Verify Pokemon exists and belongs to user
    const { data: pokemon, error: findError } = await authClient
      .from('player_pokemon')
      .select('*')
      .eq('id', pokemonDbId)
      .eq('user_id', user.id)
      .single()

    if (findError || !pokemon) {
      return res.status(404).json({
        success: false,
        error: 'Pokemon not found',
      })
    }

    if (action === 'moveToStorage') {
      if (!pokemon.is_active) {
        return res.status(400).json({
          success: false,
          error: 'Pokemon is already in storage',
        })
      }

      // Move to storage
      const { error: updateError } = await authClient
        .from('player_pokemon')
        .update({
          is_active: false,
          slot_number: null,
        })
        .eq('id', pokemonDbId)

      if (updateError) {
        console.error('Database error moving to storage:', updateError)
        return res.status(500).json({
          success: false,
          error: 'Failed to move Pokemon. Please try again.',
        })
      }
    } else if (action === 'moveToSlot') {
      // Check if target slot is valid
      if (!targetSlot || targetSlot < 1 || targetSlot > 6) {
        return res.status(400).json({
          success: false,
          error: 'Invalid target slot',
        })
      }

      // Check if slot is already occupied
      const { data: existingInSlot } = await authClient
        .from('player_pokemon')
        .select('id')
        .eq('user_id', user.id)
        .eq('slot_number', targetSlot)
        .single()

      if (existingInSlot) {
        return res.status(400).json({
          success: false,
          error: 'Slot already occupied',
        })
      }

      // Move to slot
      const { error: updateError } = await authClient
        .from('player_pokemon')
        .update({
          is_active: true,
          slot_number: targetSlot,
        })
        .eq('id', pokemonDbId)

      if (updateError) {
        console.error('Database error moving to slot:', updateError)
        return res.status(500).json({
          success: false,
          error: 'Failed to move Pokemon. Please try again.',
        })
      }
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid action',
      })
    }

    // Return updated roster
    const { data: activePokemon, error: fetchError } = await authClient
      .from('player_pokemon')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('slot_number', { ascending: true })

    if (fetchError) {
      console.error('Database error fetching updated roster:', fetchError)
    }

    const roster = []
    for (let slot = 1; slot <= 6; slot++) {
      const pokemonInSlot = activePokemon?.find(p => p.slot_number === slot)
      roster.push({
        slotNumber: slot,
        pokemon: pokemonInSlot ? buildPlayerPokemonResponse(pokemonInSlot) : null,
      })
    }

    return res.status(200).json({
      success: true,
      roster,
    })
  } catch (error) {
    console.error('Error updating roster:', error)
    return res.status(500).json({
      success: false,
      error: 'An error occurred. Please try again.',
    })
  }
}
