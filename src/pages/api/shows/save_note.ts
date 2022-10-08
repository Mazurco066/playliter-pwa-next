// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApi } from 'infra/services/http'

// Types
import type { ShowType } from 'domain/models'

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
    const url = id ? `/shows/${showId}/${id}/update_observation` : `/shows/${showId}/add_observation`

    // Request save note endpoint
    const response = await requestApi(url, id ? 'put' : 'post', { title, data }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.session.user?.token}`
      }
    })

    // Verify if request was sucessfull
    if (response.status < 400) {
      // Returns updated show
      const { data } = response.data
      res.status(200).json(data as ShowType)

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
