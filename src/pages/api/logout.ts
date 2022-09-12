// Dependencies
import type { User } from '../../domain/types'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'

// Logout using nextjs api and iron session
function logoutRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  req.session.destroy()
  res.json({ isLoggedIn: false, login: '', avatarUrl: '' })
}

// Exporting logout service
export default withIronSessionApiRoute(logoutRoute, sessionOptions)
