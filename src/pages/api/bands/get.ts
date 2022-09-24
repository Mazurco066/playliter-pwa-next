// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApi } from 'infra/services/http'

// Types
import type { BandType } from 'domain/models'

// Retrieve single band
async function getBandRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {
    // Retrieve parameters
    const id: string = req.query['id']?.toString() || ''

    // Request band endpoint
    const response = await requestApi(
      `/bands/get/${id}`,
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
      // Retrieve user data from response
       const { data } = response.data

      // Returns found band
      res.status(200).json(data as BandType)

    } else {
      res.status(response.status).json(response.data)
    }
 
  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

// Exporting service
export default withIronSessionApiRoute(getBandRoute, sessionOptions)
