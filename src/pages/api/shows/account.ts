// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApi } from 'infra/services/http'

// Types
import type { ShowType } from 'domain/models'

// Account shows request
async function accountShowsRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {
    // Request account shows
    const response = await requestApi(`/shows/get/account_shows`, 'get', undefined, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.session.user?.token}`
      }
    })

    // Verify if request was sucessfull
    if (response.status < 400) {

      // Retrieve shows list
      const { data } = response.data
      res.status(200).json(data as ShowType[])

    } else {
      res.status(response.status).json(response.data)
    }

  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

// Exporting service
export default withIronSessionApiRoute(accountShowsRoute, sessionOptions)
