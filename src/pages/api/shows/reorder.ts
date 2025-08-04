// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApi } from 'infra/services/http'

// Types
import type { ShowType } from 'domain/models'

// Reorder show endpoint
async function reorderShowRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {
    // Retrieve parameters
    const { id, songs } = req.body

    // Request delete band endpoint
    const response = await requestApi(
      `/concerts/${id}/songs`,
      'put',
      {
        songs: songs.map((song: any, index: number) => ({
          songUUID: song,
          order: index + 1
        }))
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'access_token': req.session.user?.token,
          'refresh_token': req.session.user?.refreshToken,
          'uuid': req.session.user?.id,
        }
      }
    )

    // Verify if request was sucessfull
    if (response.status < 400) {
      // Returns updated band
      const { data } = response.data
      res.status(200).json(data)

    } else {
      return res.status(response.status).json(response.data)
    }

  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

// Exporting service
export default withIronSessionApiRoute(
  reorderShowRoute,
  sessionOptions
)
