// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApi } from 'infra/services/http'

// Delete song endpoint
async function deleteSongRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {
    // Retrieve member parameters
    const { songId } = req.body

    // Request delete song endpoint
    const response = await requestApi(`/songs/${songId}`, 'delete', undefined, {
      headers: {
        'Content-Type': 'application/json',
        'access_token': req.session.user?.token,
        'refresh_token': req.session.user?.refreshToken,
        'uuid': req.session.user?.id,
      }
    })

    // Verify if request was sucessfull
    if (response.status < 400) {

      // Returns deleted song
      res.status(200).json({})

    } else {
      return res.status(response.status).json(response.data)
    }

  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

// Exporting service
export default withIronSessionApiRoute(
  deleteSongRoute,
  sessionOptions
)
