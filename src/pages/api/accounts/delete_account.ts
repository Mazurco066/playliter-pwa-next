// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApiV2 } from 'infra/services/http'

// Types
import type { AccountType } from 'domain/models'

// Promote member endpoint
async function deleteAccountRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {
    // Request promote member endpoint
    const response = await requestApiV2('/songs/wipe_account_data', 'delete', undefined, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.session.user?.token}`
      }
    })

    // Verify if request was sucessfull
    if (response.status < 400) {
      // Returns updated band
      const { data } = response.data
      res.status(200).json(data as AccountType)

    } else {
      return res.status(response.status).json(response.data)
    }

  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

// Exporting service
export default withIronSessionApiRoute(
  deleteAccountRoute,
  sessionOptions
)
