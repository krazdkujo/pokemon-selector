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
    }
  }

  return {
    id: dbRecord.id,
    pokemonId: dbRecord.pokemon_id,
    name: pokemon.name,
    nickname: dbRecord.nickname,
    isActive: dbRecord.is_active,
    slotNumber: dbRecord.slot_number,
    level: dbRecord.level,
    types: pokemon.type || [],
    spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.number}.png`,
    acquiredAt: dbRecord.acquired_at,
    attributes: pokemon.attributes,
    description: pokemon.description,
    abilities: pokemon.abilities,
    hp: pokemon.hp,
    ac: pokemon.ac,
  }
}
