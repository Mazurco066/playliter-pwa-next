// Dependencies
import type { User } from 'domain/types'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApi } from 'infra/services/http'

// Login using nextjs api and iron session
async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  // Retrieve login parameters
  const { username, password } = await req.body

  // Request login endpoint
  const response = await requestApi(
    '/auth/authenticate',
    'post',
    {
      username,
      password
    },
    {
      headers: {
        'Content-Type': 'application/json'
      },
    }
  )

  // Verify if request was sucessfull
  if (response.status < 400) {

    // Retrieve user data from response
    const { data: {
      token,
      account: {
        isEmailconfirmed,
        name,
        username: login,
        avatar,
        email,
        id
      }
    }} = response.data

    // Define user  to save on session
    const user = {
      isLoggedIn: true,
      isEmailconfirmed: isEmailconfirmed,
      name: name,
      username: login,
      avatar: avatar,
      token: token,
      email: email,
      id: id
    } as User

    // Saving user into session
    req.session.user = user
    await req.session.save()

    // Returns session user
    res.status(200).json(user)
 
  } else {
    res.status(response.status).json(response.data)
  }
}

// Exporting login service
export default withIronSessionApiRoute(loginRoute, sessionOptions)
