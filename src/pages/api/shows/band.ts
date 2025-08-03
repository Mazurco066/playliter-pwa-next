// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApi } from 'infra/services/http'

// Types
import type { ShowType } from 'domain/models'

// List band shows
async function bandShowsRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {

    // Retrieve parameters
    const band = req.query?.band?.toString() || ''
    const limit = parseInt(req.query?.limit?.toString() || '999')
    const page = parseInt(req.query?.page?.toString() || '1')

    // Request pending invites endpoint
    const response = await requestApi(`/concerts?limit=${limit}&page=${page}&band_id=${band}`, 'get', undefined, {
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

// Exporting service
export default withIronSessionApiRoute(bandShowsRoute, sessionOptions)
