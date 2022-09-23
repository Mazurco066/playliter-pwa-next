// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { FetchError, fetchJson } from 'infra/services/http'

// Types
import type { SongType } from 'domain/models'

// List public songs
async function listPublicSongsRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {
    try {

      // Retrieve parameters
      const limit = req.query?.limit || 0
      const offset = req.query?.offset || 0

      // Request login endpoint
      const url = `${process.env.API_BASE_URL}/songs/public_songs?limit=${limit}&offset=${offset}`
      const response = await fetchJson(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${req.session.user?.token}`
        }
      })

      // Retrieve user data from response
      const { data: { data: songs } } = response

      // Returns public songs
      res.status(200).json(songs as SongType[])

    } catch (error) {
      if (error instanceof FetchError) {
        res.status(error.response.status).json({ message: error.message })
      }
      res.status(500).json({ message: (error as Error).message })
    }

  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

// Exporting login service
export default withIronSessionApiRoute(listPublicSongsRoute, sessionOptions)
