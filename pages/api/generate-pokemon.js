import {
  getAllPokemon,
  getPokemonById,
  getAllNatures,
  getAllMoves,
  getMoveById,
  getAbilityById,
  getEvolutionsByPokemon,
} from '../../lib/pokemonData'

/**
 * Select a random Pokemon from the full dataset
 * @returns {Object} Random Pokemon object
 */
function selectRandomPokemon() {
  const allPokemon = getAllPokemon()
  const randomIndex = Math.floor(Math.random() * allPokemon.length)
  return allPokemon[randomIndex]
}

/**
 * Select 4 moves from the Pokemon's level-appropriate move pool
 * @param {Object} pokemon - Pokemon object with moves data
 * @param {number} level - Pokemon level (default 5)
 * @returns {Array} Array of 4 move objects with full details
 */
function selectMovesForLevel(pokemon, level = 5) {
  const movePool = []
  const moves = pokemon.moves || {}

  // Add start moves (always available)
  if (moves.start) {
    movePool.push(...moves.start)
  }

  // Add level-based moves up to current level
  if (level >= 2 && moves.level2) movePool.push(...moves.level2)
  if (level >= 6 && moves.level6) movePool.push(...moves.level6)
  if (level >= 10 && moves.level10) movePool.push(...moves.level10)
  if (level >= 14 && moves.level14) movePool.push(...moves.level14)
  if (level >= 18 && moves.level18) movePool.push(...moves.level18)

  // If not enough moves, add TM moves as fallback
  if (movePool.length < 4 && moves.tm) {
    // TM moves are stored as numbers, we need to get their IDs from TM data
    // For now, skip TMs as they require additional lookup
  }

  // Shuffle and pick 4 (or fewer if pool is smaller)
  const shuffled = movePool.sort(() => Math.random() - 0.5)
  const selectedMoveIds = shuffled.slice(0, 4)

  // Get full move details
  const selectedMoves = selectedMoveIds
    .map(moveId => getMoveById(moveId))
    .filter(move => move !== undefined)
    .map(move => ({
      id: move.id,
      name: move.name,
      type: move.type,
      description: move.description,
      pp: move.pp,
      range: move.range,
    }))

  // If we still don't have 4 moves, pad with what we have
  return selectedMoves
}

/**
 * Select an ability from the Pokemon's ability list
 * 90% chance for normal ability, 10% for hidden
 * @param {Object} pokemon - Pokemon object with abilities data
 * @returns {Object} Selected ability with isHidden flag
 */
function selectAbility(pokemon) {
  const abilities = pokemon.abilities || []
  if (abilities.length === 0) {
    return { id: 'unknown', name: 'Unknown', description: 'No ability data', isHidden: false }
  }

  const normalAbilities = abilities.filter(a => !a.hidden)
  const hiddenAbilities = abilities.filter(a => a.hidden)

  // 10% chance for hidden ability if one exists
  const useHidden = hiddenAbilities.length > 0 && Math.random() < 0.1

  let selected
  if (useHidden) {
    selected = hiddenAbilities[Math.floor(Math.random() * hiddenAbilities.length)]
  } else if (normalAbilities.length > 0) {
    selected = normalAbilities[Math.floor(Math.random() * normalAbilities.length)]
  } else {
    selected = abilities[0]
  }

  // Get full ability details
  const fullAbility = getAbilityById(selected.id)

  return {
    id: selected.id,
    name: fullAbility?.name || selected.id,
    description: fullAbility?.description || selected.description || '',
    isHidden: selected.hidden || false,
  }
}

/**
 * Select a random nature from the 25 available natures
 * @returns {Object} Nature object with id, name, and effect
 */
function selectNature() {
  const natures = getAllNatures()
  const randomIndex = Math.floor(Math.random() * natures.length)
  const nature = natures[randomIndex]

  return {
    id: nature.id,
    name: nature.name,
    effect: nature.effect,
    increasedStat: nature.increasedStat,
    decreasedStat: nature.decreasedStat,
  }
}

/**
 * Apply nature stat modifiers to base stats
 * @param {Object} stats - Base stats object
 * @param {Object} nature - Nature object with stat modifiers
 * @returns {Object} Modified stats object
 */
function applyNatureModifiers(stats, nature) {
  const modified = { ...stats }

  // Only apply if increased and decreased stats are different (not neutral)
  if (nature.increasedStat !== nature.decreasedStat) {
    if (modified[nature.increasedStat] !== undefined) {
      modified[nature.increasedStat] += 1
    }
    if (modified[nature.decreasedStat] !== undefined) {
      modified[nature.decreasedStat] -= 1
    }
  }

  return modified
}

/**
 * Get evolution information for a Pokemon
 * @param {string} pokemonId - Pokemon ID
 * @returns {Object|null} Evolution info or null if no evolutions
 */
function getEvolutionInfo(pokemonId) {
  const evolutions = getEvolutionsByPokemon(pokemonId)
  const allPokemon = getAllPokemon()

  const result = {}

  // Get "evolves to" info
  if (evolutions.evolvesTo.length > 0) {
    const evo = evolutions.evolvesTo[0]
    const toPokemon = allPokemon.find(p => p.id === evo.to)
    result.evolvesTo = evo.to
    result.evolvesToName = toPokemon?.name || evo.to
    if (evo.conditions && evo.conditions.length > 0) {
      const levelCondition = evo.conditions.find(c => c.type === 'level')
      if (levelCondition) {
        result.condition = `Level ${levelCondition.value}`
      }
    }
  }

  // Get "evolves from" info
  if (evolutions.evolvesFrom.length > 0) {
    const evo = evolutions.evolvesFrom[0]
    const fromPokemon = allPokemon.find(p => p.id === evo.from)
    result.evolvesFrom = evo.from
    result.evolvesFromName = fromPokemon?.name || evo.from
  }

  return Object.keys(result).length > 0 ? result : null
}

/**
 * Build the full GeneratedPokemon response object
 * @param {Object} pokemon - Base Pokemon data
 * @param {Array} moves - Selected moves
 * @param {Object} ability - Selected ability
 * @param {Object} nature - Selected nature
 * @param {Object|null} evolution - Evolution info
 * @param {number} level - Pokemon level
 * @returns {Object} Full GeneratedPokemon object
 */
function buildGeneratedPokemon(pokemon, moves, ability, nature, evolution, level) {
  const baseStats = {
    str: pokemon.attributes?.str || 10,
    dex: pokemon.attributes?.dex || 10,
    con: pokemon.attributes?.con || 10,
    int: pokemon.attributes?.int || 10,
    wis: pokemon.attributes?.wis || 10,
    cha: pokemon.attributes?.cha || 10,
    hp: pokemon.hp || 10,
    ac: pokemon.ac || 10,
  }

  const modifiedStats = applyNatureModifiers(baseStats, nature)

  return {
    id: pokemon.id,
    name: pokemon.name,
    number: pokemon.number,
    types: pokemon.type || [],
    size: pokemon.size,
    description: pokemon.description,
    spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.number}.png`,
    level,
    baseStats,
    modifiedStats,
    nature: {
      id: nature.id,
      name: nature.name,
      effect: nature.effect,
    },
    ability,
    moves,
    evolution,
    speed: pokemon.speed || [],
    skills: pokemon.skills || [],
    savingThrows: pokemon.savingThrows || [],
  }
}

/**
 * POST /api/generate-pokemon
 * Generate a random or specific Pokemon with moves, ability, and nature
 */
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { pokemonId, level = 5, random = true } = req.body || {}

    // Validate level
    const parsedLevel = parseInt(level, 10)
    if (isNaN(parsedLevel) || parsedLevel < 1 || parsedLevel > 20) {
      return res.status(400).json({
        success: false,
        error: 'Invalid level parameter. Must be between 1 and 20.',
      })
    }

    let pokemon

    if (pokemonId) {
      // Generate specific Pokemon
      pokemon = getPokemonById(pokemonId.toLowerCase())
      if (!pokemon) {
        return res.status(404).json({
          success: false,
          error: 'Pokemon not found. Please try a different name.',
        })
      }
    } else {
      // Generate random Pokemon
      pokemon = selectRandomPokemon()
    }

    // Select moves, ability, nature
    const moves = selectMovesForLevel(pokemon, parsedLevel)
    const ability = selectAbility(pokemon)
    const nature = selectNature()
    const evolution = getEvolutionInfo(pokemon.id)

    // Build full response
    const generatedPokemon = buildGeneratedPokemon(
      pokemon,
      moves,
      ability,
      nature,
      evolution,
      parsedLevel
    )

    return res.status(200).json({
      success: true,
      pokemon: generatedPokemon,
    })
  } catch (error) {
    console.error('Pokemon generation error:', error)

    // Check for Source data errors
    if (error.message?.includes('File not found') || error.message?.includes('Malformed JSON')) {
      return res.status(500).json({
        success: false,
        error: 'Pokemon data unavailable. Please try again later.',
      })
    }

    return res.status(500).json({
      success: false,
      error: 'An error occurred during generation. Please try again.',
    })
  }
}
