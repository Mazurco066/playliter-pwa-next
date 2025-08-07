// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApi } from 'infra/services/http'

// Remove show note endpoint
async function removeNoteRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {
    // Retrieve parameters
    const { id, noteId } = req.body

    // Request delete band endpoint
    const response = await requestApi(
      `/concerts/${id}/observations/${noteId}`,
      'delete',
      undefined,
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
  removeNoteRoute,
  sessionOptions
)
