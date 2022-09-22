// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { FetchError, fetchJson } from 'infra/services/http'

// Types
import type { BandType } from 'domain/models'

// Create band
async function saveBandRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {
    try {

      // Retrieve parameters
      const { id = null, title, description } = req.body

      // Request login endpoint
      const url = id
        ? `${process.env.API_BASE_URL}/bands/${id}`
        : `${process.env.API_BASE_URL}/bands`

      // Verify if is a save or update request
      const response = await fetchJson(url, {
        method: id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${req.session.user?.token}`
        },
        body: JSON.stringify({ title, description })
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
export default withIronSessionApiRoute(saveBandRoute, sessionOptions)
