// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApi } from 'infra/services/http'

// Types
import type { SongType } from 'domain/models'

// Retrieve single song
async function getSongsRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {
    // Retrieve parameters
    const id: string = req.query['id']?.toString() || ''

    // Request band endpoint
    const response = await requestApi(
      `/songs/${id}`,
      'get',
      undefined,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${req.session.user?.token}`
        }
      }
    )

    // Verify if request was sucessfull
    if (response.status < 400) {
      
      // Retrieve song data from response
      const { data } = response.data
      res.status(200).json(data as SongType)

    } else {
      res.status(response.status).json(response.data)
    }
 
  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

// Exporting service
export default withIronSessionApiRoute(
  getSongsRoute,
  sessionOptions
)
