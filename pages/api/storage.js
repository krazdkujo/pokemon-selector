import { supabase, withTimeout, createAuthenticatedClient } from '../../lib/supabase'
import { buildPlayerPokemonResponse } from '../../lib/pokemonData'

/**
 * GET /api/storage - Get user's Pokemon in storage with pagination
 * POST /api/storage - Move Pokemon from storage to active roster
 */
async function handler(req, res) {
  if (req.method === 'GET') {
    return handleGetStorage(req, res)
  } else if (req.method === 'POST') {
    return handleMoveToActive(req, res)
  } else {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }
}

export default withTimeout(handler)

/**
 * GET handler - Returns user's stored Pokemon with pagination
 */
async function handleGetStorage(req, res) {
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

    // Parse pagination params
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20))
    const offset = (page - 1) * limit

    // Get count of stored Pokemon
    const { count, error: countError } = await authClient
      .from('player_pokemon')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_active', false)

    if (countError) {
      console.error('Database error counting storage:', countError)
    }

    // Get stored Pokemon with pagination
    const { data: storedPokemon, error: dbError } = await authClient
      .from('player_pokemon')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', false)
      .order('acquired_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (dbError) {
      console.error('Database error fetching storage:', dbError)
      return res.status(500).json({
        success: false,
        error: 'Failed to load storage. Please try again.',
      })
    }

    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    const storage = (storedPokemon || []).map(record =>
      buildPlayerPokemonResponse(record)
    )

    return res.status(200).json({
      success: true,
      storage,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    })
  } catch (error) {
    console.error('Error fetching storage:', error)
    return res.status(500).json({
      success: false,
      error: 'An error occurred. Please try again.',
    })
  }
}

/**
 * POST handler - Move Pokemon from storage to active roster
 */
async function handleMoveToActive(req, res) {
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

    const { pokemonDbId, targetSlot } = req.body || {}

    if (!pokemonDbId) {
      return res.status(400).json({
        success: false,
        error: 'Pokemon ID is required',
      })
    }

    // Verify Pokemon exists, belongs to user, and is in storage
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

    if (pokemon.is_active) {
      return res.status(400).json({
        success: false,
        error: 'Pokemon is already in active roster',
      })
    }

    // Count active Pokemon
    const { count: activeCount } = await authClient
      .from('player_pokemon')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_active', true)

    if (activeCount >= 6) {
      return res.status(400).json({
        success: false,
        error: 'Active roster is full (6/6)',
      })
    }

    // Find available slot
    let slotToUse = targetSlot

    if (slotToUse) {
      // Validate target slot
      if (slotToUse < 1 || slotToUse > 6) {
        return res.status(400).json({
          success: false,
          error: 'Invalid target slot',
        })
      }

      // Check if slot is occupied
      const { data: existingInSlot } = await authClient
        .from('player_pokemon')
        .select('id')
        .eq('user_id', user.id)
        .eq('slot_number', slotToUse)
        .single()

      if (existingInSlot) {
        return res.status(400).json({
          success: false,
          error: 'Slot already occupied',
        })
      }
    } else {
      // Find first available slot
      const { data: occupiedSlots } = await authClient
        .from('player_pokemon')
        .select('slot_number')
        .eq('user_id', user.id)
        .eq('is_active', true)

      const usedSlots = new Set((occupiedSlots || []).map(p => p.slot_number))
      for (let s = 1; s <= 6; s++) {
        if (!usedSlots.has(s)) {
          slotToUse = s
          break
        }
      }
    }

    if (!slotToUse) {
      return res.status(400).json({
        success: false,
        error: 'No available slots',
      })
    }

    // Move to active roster
    const { data: updatedPokemon, error: updateError } = await authClient
      .from('player_pokemon')
      .update({
        is_active: true,
        slot_number: slotToUse,
      })
      .eq('id', pokemonDbId)
      .select()
      .single()

    if (updateError) {
      console.error('Database error moving to active:', updateError)
      return res.status(500).json({
        success: false,
        error: 'Failed to move Pokemon. Please try again.',
      })
    }

    return res.status(200).json({
      success: true,
      pokemon: buildPlayerPokemonResponse(updatedPokemon),
      slotNumber: slotToUse,
    })
  } catch (error) {
    console.error('Error moving to active:', error)
    return res.status(500).json({
      success: false,
      error: 'An error occurred. Please try again.',
    })
  }
}
