// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApi } from 'infra/services/http'

// Types
import type { SongType } from 'domain/models'

// List public songs
async function listPublicSongsRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {

    // Retrieve parameters
    const limit = parseInt(req.query?.limit?.toString() || '0')
    const offset = parseInt(req.query?.offset?.toString() || '0')
    const filter = req.query?.filter?.toString() || ''

    // Request login endpoint
    const response = await requestApi(`/songs/get/public_songs?limit=${limit}&offset=${offset}&filter=${filter}`, 'get', undefined, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.session.user?.token}`
      }
    })

    // Verify if request was sucessfull
    if (response.status < 400) {
      // Retrieve user data from response
      const { data: { total, data: songs } } = response.data

      // Compute pagination
      const previousOffset = (offset < limit) ? 0 : offset - limit
      const nextOffset = (offset + limit)

      // Returns shows list
      res.status(200).json({
        previousId: previousOffset,
        data: songs as SongType[],
        nextId: nextOffset > total ? null : nextOffset,
        total: total
      })

    } else {
      res.status(response.status).json(response.data)
    }

  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

// Exporting service
export default withIronSessionApiRoute(listPublicSongsRoute, sessionOptions)
