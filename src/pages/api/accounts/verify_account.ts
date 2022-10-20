// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApi } from 'infra/services/http'

// Types
import type { AccountType } from 'domain/models'

// Verify account endpoint
async function verifyAccountRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {

    // Retrieve user code
    const { code } = req.body

    // Verify account endpoint
    const response = await requestApi(`/accounts/verify_account`, 'post', { code }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.session.user?.token}`
      }
    })

    // Verify if request was sucessfull
    if (response.status < 400) {
      
      // Retrieve accounts data from response and return
      const { data } = response.data
      res.status(200).json(data as AccountType[])

    } else {
      res.status(response.status).json(response.data)
    }

  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

// Exporting service
export default withIronSessionApiRoute(verifyAccountRoute, sessionOptions)
