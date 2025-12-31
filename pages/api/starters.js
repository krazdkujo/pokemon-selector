import { supabase, withTimeout, createAuthenticatedClient } from '../../lib/supabase'
import {
  getStarterPokemon,
  getPokemonTypes,
  getPokemonById,
  buildPlayerPokemonResponse,
  getAvailableMovesForLevel,
  calculateHP,
} from '../../lib/pokemonData'

/**
 * GET /api/starters - Get all eligible starter Pokemon and types
 * POST /api/starters - Select a starter Pokemon
 */
async function handler(req, res) {
  if (req.method === 'GET') {
    return handleGetStarters(req, res)
  } else if (req.method === 'POST') {
    return handleSelectStarter(req, res)
  } else {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }
}

export default withTimeout(handler)

/**
 * GET handler - Returns all starter Pokemon, types list, and hasStarter flag
 */
async function handleGetStarters(req, res) {
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

    // Get starter Pokemon from Source data
    const starters = getStarterPokemon()
    const types = getPokemonTypes()

    // Check if user already has a starter (any Pokemon in their roster)
    const { data: existingPokemon, error: dbError } = await authClient
      .from('player_pokemon')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)

    if (dbError) {
      console.error('Database error checking starter:', dbError)
      // Continue even if DB check fails - just assume no starter
    }

    const hasStarter = existingPokemon && existingPokemon.length > 0

    // Format starters for response
    const formattedStarters = starters.map(pokemon => ({
      id: pokemon.id,
      name: pokemon.name,
      number: pokemon.number,
      types: pokemon.type || [],
      sr: pokemon.sr,
      spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.number}.png`,
      description: pokemon.description,
      attributes: pokemon.attributes,
      abilities: pokemon.abilities,
      hp: pokemon.hp,
      ac: pokemon.ac,
    }))

    return res.status(200).json({
      success: true,
      starters: formattedStarters,
      hasStarter,
      types,
    })
  } catch (error) {
    console.error('Error fetching starters:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to load starter Pokemon. Please try again.',
    })
  }
}

/**
 * POST handler - Select a starter Pokemon
 */
async function handleSelectStarter(req, res) {
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

    const { pokemonId, nickname, selectedMoves, hpMethod } = req.body || {}

    // Validate pokemonId
    if (!pokemonId || typeof pokemonId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Pokemon ID is required',
      })
    }

    // Verify Pokemon exists and is eligible as starter
    const pokemon = getPokemonById(pokemonId.toLowerCase())
    if (!pokemon) {
      return res.status(404).json({
        success: false,
        error: 'Pokemon not found',
      })
    }

    if (pokemon.sr > 0.5) {
      return res.status(400).json({
        success: false,
        error: 'This Pokemon is not eligible as a starter',
      })
    }

    // Validate selectedMoves (if provided)
    const level = 1 // Starters are always level 1
    let validatedMoves = null
    if (selectedMoves) {
      if (!Array.isArray(selectedMoves) || selectedMoves.length === 0 || selectedMoves.length > 4) {
        return res.status(400).json({
          success: false,
          error: 'Must select between 1 and 4 moves',
        })
      }

      // Verify each move is valid for this Pokemon at level 1
      const availableMoves = getAvailableMovesForLevel(pokemon, level)
      for (const moveId of selectedMoves) {
        if (!availableMoves.includes(moveId)) {
          return res.status(400).json({
            success: false,
            error: `Invalid move: ${moveId}`,
          })
        }
      }
      validatedMoves = selectedMoves
    }

    // Validate hpMethod (if provided)
    let hpResult = null
    if (hpMethod) {
      if (hpMethod !== 'average' && hpMethod !== 'roll') {
        return res.status(400).json({
          success: false,
          error: "HP method must be 'average' or 'roll'",
        })
      }

      // Calculate HP
      const conScore = pokemon.attributes?.con || 10
      const hitDice = pokemon.hitDice || 'd6'
      hpResult = calculateHP(hitDice, conScore, level, hpMethod)
    }

    // Check if user already has a starter (using authenticated client)
    const { data: existingPokemon, error: checkError } = await authClient
      .from('player_pokemon')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)

    if (checkError) {
      console.error('Database error checking existing Pokemon:', checkError)
      return res.status(500).json({
        success: false,
        error: 'Failed to check existing Pokemon. Please try again.',
      })
    }

    if (existingPokemon && existingPokemon.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'You already have a starter! Visit your Pokemon collection to manage your team.',
      })
    }

    // Build insert data
    const insertData = {
      user_id: user.id,
      pokemon_id: pokemonId.toLowerCase(),
      is_active: true,
      slot_number: 1,
      level: 1,
      nickname: nickname || null,
    }

    // Add move and HP data if provided
    if (validatedMoves) {
      insertData.selected_moves = validatedMoves
    }
    if (hpResult) {
      insertData.current_hp = hpResult.hp
      insertData.max_hp = hpResult.maxHp
      insertData.hp_method = hpMethod
      insertData.hp_rolls = hpResult.rolls
    }

    // Insert new Pokemon as starter (slot 1, active) using authenticated client
    const { data: newPokemon, error: insertError } = await authClient
      .from('player_pokemon')
      .insert(insertData)
      .select()
      .single()

    if (insertError) {
      console.error('Database error inserting Pokemon:', insertError)
      return res.status(500).json({
        success: false,
        error: 'Failed to save your starter Pokemon. Please try again.',
      })
    }

    // Build response with full Pokemon details
    const response = buildPlayerPokemonResponse(newPokemon, pokemon)

    return res.status(201).json({
      success: true,
      pokemon: response,
    })
  } catch (error) {
    console.error('Error selecting starter:', error)
    return res.status(500).json({
      success: false,
      error: 'An error occurred. Please try again.',
    })
  }
}
