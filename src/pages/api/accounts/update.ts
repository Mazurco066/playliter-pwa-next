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
  const { id, avatar, name, email, password } = await req.body

  /*
    All fields
    "name": "Gabriel Mazurco",
    "email": "mazurco066@gmail.com",
    "avatar": "https://res.cloudinary.com/r4kta/image/upload/v1653783107/playliter_profile_pictures/jotaro_mi3hii.jpg",
    "oldPassword": string,
    "password": string,
    "confirmPassword": string
  */

  // Request login endpoint
  const response = await requestApi(`/accounts/${id}`, 'put', {
    avatar,
    name,
    email,
    password
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${req.session.user?.token}`
    }
  })

  // Verify if request was sucessfull
  if (response.status < 400) {
    // Retrieve user data from response
    const { data } = response.data

    // Returns created account
    res.status(200).json(data as AccountType)

  } else {
    return res.status(response.status).json(response.data)
  }
}

// Exporting service
export default withIronSessionApiRoute(updateAccountRoute, sessionOptions)
