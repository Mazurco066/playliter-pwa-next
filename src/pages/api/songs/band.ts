// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApi } from 'infra/services/http'

// Types
import type { SongType } from 'domain/models'

// List band songs
async function listBandSongsRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {

    // Retrieve parameters
    const band = req.query?.band?.toString() || ''
    const limit = parseInt(req.query?.limit?.toString() || '10')
    const page = parseInt(req.query?.page?.toString() || '1')
    const filter = req.query?.filter?.toString() || ''

    // Request login endpoint
    const response = await requestApi(`/songs?limit=${limit}&page=${page}&search=${filter}&band_id=${band}`, 'get', undefined, {
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

      const songs: SongType[] = data.map((song: any) => ({
        id: song.uuid,
        createdAt: '',
        updatedAt: '',
        title: song.title,
        tone: song.tone,
        writter: song.writer,
        embeddedUrl: song.embedded_url,
        body: song.body,
        isPublic: song.is_public,
        category: {
          id: '',
          createdAt: '',
          updatedAt: '',
          title: song.category,
          description: ''
        },
        band: {
          id: song.band.uuid,
          createdAt: '',
          updatedAt: '',
          logo: song.band.logo,
          owner: '',
          description: song.band.description,
          title: song.band.title
        }
      }))

      // Compute pagination
      const prevPage = page - 1 === 0 ? null : page - 1;
      const nextpage = (page + 1) <= total_pages ? page + 1 : null

      // Returns shows list
      res.status(200).json({
        previousId: prevPage,
        data: songs as SongType[],
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

// Exporting service
export default withIronSessionApiRoute(listBandSongsRoute, sessionOptions)
