// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApi } from 'infra/services/http'

// Api types
import type { AccountType } from 'domain/models'

// Create account endpoint
async function createAccountRoute(req: NextApiRequest, res: NextApiResponse) {
  // Retrieve login parameters
  const { name, email, password } = req.body

  // Request login endpoint
  const response = await requestApi(
    `/signup`,
    'post',
    {
      name,
      email,
      password
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  // Verify if request was sucessfull
  if (response.status < 400) {
    // Retrieve user data from response
    const { data } = response.data

    const createdAccount: AccountType = {
      id: data.uuid,
      userId: data.uuid,
      createdAt: '',
      updatedAt: '',
      avatar: data.avatar,
      email: data.email,
      isEmailconfirmed: data.is_email_valid,
      name: data.name,
      role: data.role,
      username: data.email,
    }

    // Returns created account
    res.status(201).json(createdAccount)

  } else {
    return res.status(response.status).json(response.data)
  }
}

// Exporting service
export default withIronSessionApiRoute(createAccountRoute, sessionOptions)
