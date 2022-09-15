// Dependencies
import type { User } from 'domain/types'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { FetchError, fetchJson } from 'infra/services/http'

// Login using nextjs api and iron session
async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  // Retrieve login parameters
  const { username, password } = await req.body

  try {
    // Request login endpoint
    const response = await fetchJson(`${process.env.API_BASE_URL}/auth/authenticate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })

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
    }} = response

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
    res.json(user)

  } catch (error) {
    if (error instanceof FetchError) {
      res.status(error.response.status).json({ message: error.message })
    }
    res.status(500).json({ message: (error as Error).message })
  }
}

// Exporting login service
export default withIronSessionApiRoute(loginRoute, sessionOptions)
