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
      const response = await requestApi(
        `/band_requests`,
        'get',
        undefined,
        {
          headers: {
            'Content-Type': 'application/json',
            'access_token': req.session.user?.token,
            'refresh_token': req.session.user?.refreshToken,
            'uuid': req.session.user?.id,
          },
          params: {
            limit: 999,
          }
        }
      )

      // Verify if request was sucessfull
      if (response.status < 400) {
        // Retrieve user data from response
        const { data } = response.data

        const newData: InviteType[] = data.map((invite: any) => ({
          id: invite.uuid,
          createdAt: '',
          updatedAt: '',
          response: invite.status,
          account: {
            id: invite.user.uuid,
            userId: invite.user.uuid,
            createdAt: '',
            updatedAt: '',
            avatar: invite.user.avatar,
            email: invite.user.email,
            isEmailconfirmed: true,
            name: invite.user.name,
            role: '',
            username: invite.user.email
          },
          band: {
            id: invite.band.uuid,
            createdAt: '',
            updatedAt: '',
            title: invite.band.title,
            description: invite.band.description
          }
        }))
        
        // Returns bands list
        res.status(200).json(newData)

      } else {
        res.status(response.status).json(response.data)
      }

  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

// Exporting login service
export default withIronSessionApiRoute(pendingInvitesRoute, sessionOptions)
