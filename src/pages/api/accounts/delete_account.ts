// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApi } from 'infra/services/http'

// Types
import type { AccountType } from 'domain/models'

// Promote member endpoint
async function deleteAccountRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {
    // Request promote member endpoint
    const response = await requestApi(
      `/users/${req.session.user?.id}`,
      'delete',
      undefined,
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
