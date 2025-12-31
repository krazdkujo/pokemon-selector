import { supabase, withTimeout, createAuthenticatedClient } from '../../lib/supabase'
import {
  getAllPokemon,
  getPokemonTypes,
  getSRValues,
} from '../../lib/pokemonData'

/**
 * GET /api/collection - Get all Pokemon for collection view
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

    // Create authenticated client for RLS
    const authClient = createAuthenticatedClient(token)

    // Get all Pokemon from Source data
    const allPokemon = getAllPokemon()
    const types = getPokemonTypes()
    const srValues = getSRValues()

    // Check if user has a starter (any Pokemon in their roster)
    const { data: existingPokemon, error: dbError } = await authClient
      .from('player_pokemon')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)

    if (dbError) {
      console.error('Database error checking starter:', dbError)
    }

    const hasStarter = existingPokemon && existingPokemon.length > 0

    // Format Pokemon for response, sorted by Pokedex number
    // Filter out Pokemon with number 0 (invalid/placeholder entries)
    const formattedPokemon = allPokemon
      .filter(pokemon => pokemon.number > 0)
      .sort((a, b) => a.number - b.number)
      .map(pokemon => ({
        id: pokemon.id,
        name: pokemon.name,
        number: pokemon.number,
        types: pokemon.type || [],
        sr: pokemon.sr,
        spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.number}.png`,
        description: pokemon.description,
        attributes: pokemon.attributes,
        abilities: pokemon.abilities,
        moves: pokemon.moves,
        hp: pokemon.hp,
        ac: pokemon.ac,
        size: pokemon.size,
        minLevel: pokemon.minLevel,
        hitDice: pokemon.hitDice,
        speed: pokemon.speed,
        skills: pokemon.skills,
        savingThrows: pokemon.savingThrows,
        evolution: pokemon.evolution,
        media: pokemon.media,
      }))

    return res.status(200).json({
      success: true,
      pokemon: formattedPokemon,
      types,
      srValues,
      hasStarter,
    })
  } catch (error) {
    console.error('Error fetching collection:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to load Pokemon collection. Please try again.',
    })
  }
}

export default withTimeout(handler)
