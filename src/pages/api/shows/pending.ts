// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApi } from 'infra/services/http'

// Types
import type { ShowType } from 'domain/models'

// Login using nextjs api and iron session
async function pendingShowsRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {
    // Request pending invites endpoint
    const response = await requestApi(`/shows/get/pending_shows`, 'get', undefined, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.session.user?.token}`
      }
    })

    // Verify if request was sucessfull
    if (response.status < 400) {
      // Retrieve user data from response
      const { data } = response.data

      // Returns shows list
      res.status(200).json(data as ShowType[])

    } else {
      res.status(response.status).json(response.data)
    }

  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

// Exporting login service
export default withIronSessionApiRoute(pendingShowsRoute, sessionOptions)
