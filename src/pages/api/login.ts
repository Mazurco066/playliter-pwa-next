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
    '/signin',
    'post',
    {
      email: username,
      password
    },
    {
      headers: {
        'Content-Type': 'application/json'
      },
    }
  )

  const accessToken = response.headers['access_token'];
  const refreshToken = response.headers['refresh_token'];
  const userId = response.headers['uuid'];

  const userResponse = await requestApi(
    `/users/${userId}`,
    'get',
    undefined,
    {
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken,
        'refresh_token': refreshToken,
        'uuid': userId,
      },
    }
  );

  // Verify if request was sucessfull
  if (response.status < 400 && userResponse.status < 400) {
    // Retrieve user data from response
    const { data: {
      uuid,
      avatar,
      email,
      name,
      is_email_valid,
      role,
    }} = userResponse.data

    // Define user  to save on session
    const user = {
      isLoggedIn: true,
      isEmailconfirmed: is_email_valid,
      name: name,
      username: email,
      avatar: avatar,
      token: accessToken,
      refreshToken: refreshToken,
      role: role,
      email: email,
      id: uuid
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
