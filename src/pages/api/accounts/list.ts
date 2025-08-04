// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApi } from 'infra/services/http'

// Types
import type { AccountType } from 'domain/models'

// List accounts
async function listAccountsRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {

    // List accounts endpoint
    const response = await requestApi(`/users`, 'get', undefined, {
      headers: {
        'Content-Type': 'application/json',
        'access_token': req.session.user?.token,
        'refresh_token': req.session.user?.refreshToken,
        'uuid': req.session.user?.id,
      }
    })

    // Verify if request was sucessfull
    if (response.status < 400) {

      // Retrieve accounts data from response and return
      const { data } = response.data  

      const newData: AccountType[] = data.map((user: any) => ({
        id: user.uuid,
        userId: user.uuid,
        createdAt: '',
        updatedAt: '',
        avatar: user.avatar,
        email: user.email,
        isEmailconfirmed: user.is_email_valid,
        name: user.name,
        role: user.role,
        username: user.email,
      }))

      res.status(200).json(newData)

    } else {
      res.status(response.status).json(response.data)
    }

  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

// Exporting service
export default withIronSessionApiRoute(listAccountsRoute, sessionOptions)
