// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApi } from 'infra/services/http'

// Api types
import type { AccountType } from 'domain/models'

// Update account endpoint
async function updateAccountRoute(req: NextApiRequest, res: NextApiResponse) {
  // Retrieve login parameters
  const {
    id,
    avatar,
    name,
    email,
    password,
    oldPassword,
    role,
  } = req.body

  // Request login endpoint
  const response = await requestApi(
    `/users/${id}`,
    'put',
    {
      avatar,
      name,
      email,
      password,
      old_password: oldPassword,
      role,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'access_token': req.session.user?.token || '',
        'refresh_token': req.session.user?.refreshToken || '',
        'uuid': req.session.user?.id || '',
      }
    }
  )

  // Verify if request was sucessfull
  if (response.status < 400) {
    // Retrieve user data from response
    const { data } = response.data

    const accountData: AccountType = {
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
    res.status(200).json(accountData)

  } else {
    return res.status(response.status).json(response.data)
  }
}

// Exporting service
export default withIronSessionApiRoute(updateAccountRoute, sessionOptions)
