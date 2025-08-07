// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApi } from 'infra/services/http'

// Save show note endpoint
async function saveNoteRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {
    // Retrieve parameters
    const {
      id = null,
      showId,
      title,
      data
    } = req.body

    // Save note endpoint
    const url = id ? `/concerts/${showId}/observations/${id}` : `/concerts/${showId}/observations`

    // Request save note endpoint
    const response = await requestApi(
      url,
      id ? 'put' : 'post',
      { 
        title,
        description: data,
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
      // Returns updated show
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
  saveNoteRoute,
  sessionOptions
)
