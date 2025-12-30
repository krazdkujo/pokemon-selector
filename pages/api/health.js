import { checkSupabaseConnection } from '../../lib/supabase'
import { checkSourceAvailability } from '../../lib/pokemonData'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const timestamp = new Date().toISOString()

  try {
    // Check Supabase connection with latency measurement
    const supabaseStatus = await checkSupabaseConnection()

    // Check Source folder availability
    const sourceStatus = checkSourceAvailability()

    // Determine overall health status
    let status = 'healthy'
    if (!supabaseStatus.connected || !sourceStatus.available) {
      status = 'unhealthy'
    } else if (supabaseStatus.warning) {
      status = 'degraded'
    }

    const response = {
      status,
      timestamp,
      supabase: {
        connected: supabaseStatus.connected,
        latency: supabaseStatus.latency,
      },
      source: {
        available: sourceStatus.available,
      },
    }

    // Add Supabase error or warning if present
    if (supabaseStatus.error) {
      response.supabase.error = supabaseStatus.error
    }
    if (supabaseStatus.warning) {
      response.supabase.warning = supabaseStatus.warning
    }

    // Add Source entity counts if available
    if (sourceStatus.available && sourceStatus.entityCounts) {
      response.source.entityCounts = sourceStatus.entityCounts
    }
    if (sourceStatus.error) {
      response.source.error = sourceStatus.error
    }

    const httpStatus = status === 'unhealthy' ? 503 : 200
    return res.status(httpStatus).json(response)
  } catch (error) {
    return res.status(503).json({
      status: 'unhealthy',
      timestamp,
      supabase: {
        connected: false,
        error: error.message || 'Failed to check health status',
      },
      source: {
        available: false,
        error: 'Unable to check Source folder',
      },
    })
  }
}
