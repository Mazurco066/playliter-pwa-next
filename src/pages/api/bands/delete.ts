// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApi } from 'infra/services/http'

// Types
import type { BandType } from 'domain/models'

// Delete band endpoint
async function deleteBandRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {
    // Retrieve member parameters
    const { bandId } = await req.body

    // Request delete band endpoint
    const response = await requestApi(`/bands/${bandId}`, 'delete', undefined, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.session.user?.token}`
      }
    })

    // Verify if request was sucessfull
    if (response.status < 400) {
      // Returns updated band
      const { data } = response.data
      res.status(200).json(data as BandType)

    } else {
      return res.status(response.status).json(response.data)
    }

  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

// Exporting service
export default withIronSessionApiRoute(
  deleteBandRoute,
  sessionOptions
)
