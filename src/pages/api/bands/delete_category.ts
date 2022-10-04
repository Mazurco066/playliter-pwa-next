// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApi } from 'infra/services/http'

// Delete category
async function deleteCategoryRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {
    // Retrieve parameters
    const { id } = req.body

    // Request login endpoint
    const url = `/categories/${id}`

    // Verify if is a save or update request
    const response = await requestApi(url, 'delete', undefined, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.session.user?.token}`
      }
    })

     // Verify if request was sucessfull
    if (response.status < 400) {
      
      // Returns delete response
      const { data } = response.data
      res.status(200).json(data)

    } else {
      return res.status(response.status).json(response.data)
    }

  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

// Exporting login service
export default withIronSessionApiRoute(deleteCategoryRoute, sessionOptions)
