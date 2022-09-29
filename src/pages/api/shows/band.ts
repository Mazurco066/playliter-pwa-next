// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApi } from 'infra/services/http'

// Types
import type { ShowType } from 'domain/models'

// List band shows
async function bandShowsRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {

    // Retrieve parameters
    const band = req.query?.band?.toString() || ''
    const limit = parseInt(req.query?.limit?.toString() || '0')
    const offset = parseInt(req.query?.offset?.toString() || '0')

    // Request pending invites endpoint
    const response = await requestApi(`/shows/get/${band}?limit=${limit}&offset=${offset}`, 'get', undefined, {
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

// Exporting service
export default withIronSessionApiRoute(bandShowsRoute, sessionOptions)
