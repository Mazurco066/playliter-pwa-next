// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApi } from 'infra/services/http'

// Types
import type { ShowType } from 'domain/models'

// Clone show endpoint
async function cloneConcetRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {
    // Retrieve parameters
    const { id, date } = req.body

    // Request concert cloning endpoint
    const response = await requestApi(
      `/clone_concert/${id}`,
      'post',
      { date: `${date}T23:59:59Z` },
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
      // Returns updated band
      const { data } = response.data

      const newData: ShowType = {
        id: data.uuid,
        createdAt: '',
        updatedAt: '',
        title: data.title,
        description: data.description,
        date: data.date,
        band: {
          id: data.band.uuid,
          createdAt: '',
          updatedAt: '',
          title: data.band.title,
          description: data.band.description,
          logo: data.band.logo,
        },
        songs: data.songs.map((song: any) => ({
          id: song.uuid,
          createdAt: '',
          updatedAt: '',
          title: song.title,
          embeddedUrl: song.embedded_url,
          writter: song.writer,
          tone: song.tone,
          body: song.body,
          isPublic: song.is_public,
        })),
        observations: data.observations.map((obs: any) => ({
          id: obs.uuid,
          title: obs.title,
          data: obs.description,
        })) 
      }

      res.status(200).json(newData)

    } else {
      return res.status(response.status).json(response.data)
    }

  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

// Exporting service
export default withIronSessionApiRoute(
  cloneConcetRoute,
  sessionOptions
)
