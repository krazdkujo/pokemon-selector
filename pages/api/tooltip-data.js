import { getMoveById, getAbilityById } from '../../lib/pokemonData'

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { type, id } = req.query

  if (!type || !id) {
    return res.status(400).json({
      success: false,
      error: 'Missing required parameters: type and id'
    })
  }

  if (type !== 'move' && type !== 'ability') {
    return res.status(400).json({
      success: false,
      error: 'Invalid type parameter. Must be "move" or "ability"'
    })
  }

  if (type === 'move') {
    const move = getMoveById(id)
    if (!move) {
      return res.status(404).json({
        success: false,
        error: `Move not found: ${id}`
      })
    }
    return res.json({ success: true, type: 'move', data: move })
  }

  if (type === 'ability') {
    const ability = getAbilityById(id)
    if (!ability) {
      return res.status(404).json({
        success: false,
        error: `Ability not found: ${id}`
      })
    }
    return res.json({ success: true, type: 'ability', data: ability })
  }
}
