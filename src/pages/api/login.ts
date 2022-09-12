// Dependencies
import type { User } from '../../domain/types'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'

// Login using nextjs api and iron session
async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  // Retrieve login parameters
  const { username, password } = await req.body

  try {
    // TODO: Axios api invoke here
    const {
      data: { login, avatar_url },
    } = {
      data: {
        login: 'haha',
        avatar_url: 'aqui'
      }
    }

    // Define user  to save on session
    const user = {
      isLoggedIn: true,
      login,
      avatarUrl: avatar_url
    } as User

    // Saving user into session
    req.session.user = user
    await req.session.save()

    // Returns session user
    res.json(user)

  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

// Exporting login service
export default withIronSessionApiRoute(loginRoute, sessionOptions)
