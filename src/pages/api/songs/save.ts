// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApi } from 'infra/services/http'

// Types
import type { SongType } from 'domain/models'

// Save song request
async function saveSongRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {
    // Retrieve parameters
    const {
      id = null,
      bandId = null,
      title,
      writter,
      tone,
      body,
      category,
      embeddedUrl,
      isPublic = true
    } = req.body

    // Request login endpoint
    const url = id ? `/songs/${id}` : `/songs`

    // Verify if is a save or update request
    const response = await requestApi(url, id ? 'put' : 'post', {
      band_id: id ? undefined : bandId,
      title,
      writer: writter,
      tone,
      body,
      category,
      embedded_url : embeddedUrl || null,
      is_public: isPublic
    }, {
      headers: {
        'Content-Type': 'application/json',
        'access_token': req.session.user?.token,
        'refresh_token': req.session.user?.refreshToken,
        'uuid': req.session.user?.id,
      }
    })

     // Verify if request was sucessfull
    if (response.status < 400) {
      
      // Retrieve song data from response
      const { data } = response.data

      const song: SongType = {
        id: data.uuid,
        createdAt: '',
        updatedAt: '',
        title: data.title,
        tone: data.tone,
        writter: data.writer,
        embeddedUrl: data.embedded_url,
        body: data.body,
        isPublic: data.is_public,
        category: {
          id: '',
          createdAt: '',
          updatedAt: '',
          title: data.category,
          description: ''
        },
        band: {
          id: data.band.uuid,
          createdAt: '',
          updatedAt: '',
          logo: data.band.logo,
          owner: '',
          description: data.band.description,
          title: data.band.title
        }
      }

      res.status(200).json(song)

    } else {
      return res.status(response.status).json(response.data)
    }

  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

// Exporting service
export default withIronSessionApiRoute(
  saveSongRoute,
  sessionOptions
)
