// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApi } from 'infra/services/http'

// Respond invite endpoint
async function respondInviteRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {
    // Retrieve login parameters
    const { id, band, user_response } = req.body

    // Request login endpoint
    const response = await requestApi(
      `/bands/${band}/invite/${id}`,
      'put', 
      {
        status: user_response
      },
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
      // Retrieve user data from response
      const { data } = response.data

      // Returns created account
      res.status(200).json(data)

    } else {
      return res.status(response.status).json(response.data)
    }

  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

// Exporting service
export default withIronSessionApiRoute(respondInviteRoute, sessionOptions)
