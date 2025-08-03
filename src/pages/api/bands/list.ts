// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApi } from 'infra/services/http'

// Types
import type { BandType } from 'domain/models'

// List bands
async function listBandsRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {
    // Retrieve parameters
    const limit = parseInt(req.query?.limit?.toString() || '0')
    const page = parseInt(req.query?.page?.toString() || '1')

    // Request bands list
    const response = await requestApi(`/bands?limit=${limit}&page=${page}`, 'get', undefined, {
      headers: {
        'Content-Type': 'application/json',
        'access_token': req.session.user?.token,
        'refresh_token': req.session.user?.refreshToken,
        'uuid': req.session.user?.id,
      }
    })

    // Verify if request was sucessfull
    if (response.status < 400) {
      // Retrieve user data from response
      const {
        pagination: {
          total_items,
          total_pages,
        },
        data,
      } = response.data

      // Adapt band object
      const newData: BandType[] = data.map((band: any) => ({
        id: band.uuid,
        createdAt: "",
        updatedAt: "",
        title: band.title,
        description: band.description,
        logo: band.logo,
        admins: band.members.filter((m: any) => m.role === 'MODERATOR').map((m: any) => ({
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
        members: band.members.filter((m: any) => m.role === 'MEMBER').map((m: any) => ({
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
          id: band.members.filter((m: any) => m.role === 'FOUNDER')[0].id,
          userId: band.members.filter((m: any) => m.role === 'FOUNDER')[0].user.uuid,
          createdAt: '',
          updatedAt: '',
          avatar: band.owner.avatar,
          email: band.owner.email,
          isEmailconfirmed: true,
          name: band.owner.name,
          role: 'FOUNDER',
          username: band.owner.email
        }
      }))

      const prevPage = page - 1 === 0 ? null : page -1;
      const nextpage = (page + 1) <= total_pages ? page + 1 : null
      
      // Returns bands list
      res.status(200).json({
        previousId: prevPage,
        data: newData,
        nextId: nextpage,
        total: total_items
      })

    } else {
      res.status(response.status).json(response.data)
    }

  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

// Exporting login service
export default withIronSessionApiRoute(listBandsRoute, sessionOptions)
