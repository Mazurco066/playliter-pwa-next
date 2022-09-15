// Dependencies
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { FetchError, fetchJson } from 'infra/services/http'

// Api types
import type { AccountType } from 'domain/models'

// Login using nextjs api and iron session
async function createAccountRoute(req: NextApiRequest, res: NextApiResponse) {
  // Retrieve login parameters
  const { name, email, username, password } = await req.body

  try {
    // Request login endpoint
    const response = await fetchJson(`${process.env.API_BASE_URL}/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, username, password })
    })

    // Retrieve user data from response
    const { data } = response

    // Returns created account
    res.status(201).json(data as AccountType)

  } catch (error) {
    if (error instanceof FetchError) {
      res.status(error.response.status).json({ message: error.message })
    }
    res.status(500).json({ message: (error as Error).message })
  }
}

// Exporting login service
export default withIronSessionApiRoute(createAccountRoute, sessionOptions)
