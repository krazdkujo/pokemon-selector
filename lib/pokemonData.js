import fs from 'fs'
import path from 'path'

const SOURCE_DIR = path.join(process.cwd(), 'Source')

/**
 * Safely read and parse a JSON file with error handling
 * @param {string} filePath - Path to the JSON file
 * @returns {any} Parsed JSON data
 * @throws {Error} If file is missing or contains malformed JSON
 */
function readJsonFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`)
    }
    const data = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Malformed JSON in ${filePath}: ${error.message}`)
    }
    throw error
  }
}

/**
 * Get metadata about the Source folder data
 * @returns {Object} Metadata including version, source info, and entity counts
 */
export function getMetadata() {
  const filePath = path.join(SOURCE_DIR, 'metadata.json')
  return readJsonFile(filePath)
}

/**
 * Get all Pokemon from the Source folder
 * @returns {Array} Array of all Pokemon objects
 */
export function getAllPokemon() {
  const filePath = path.join(SOURCE_DIR, 'pokemon', 'pokemon.json')
  return readJsonFile(filePath)
}

/**
 * Get a specific Pokemon by ID
 * @param {string} id - Pokemon ID (kebab-case, e.g., "bulbasaur")
 * @returns {Object|undefined} Pokemon object or undefined if not found
 */
export function getPokemonById(id) {
  const pokemon = getAllPokemon()
  return pokemon.find(p => p.id === id)
}

/**
 * Get all moves from the Source folder
 * @returns {Array} Array of all move objects
 */
export function getAllMoves() {
  const filePath = path.join(SOURCE_DIR, 'moves', 'moves.json')
  return readJsonFile(filePath)
}

/**
 * Get all abilities from the Source folder
 * @returns {Array} Array of all ability objects
 */
export function getAllAbilities() {
  const filePath = path.join(SOURCE_DIR, 'abilities', 'abilities.json')
  return readJsonFile(filePath)
}

/**
 * Check if the Source folder is available and readable
 * @returns {Object} Availability status with entity counts
 */
export function checkSourceAvailability() {
  try {
    const metadata = getMetadata()
    return {
      available: true,
      entityCounts: metadata.entityCounts || {},
    }
  } catch (error) {
    return {
      available: false,
      error: error.message,
    }
  }
}

/**
 * Get all natures from the Source folder
 * @returns {Array} Array of all nature objects
 */
export function getAllNatures() {
  const filePath = path.join(SOURCE_DIR, 'natures', 'natures.json')
  return readJsonFile(filePath)
}

/**
 * Get a specific nature by ID
 * @param {string} id - Nature ID (e.g., "adamant")
 * @returns {Object|undefined} Nature object or undefined if not found
 */
export function getNatureById(id) {
  const natures = getAllNatures()
  return natures.find(n => n.id === id.toLowerCase())
}

/**
 * Get all evolutions from the Source folder
 * @returns {Array} Array of all evolution objects
 */
export function getAllEvolutions() {
  const filePath = path.join(SOURCE_DIR, 'evolution', 'evolution.json')
  return readJsonFile(filePath)
}

/**
 * Get evolution paths for a specific Pokemon
 * @param {string} pokemonId - Pokemon ID to find evolutions for
 * @returns {Object} Object with evolvesTo and evolvesFrom arrays
 */
export function getEvolutionsByPokemon(pokemonId) {
  const evolutions = getAllEvolutions()
  const id = pokemonId.toLowerCase()

  const evolvesTo = evolutions.filter(e => e.from === id)
  const evolvesFrom = evolutions.filter(e => e.to === id)

  return {
    evolvesTo,
    evolvesFrom,
  }
}

/**
 * Get a specific move by ID
 * @param {string} id - Move ID (kebab-case, e.g., "tackle")
 * @returns {Object|undefined} Move object or undefined if not found
 */
export function getMoveById(id) {
  const moves = getAllMoves()
  return moves.find(m => m.id === id.toLowerCase())
}

/**
 * Get a specific ability by ID
 * @param {string} id - Ability ID (e.g., "overgrow")
 * @returns {Object|undefined} Ability object or undefined if not found
 */
export function getAbilityById(id) {
  const abilities = getAllAbilities()
  return abilities.find(a => a.id === id.toLowerCase())
}

/**
 * Get all Pokemon eligible as starters (SR <= 0.5)
 * @returns {Array} Array of starter-eligible Pokemon objects
 */
export function getStarterPokemon() {
  const allPokemon = getAllPokemon()
  return allPokemon.filter(p => p.sr <= 0.5)
}

/**
 * Get all unique Pokemon types from the dataset
 * @returns {Array} Array of type names sorted alphabetically
 */
export function getPokemonTypes() {
  const allPokemon = getAllPokemon()
  const types = new Set()
  allPokemon.forEach(p => {
    if (p.type && Array.isArray(p.type)) {
      p.type.forEach(t => types.add(t))
    }
  })
  return [...types].sort()
}

/**
 * Get all unique SR (spawn rate/rarity) values from the dataset
 * @returns {Array} Array of SR values sorted numerically
 */
export function getSRValues() {
  const allPokemon = getAllPokemon()
  const srValues = new Set()
  allPokemon.forEach(p => {
    if (p.sr !== undefined && p.sr !== null) {
      srValues.add(p.sr)
    }
  })
  return [...srValues].sort((a, b) => a - b)
}

/**
 * Get available moves for a Pokemon at a given level
 * Combines all level-learned moves from "start" through the specified level
 * Excludes TM and egg moves
 * @param {Object} pokemon - Pokemon object with moves data
 * @param {number} level - Pokemon's current level
 * @returns {Array} Array of unique move IDs available at this level
 */
export function getAvailableMovesForLevel(pokemon, level) {
  const moves = pokemon.moves || {}
  const available = []

  for (const [key, moveList] of Object.entries(moves)) {
    // Skip TM and egg moves
    if (key === 'tm' || key === 'egg') continue

    let moveLevel = 1
    if (key === 'start') {
      moveLevel = 1
    } else if (key.startsWith('level')) {
      moveLevel = parseInt(key.replace('level', ''), 10)
    } else {
      // Unknown key format, skip
      continue
    }

    if (moveLevel <= level && Array.isArray(moveList)) {
      available.push(...moveList)
    }
  }

  // Return unique move IDs
  return [...new Set(available)]
}

/**
 * Calculate HP for a Pokemon based on hit dice, CON score, level, and method
 * @param {string} hitDice - Hit dice string (e.g., "d6", "d8")
 * @param {number} conScore - Constitution score
 * @param {number} level - Pokemon level
 * @param {string} method - "average" or "roll"
 * @returns {Object} { hp, maxHp, rolls, breakdown }
 */
export function calculateHP(hitDice, conScore, level, method) {
  // Parse die value from string like "d6" -> 6
  const dieValue = parseInt(hitDice.replace('d', ''), 10) || 6
  const conMod = Math.floor((conScore - 10) / 2)

  if (method === 'average') {
    // Average calculation: max die at level 1, then average (rounded up) for each additional level
    const avgDie = Math.ceil(dieValue / 2 + 0.5) // d6 -> 4, d8 -> 5
    const baseHp = dieValue + ((level - 1) * avgDie)
    const conBonus = level * conMod
    const totalHp = Math.max(1, baseHp + conBonus)

    return {
      hp: totalHp,
      maxHp: totalHp,
      rolls: null,
      breakdown: {
        hitDice,
        conScore,
        conModifier: conMod,
        level,
        method: 'average',
        dieValue,
        perLevelValues: [dieValue, ...Array(level - 1).fill(avgDie)],
        conBonus,
        total: totalHp
      }
    }
  }

  // Roll method: max die at level 1, random rolls for levels 2+
  const rolls = [dieValue] // Level 1 is always max
  for (let i = 2; i <= level; i++) {
    rolls.push(Math.floor(Math.random() * dieValue) + 1)
  }
  const baseHp = rolls.reduce((sum, r) => sum + r, 0)
  const conBonus = level * conMod
  const totalHp = Math.max(1, baseHp + conBonus)

  return {
    hp: totalHp,
    maxHp: totalHp,
    rolls,
    breakdown: {
      hitDice,
      conScore,
      conModifier: conMod,
      level,
      method: 'roll',
      dieValue,
      perLevelValues: rolls,
      conBonus,
      total: totalHp
    }
  }
}

/**
 * Get move details for an array of move IDs
 * @param {Array} moveIds - Array of move ID strings
 * @param {number} level - Pokemon level (used to determine levelLearned)
 * @param {Object} pokemon - Pokemon object (used to determine levelLearned for each move)
 * @returns {Array} Array of move objects with full details
 */
export function getMovesWithDetails(moveIds, level = 1, pokemon = null) {
  const allMoves = getAllMoves()

  return moveIds.map(moveId => {
    const move = allMoves.find(m => m.id === moveId.toLowerCase())
    if (!move) {
      return {
        id: moveId,
        name: moveId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        type: 'normal',
        levelLearned: 1,
        description: 'Move data not found'
      }
    }

    // Determine what level this move was learned at
    let levelLearned = 1
    if (pokemon && pokemon.moves) {
      for (const [key, moveList] of Object.entries(pokemon.moves)) {
        if (key === 'tm' || key === 'egg') continue
        if (Array.isArray(moveList) && moveList.includes(moveId)) {
          if (key === 'start') {
            levelLearned = 1
          } else if (key.startsWith('level')) {
            levelLearned = parseInt(key.replace('level', ''), 10)
          }
          break
        }
      }
    }

    return {
      id: move.id,
      name: move.name,
      type: move.type,
      levelLearned,
      description: move.description,
      power: move.power,
      time: move.time,
      pp: move.pp,
      range: move.range,
      duration: move.duration,
      higherLevels: move.higherLevels
    }
  })
}

/**
 * Build a PlayerPokemon response object with full Pokemon details
 * @param {Object} dbRecord - Database record from player_pokemon table
 * @param {Object} pokemonData - Pokemon data from Source folder (optional, will be looked up if not provided)
 * @returns {Object} Full PlayerPokemon response object
 */
export function buildPlayerPokemonResponse(dbRecord, pokemonData = null) {
  const pokemon = pokemonData || getPokemonById(dbRecord.pokemon_id)

  if (!pokemon) {
    return {
      id: dbRecord.id,
      pokemonId: dbRecord.pokemon_id,
      name: 'Unknown Pokemon',
      nickname: dbRecord.nickname,
      isActive: dbRecord.is_active,
      slotNumber: dbRecord.slot_number,
      level: dbRecord.level,
      types: [],
      spriteUrl: null,
      acquiredAt: dbRecord.acquired_at,
      selectedMoves: dbRecord.selected_moves || [],
      currentHp: dbRecord.current_hp || 1,
      maxHp: dbRecord.max_hp || 1,
      hpMethod: dbRecord.hp_method || null,
      hpRolls: dbRecord.hp_rolls || null,
    }
  }

  return {
    id: dbRecord.id,
    pokemonId: dbRecord.pokemon_id,
    name: pokemon.name,
    number: pokemon.number,
    nickname: dbRecord.nickname,
    isActive: dbRecord.is_active,
    slotNumber: dbRecord.slot_number,
    level: dbRecord.level,
    types: pokemon.type || [],
    sr: pokemon.sr,
    spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.number}.png`,
    acquiredAt: dbRecord.acquired_at,
    attributes: pokemon.attributes,
    description: pokemon.description,
    abilities: pokemon.abilities,
    moves: pokemon.moves,
    hp: pokemon.hp,
    ac: pokemon.ac,
    size: pokemon.size,
    minLevel: pokemon.minLevel,
    hitDice: pokemon.hitDice,
    evolution: pokemon.evolution,
    // New fields for move selection and HP
    selectedMoves: dbRecord.selected_moves || [],
    currentHp: dbRecord.current_hp || pokemon.hp,
    maxHp: dbRecord.max_hp || pokemon.hp,
    hpMethod: dbRecord.hp_method || null,
    hpRolls: dbRecord.hp_rolls || null,
  }
}
