// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApi } from 'infra/services/http'

// Types
import type { InviteType } from 'domain/models'

// List pending invites
async function pendingInvitesRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {
      // Pending invites endpoint
      const response = await requestApi(`/invitations/pending_invites`, 'get', undefined, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${req.session.user?.token}`
        }
      })

      // Verify if request was sucessfull
      if (response.status < 400) {
        // Retrieve user data from response
        const { data } = response.data
        
        // Returns bands list
        res.status(200).json(data as InviteType[])

      } else {
        res.status(response.status).json(response.data)
      }

  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

// Exporting login service
export default withIronSessionApiRoute(pendingInvitesRoute, sessionOptions)
