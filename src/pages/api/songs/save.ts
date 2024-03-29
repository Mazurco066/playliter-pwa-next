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
    const url = id ? `/songs/${id}` : `/songs/${bandId}`

    // Verify if is a save or update request
    const response = await requestApi(url, id ? 'put' : 'post', {
      title,
      writter,
      tone,
      body,
      category,
      embeddedUrl : embeddedUrl || null,
      isPublic
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.session.user?.token}`
      }
    })

     // Verify if request was sucessfull
    if (response.status < 400) {
      
      // Retrieve song data from response
      const { data } = response.data
      res.status(200).json(data as SongType)

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
