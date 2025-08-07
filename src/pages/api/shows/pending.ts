// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApi } from 'infra/services/http'

// Types
import type { ShowType } from 'domain/models'

// Login using nextjs api and iron session
async function pendingShowsRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {
    // Request pending invites endpoint
    const response = await requestApi(
      `/pending_concerts`,
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
          limit: 30,
        }
      }
    )

    // Verify if request was sucessfull
    if (response.status < 400) {
      // Retrieve user data from response
      const { data } = response.data

      const newData: ShowType[] = data.map((show: any) => ({
        id: show.uuid,
        createdAt: '',
        updatedAt: '',
        title: show.title,
        description: show.description,
        date: show.date,
        band: {
          id: show.band.uuid,
          createdAt: '',
          updatedAt: '',
          title: show.band.title,
          description: show.band.description,
          logo: show.band.logo,
        }
      }))

      // Returns shows list
      res.status(200).json(newData)

    } else {
      res.status(response.status).json(response.data)
    }

  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

// Exporting login service
export default withIronSessionApiRoute(pendingShowsRoute, sessionOptions)
