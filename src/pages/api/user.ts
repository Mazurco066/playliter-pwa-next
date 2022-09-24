// Dependencies
import type { User } from 'domain/types'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'infra/services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { requestApi } from 'infra/services/http'

// Refresh user using nextjs api
async function userRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  // Blank user to reset authentication
  const blankUser = {
    isLoggedIn: false,
    isEmailconfirmed: false,
    name: '',
    username: '',
    avatar: '',
    token: '',
    email: '',
    id: ''
  }
  
  // If session contains a user setup
  if (req.session.user) {

    // Validate if user is still valid
    const response = await requestApi('/accounts/me', 'get', undefined, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.session.user?.token}`
      }
    })

    // Verify if request was sucessfull
    if (response.status < 400) {

      // Retrieve user data from response
      const { data: {
        isEmailconfirmed,
        name,
        username: login,
        avatar,
        email,
        id
      }} = response.data

      // Update user on session
      const updatedUser: User = {
        ...req.session.user,
        username: login,
        isEmailconfirmed,
        name,
        avatar,
        email,
        id,
        isLoggedIn: true
      }

      // Saving to session and returning updated user
      req.session.user = updatedUser
      await req.session.save()
      res.status(200).json(updatedUser)
  
    } else {
      if ([401, 403].includes(response.status)) {
        req.session.destroy()
        res.json(blankUser)
      } else {
        res.status(200).json({
          ...req.session.user,
          isLoggedIn: true
        })
      }
    }
  } else {
    res.status(200).json(blankUser)
  }
}

// Exporting refresh user service
export default withIronSessionApiRoute(userRoute, sessionOptions)
