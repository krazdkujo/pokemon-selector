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
