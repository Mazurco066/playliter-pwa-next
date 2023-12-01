// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApi } from 'infra/services/http'

// Retrieve single show
async function getLiturgyColoraRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {
    // Retrieve parameters
    const id: string = req.query['id']?.toString() || ''

    // Request helper endpoint
    const response = await requestApi(
      `/helpers/liturgy_color/${id}`,
      'get',
      undefined,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${req.session.user?.token}`
        }
      }
    )

    // Verify if request was sucessfull
    if (response.status < 400) {
      
      // Retrieve show data from response
      const { data } = response.data
      res.status(200).json(data as { color: string })

    } else {
      res.status(response.status).json(response.data)
    }
 
  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

// Exporting service
export default withIronSessionApiRoute(
  getLiturgyColoraRoute,
  sessionOptions
)
