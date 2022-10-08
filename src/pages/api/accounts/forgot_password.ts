// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApi } from 'infra/services/http'

// Forgot password endpoint
async function forgotPasswordRoute(req: NextApiRequest, res: NextApiResponse) {
  // Retrieve login parameters
  const { email } = req.body

  // Request login endpoint
  const response = await requestApi('/auth/forgot_password', 'post', { email }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // Verify if request was sucessfull
  if (response.status < 400) {
    // Retrieve user data from response
    const { data } = response.data

    // Returns created account
    res.status(200).json(data)

  } else {
    return res.status(response.status).json(response.data)
  }
}

// Exporting service
export default withIronSessionApiRoute(forgotPasswordRoute, sessionOptions)
