// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApi } from 'infra/services/http'

// Types
import type { AccountType } from 'domain/models'

// Resent verification E-mail
async function resendVerificationRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {

    // Resend verificarion email endpoint
    const response = await requestApi(`/accounts/resend_verification_email`, 'post', undefined, {
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
export default withIronSessionApiRoute(resendVerificationRoute, sessionOptions)
