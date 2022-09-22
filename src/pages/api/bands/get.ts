// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { FetchError, fetchJson } from 'infra/services/http'

// Types
import type { BandType } from 'domain/models'

// Login using nextjs api and iron session
async function getBandRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {
    try {

      // Retrieve parameters
      const id: string = req.query['id']?.toString() || ''

      // Request login endpoint
      const url = `${process.env.API_BASE_URL}/bands/get/${id}`
      const response = await fetchJson(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${req.session.user?.token}`
        }
      })

      // Retrieve user data from response
      const { data } = response

      // Returns created account
      res.status(200).json(data as BandType)

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
export default withIronSessionApiRoute(getBandRoute, sessionOptions)
