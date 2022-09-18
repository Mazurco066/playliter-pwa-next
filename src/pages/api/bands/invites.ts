// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { FetchError, fetchJson } from 'infra/services/http'

// Login using nextjs api and iron session
async function pendingInvitesRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {
    try {
      // Request login endpoint
      const response = await fetchJson(`${process.env.API_BASE_URL}/invitations/pending_invites`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${req.session.user?.token}`
        }
      })

      // Retrieve user data from response
      const { data } = response

      // Returns created account
      res.status(200).json(data)

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
export default withIronSessionApiRoute(pendingInvitesRoute, sessionOptions)
