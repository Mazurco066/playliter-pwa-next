import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'

async function userAgenteRoute(req: NextApiRequest, res: NextApiResponse) {
  const userAgent = req.headers['user-agent']

  // Check if the user agent contains 'Android'
  const isAndroid = userAgent?.includes('Android')

  res.status(200).json({ isAndroid })
}

export default withIronSessionApiRoute(userAgenteRoute, sessionOptions)