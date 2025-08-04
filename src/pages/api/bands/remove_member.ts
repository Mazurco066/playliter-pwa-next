// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApi } from 'infra/services/http'

// Remove member endpoint
async function removeMemberRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {
    // Retrieve member parameters
    const { accountId, bandId } = req.body

    // Request remove member endpoint
    const response = await requestApi(`/bands/${bandId}/members/${accountId}`, 'delete', undefined, {
      headers: {
        'Content-Type': 'application/json',
        'access_token': req.session.user?.token,
        'refresh_token': req.session.user?.refreshToken,
        'uuid': req.session.user?.id,
      }
    })

    // Verify if request was sucessfull
    if (response.status < 400) {
      // Returns updated band
      const { data } = response.data
      res.status(200).json(data)

    } else {
      return res.status(response.status).json(response.data)
    }

  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

// Exporting service
export default withIronSessionApiRoute(
  removeMemberRoute,
  sessionOptions
)
