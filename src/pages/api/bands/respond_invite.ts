// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApi } from 'infra/services/http'

// Api types
import type { BandType } from 'domain/models'

// Respond invite endpoint
async function respondInviteRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {
    // Retrieve login parameters
    const { id, user_response } = await req.body

    // Request login endpoint
    const response = await requestApi(`/invitations/respond`, 'post', {
      inviteId: id,
      response: user_response
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.session.user?.token}`
      }
    })

    // Verify if request was sucessfull
    if (response.status < 400) {
      // Retrieve user data from response
      const { data } = response.data

      // Returns created account
      res.status(200).json(data as BandType)

    } else {
      return res.status(response.status).json(response.data)
    }

  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

// Exporting service
export default withIronSessionApiRoute(respondInviteRoute, sessionOptions)
