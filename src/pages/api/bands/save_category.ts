// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApi } from 'infra/services/http'

// Types
import type { CategoryType } from 'domain/models'

// Create category
async function saveCategoryRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {
    // Retrieve parameters
    const {
      id = null,
      bandId,
      title,
      description
    } = req.body

    // Request login endpoint
    const url = id ? `/categories/${id}` : `/categories/${bandId}`

    // Verify if is a save or update request
    const response = await requestApi(url, id ? 'put' : 'post', {
      title, description
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
      res.status(200).json(data as CategoryType)

    } else {
      return res.status(response.status).json(response.data)
    }

  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

// Exporting login service
export default withIronSessionApiRoute(saveCategoryRoute, sessionOptions)
