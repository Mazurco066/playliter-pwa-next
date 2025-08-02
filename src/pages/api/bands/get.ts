// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApi } from 'infra/services/http'

// Types
import type { BandType } from 'domain/models'

// Retrieve single band
async function getBandRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {
    // Retrieve parameters
    const id: string = req.query['id']?.toString() || ''

    // Request band endpoint
    const response = await requestApi(
      `/bands/${id}`,
      'get',
      undefined,
      {
        headers: {
          'Content-Type': 'application/json',
          'access_token': req.session.user?.token,
          'refresh_token': req.session.user?.refreshToken,
          'uuid': req.session.user?.id,
        }
      }
    )

    // Verify if request was sucessfull
    if (response.status < 400) {
      // Retrieve user data from response
      const { data } = response.data

      // Adapt band object
      const newData: BandType = {
        id: data.uuid,
        createdAt: "",
        updatedAt: "",
        title: data.title,
        description: data.description,
        logo: data.logo,
        admins: data.members.filter((m: any) => m.role === 'MODERATOR').map((m: any) => ({
          id: m.id,
          userId: m.user.uuid,
          createdAt: '',
          updatedAt: '',
          avatar: m.user.avatar,
          email: m.user.email,
          isEmailconfirmed: true,
          name: m.user.name,
          role: m.role,
          username: m.user.email
        })),
        members: data.members.filter((m: any) => m.role === 'MEMBER').map((m: any) => ({
          id: m.id,
          userId: m.user.uuid,
          createdAt: '',
          updatedAt: '',
          avatar: m.user.avatar,
          email: m.user.email,
          isEmailconfirmed: true,
          name: m.user.name,
          role: m.role,
          username: m.user.email
        })),
        owner: {
          id: data.members.filter((m: any) => m.role === 'FOUNDER')[0].id,
          userId: data.members.filter((m: any) => m.role === 'FOUNDER')[0].user.uuid,
          createdAt: '',
          updatedAt: '',
          avatar: data.owner.avatar,
          email: data.owner.email,
          isEmailconfirmed: true,
          name: data.owner.name,
          role: 'FOUNDER',
          username: data.owner.email
        }
      }

      // Returns found band
      res.status(200).json(newData)

    } else {
      res.status(response.status).json(response.data)
    }

  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

// Exporting service
export default withIronSessionApiRoute(getBandRoute, sessionOptions)
